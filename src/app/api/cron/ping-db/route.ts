import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { NextResponse } from 'next/server'

/**
 * Cron endpoint to keep the database connection warm.
 * Configure via vercel.json: runs daily at 06:00 UTC.
 * Protected by CRON_SECRET (Vercel sets Authorization header automatically).
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const t0 = Date.now()
        await db.execute(sql`SELECT 1`)
        return NextResponse.json({ ok: true, ms: Date.now() - t0 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error'
        console.error('[cron/ping-db] DB ping failed:', message)
        return NextResponse.json({ ok: false, error: message }, { status: 500 })
    }
}
