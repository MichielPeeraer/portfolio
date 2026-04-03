import { checkBotId } from 'botid/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import {
    buildAutoReplyHtml,
    buildAutoReplyText,
    buildOwnerMessageHtml,
    buildOwnerMessageText,
} from '@/lib/contact-email'
import type { ContactEmailData } from '@/types'

const MAX_MESSAGE_LENGTH = 5000

const contactPayloadSchema = z.object({
    FirstName: z.string().trim().min(1),
    LastName: z.string().trim().min(1),
    Email: z.email(),
    Phone: z.string().optional(),
    Company: z.string().optional(),
    LinkedIn: z.string().optional(),
    Message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
    Website: z.string().optional(),
})

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL

if (
    (!SMTP_HOST ||
        !SMTP_PORT ||
        !SMTP_USER ||
        !SMTP_PASS ||
        !CONTACT_TO_EMAIL) &&
    process.env.NODE_ENV !== 'production'
) {
    console.warn(
        '[contact-api] Missing one or more required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL.'
    )
}

const SUBMIT_TIMEOUT_MS = 12000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const rateLimitBuckets = new Map<
    string,
    { count: number; windowStart: number }
>()

const getClientAddress = (request: Request) => {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        const firstIp = forwarded.split(',')[0]?.trim()
        if (firstIp) return firstIp
    }

    const realIp = request.headers.get('x-real-ip')?.trim()
    if (realIp) return realIp

    const cfIp = request.headers.get('cf-connecting-ip')?.trim()
    if (cfIp) return cfIp

    return 'unknown'
}

const isRateLimited = (clientAddress: string) => {
    const now = Date.now()

    if (rateLimitBuckets.size > 1024) {
        for (const [key, bucket] of rateLimitBuckets) {
            if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
                rateLimitBuckets.delete(key)
            }
        }
    }

    const bucket = rateLimitBuckets.get(clientAddress)
    if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitBuckets.set(clientAddress, {
            count: 1,
            windowStart: now,
        })
        return false
    }

    if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
        return true
    }

    bucket.count += 1
    return false
}

const sanitizeHeaderValue = (value: string) => value.replace(/[\r\n]/g, '')

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number) => {
    return new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Email request timed out.'))
        }, timeoutMs)

        promise
            .then((result) => {
                clearTimeout(timeoutId)
                resolve(result)
            })
            .catch((error) => {
                clearTimeout(timeoutId)
                reject(error)
            })
    })
}

export async function POST(request: Request) {
    const verification = await checkBotId()

    if (verification.isBot) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const clientAddress = getClientAddress(request)
    if (isRateLimited(clientAddress)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        )
    }

    if (
        !SMTP_HOST ||
        !SMTP_PORT ||
        !SMTP_USER ||
        !SMTP_PASS ||
        !CONTACT_TO_EMAIL
    ) {
        return NextResponse.json(
            { error: 'Form server is not configured.' },
            { status: 500 }
        )
    }

    const toEmail = CONTACT_TO_EMAIL
    const fromEmail = toEmail
    const smtpPort = Number(SMTP_PORT)

    if (!Number.isFinite(smtpPort)) {
        return NextResponse.json(
            { error: 'Form server is misconfigured.' },
            { status: 500 }
        )
    }

    let payload: z.infer<typeof contactPayloadSchema>

    try {
        const body = await request.json()
        const parsed = contactPayloadSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid form payload.' },
                { status: 400 }
            )
        }

        payload = parsed.data
    } catch {
        return NextResponse.json(
            { error: 'Invalid form payload.' },
            { status: 400 }
        )
    }

    if (payload.Website && payload.Website.trim().length > 0) {
        return NextResponse.json({ success: true })
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    })

    try {
        const emailData: ContactEmailData = {
            firstName: payload.FirstName,
            lastName: payload.LastName,
            email: payload.Email,
            phone: payload.Phone,
            company: payload.Company,
            linkedIn: payload.LinkedIn,
            message: payload.Message,
        }

        // Primary delivery: owner notification must succeed.
        await withTimeout(
            transporter.sendMail({
                from: fromEmail,
                to: toEmail,
                replyTo: sanitizeHeaderValue(payload.Email),
                subject: `New contact message from ${payload.FirstName} ${payload.LastName}`,
                text: buildOwnerMessageText(emailData),
                html: buildOwnerMessageHtml(emailData),
            }),
            SUBMIT_TIMEOUT_MS
        )

        // Auto-reply is best-effort and should not fail the overall submission.
        try {
            await withTimeout(
                transporter.sendMail({
                    from: fromEmail,
                    to: payload.Email,
                    subject: 'Thanks for reaching out',
                    html: buildAutoReplyHtml(emailData),
                    text: buildAutoReplyText(emailData),
                }),
                SUBMIT_TIMEOUT_MS
            )

            return NextResponse.json({ success: true, autoReplySent: true })
        } catch {
            return NextResponse.json({ success: true, autoReplySent: false })
        }
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'Email request timed out.'
        ) {
            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to send emails. Please try again.' },
            { status: 502 }
        )
    }
}
