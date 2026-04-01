import { checkBotId } from 'botid/server'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const contactPayloadSchema = z.object({
    FirstName: z.string().min(1),
    LastName: z.string().min(1),
    Email: z.email(),
    Phone: z.string().optional(),
    Company: z.string().optional(),
    LinkedIn: z.string().optional(),
    Message: z.string().min(1),
    Website: z.string().optional(),
})

const FORMSPARK_FORM_ID = process.env.FORMSPARK_FORM_ID

if (!FORMSPARK_FORM_ID && process.env.NODE_ENV !== 'production') {
    console.warn(
        '[contact-api] Missing FORMSPARK_FORM_ID. Contact submissions will fail until it is configured.'
    )
}

const SUBMIT_TIMEOUT_MS = 12000

export async function POST(request: Request) {
    const verification = await checkBotId()

    if (verification.isBot) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!FORMSPARK_FORM_ID) {
        return NextResponse.json(
            { error: 'Form server is not configured.' },
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

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, SUBMIT_TIMEOUT_MS)

    try {
        const formsparkPayload = {
            FirstName: payload.FirstName,
            LastName: payload.LastName,
            Email: payload.Email,
            Phone: payload.Phone,
            Company: payload.Company,
            LinkedIn: payload.LinkedIn,
            Message: payload.Message,
        }

        const response = await fetch(
            `https://submit-form.com/${FORMSPARK_FORM_ID}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formsparkPayload),
                signal: controller.signal,
            }
        )

        if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as {
                error?: string
                message?: string
            }

            return NextResponse.json(
                {
                    error:
                        body.error ??
                        body.message ??
                        `Submission failed (${response.status})`,
                },
                { status: 502 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to submit form. Please try again.' },
            { status: 500 }
        )
    } finally {
        clearTimeout(timeoutId)
    }
}
