import { checkBotId } from 'botid/server'
import { sql } from 'drizzle-orm'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import {
    buildAutoReplyHtml,
    buildAutoReplyText,
    buildOwnerMessageHtml,
    buildOwnerMessageText,
} from '@/lib/contact-email'
import { getContactEnv } from '@/lib/env'
import { db } from '@/db'
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

const SUBMIT_TIMEOUT_MS = 12000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5

const getClientAddress = (request: Request) => {
    // x-vercel-forwarded-for is injected by Vercel's edge network and cannot
    // be overridden by the client, making it the most trustworthy source.
    const vercelForwarded = request.headers
        .get('x-vercel-forwarded-for')
        ?.trim()
    if (vercelForwarded) return vercelForwarded

    // x-forwarded-for may be client-controlled when there is no trusted proxy
    // in front; take only the last (rightmost) entry appended by the proxy we
    // do trust rather than the first entry which a client could forge.
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        const ips = forwarded
            .split(',')
            .map((ip) => ip.trim())
            .filter(Boolean)
        const last = ips[ips.length - 1]
        if (last) return last
    }

    return 'unknown'
}

const isRateLimited = async (key: string): Promise<boolean> => {
    try {
        // Atomic upsert: insert a fresh bucket or increment the existing one.
        // If the window has expired, the row is treated as if it doesn't exist
        // and the counter resets to 1.
        const result = await db.execute(sql`
            INSERT INTO rate_limits (key, count, window_start)
            VALUES (${key}, 1, NOW())
            ON CONFLICT (key) DO UPDATE SET
                count = CASE
                    WHEN rate_limits.window_start < NOW() - (INTERVAL '1 millisecond' * ${RATE_LIMIT_WINDOW_MS})
                    THEN 1
                    ELSE rate_limits.count + 1
                END,
                window_start = CASE
                    WHEN rate_limits.window_start < NOW() - (INTERVAL '1 millisecond' * ${RATE_LIMIT_WINDOW_MS})
                    THEN NOW()
                    ELSE rate_limits.window_start
                END
            RETURNING count
        `)

        // Type-safe extraction of count from postgres.js result
        const count = (result?.[0]?.count as number | undefined) ?? 1

        if (count > RATE_LIMIT_MAX_REQUESTS) {
            console.warn(
                `[rate-limit] Client exceeded rate limit (${count} requests in window)`
            )
            return true
        }
        return false
    } catch (error) {
        // Fail open: if the DB is unavailable don't block legitimate requests.
        console.error('[rate-limit] DB check failed, allowing request:', error)
        return false
    }
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
    let SMTP_HOST = ''
    let SMTP_PORT = ''
    let SMTP_USER = ''
    let SMTP_PASS = ''
    let ADMIN_EMAIL = ''

    try {
        const contactEnv = getContactEnv()
        SMTP_HOST = contactEnv.smtpHost
        SMTP_PORT = contactEnv.smtpPort
        SMTP_USER = contactEnv.smtpUser
        SMTP_PASS = contactEnv.smtpPass
        ADMIN_EMAIL = contactEnv.adminEmail
    } catch {
        return NextResponse.json(
            { error: 'Form server is not configured.' },
            { status: 500 }
        )
    }

    const verification = await checkBotId()

    if (verification.isBot) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const clientAddress = getClientAddress(request)
    // Rate limit is keyed on IP only. This is reliable on Vercel because
    // x-vercel-forwarded-for is injected by the edge network and cannot be
    // spoofed. Do not rely on this outside a trusted-proxy environment.
    if (await isRateLimited(clientAddress)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        )
    }

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
        return NextResponse.json(
            { error: 'Form server is not configured.' },
            { status: 500 }
        )
    }

    const toEmail = ADMIN_EMAIL
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
