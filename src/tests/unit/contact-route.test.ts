import { beforeEach, describe, expect, it, vi } from 'vitest'

const checkBotIdMock = vi.hoisted(() => vi.fn())
const sendMailMock = vi.hoisted(() => vi.fn())
const createTransportMock = vi.hoisted(() =>
    vi.fn(() => ({
        sendMail: sendMailMock,
    }))
)

vi.mock('botid/server', () => ({
    checkBotId: checkBotIdMock,
}))

vi.mock('nodemailer', () => ({
    default: {
        createTransport: createTransportMock,
    },
}))

const basePayload = {
    FirstName: 'Neo',
    LastName: 'Anderson',
    Email: 'neo@zion.io',
    Phone: '',
    Company: '',
    LinkedIn: '',
    Message: 'Follow the white rabbit.',
    Website: '',
}

const setRouteEnv = (
    overrides?: Partial<Record<string, string | undefined>>
) => {
    const env = {
        SMTP_HOST: 'smtp.example.test',
        SMTP_PORT: '587',
        SMTP_USER: 'user',
        SMTP_PASS: 'pass',
        ADMIN_EMAIL: 'owner@example.test',
        ...overrides,
    }

    const keys = [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'ADMIN_EMAIL',
    ] as const

    for (const key of keys) {
        const value = env[key]
        if (typeof value === 'undefined') {
            delete process.env[key]
        } else {
            process.env[key] = value
        }
    }
}

const loadPost = async (
    overrides?: Partial<Record<string, string | undefined>>
) => {
    vi.resetModules()
    setRouteEnv(overrides)
    const mod = await import('@/app/api/contact/route')
    return mod.POST
}

const buildRequest = (body: unknown, headers?: Record<string, string>) =>
    new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(headers ?? {}),
        },
        body: JSON.stringify(body),
    })

const buildMalformedJsonRequest = () =>
    new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: '{"FirstName":',
    })

describe('contact API route', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        checkBotIdMock.mockResolvedValue({ isBot: false })
        sendMailMock.mockResolvedValue({})
    })

    it('returns 403 when BotID marks request as bot', async () => {
        checkBotIdMock.mockResolvedValue({ isBot: true })
        const POST = await loadPost()

        const response = await POST(buildRequest(basePayload))
        expect(response.status).toBe(403)
        expect(createTransportMock).not.toHaveBeenCalled()
    })

    it('returns 500 when SMTP env is missing', async () => {
        const POST = await loadPost({ SMTP_HOST: undefined })

        const response = await POST(buildRequest(basePayload))
        expect(response.status).toBe(500)
    })

    it('returns 400 for invalid payload', async () => {
        const POST = await loadPost()

        const response = await POST(
            buildRequest({
                ...basePayload,
                Message: '',
            })
        )

        expect(response.status).toBe(400)
    })

    it('returns 400 for malformed JSON body', async () => {
        const POST = await loadPost()

        const response = await POST(buildMalformedJsonRequest())
        expect(response.status).toBe(400)
    })

    it('short-circuits honeypot submissions without sending email', async () => {
        const POST = await loadPost()

        const response = await POST(
            buildRequest({
                ...basePayload,
                Website: 'https://spam.invalid',
            })
        )

        expect(response.status).toBe(200)
        expect(createTransportMock).not.toHaveBeenCalled()
        expect(sendMailMock).not.toHaveBeenCalled()
    })

    it('sends owner email and auto-reply for valid payload', async () => {
        const POST = await loadPost()

        const response = await POST(buildRequest(basePayload))
        const body = (await response.json()) as {
            success: boolean
            autoReplySent?: boolean
        }

        expect(response.status).toBe(200)
        expect(body.success).toBe(true)
        expect(body.autoReplySent).toBe(true)
        expect(createTransportMock).toHaveBeenCalledTimes(1)
        expect(sendMailMock).toHaveBeenCalledTimes(2)
    })

    it('returns 502 when owner delivery fails', async () => {
        sendMailMock.mockRejectedValueOnce(new Error('SMTP failed'))
        const POST = await loadPost()

        const response = await POST(buildRequest(basePayload))
        expect(response.status).toBe(502)
    })

    it('returns 504 when owner delivery times out', async () => {
        vi.useFakeTimers()
        try {
            sendMailMock.mockImplementationOnce(() => new Promise(() => {}))
            const POST = await loadPost()

            const requestPromise = POST(buildRequest(basePayload))
            await vi.advanceTimersByTimeAsync(12_100)
            const response = await requestPromise
            const body = (await response.json()) as { error?: string }

            expect(response.status).toBe(504)
            expect(body.error).toBe('Request timed out. Please try again.')
        } finally {
            vi.useRealTimers()
        }
    })

    it('returns 429 after rate limit threshold for same client IP', async () => {
        const POST = await loadPost()
        const headers = { 'x-forwarded-for': '203.0.113.10' }
        const honeypotPayload = { ...basePayload, Website: 'bot' }

        for (let i = 0; i < 5; i += 1) {
            const response = await POST(buildRequest(honeypotPayload, headers))
            expect(response.status).toBe(200)
        }

        const blocked = await POST(buildRequest(honeypotPayload, headers))
        expect(blocked.status).toBe(429)
    })
})
