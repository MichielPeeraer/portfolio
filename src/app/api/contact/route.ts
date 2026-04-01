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

        await withTimeout(
            transporter.sendMail({
                from: fromEmail,
                to: toEmail,
                replyTo: payload.Email,
                subject: `New contact message from ${payload.FirstName} ${payload.LastName}`,
                text: buildOwnerMessageText(emailData),
                html: buildOwnerMessageHtml(emailData),
            }),
            SUBMIT_TIMEOUT_MS
        )

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

        return NextResponse.json({ success: true })
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
