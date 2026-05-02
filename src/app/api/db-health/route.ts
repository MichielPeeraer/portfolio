import { NextResponse } from 'next/server'
import { db } from '@/db'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
    const dbUrl = process.env.DATABASE_URL ?? ''
    const directUrl = process.env.DIRECT_URL ?? ''

    const maskUrl = (u: string) =>
        u ? u.replace(/:([^:@]{4})[^:@]*@/, ':$1***@') : '(not set)'

    const result: Record<string, unknown> = {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: maskUrl(dbUrl),
        directUrl: maskUrl(directUrl),
        dbUrlLength: dbUrl.length,
        dbUrlProject: dbUrl.match(/postgres\.([^:]+):/)?.[1] ?? 'unknown',
    }

    const start = Date.now()
    try {
        await db.execute(sql`SELECT 1`)
        result.dbPing = `OK (${Date.now() - start}ms)`
    } catch (e) {
        result.dbPing = `FAILED (${Date.now() - start}ms): ${e instanceof Error ? e.message : String(e)}`
    }

    return NextResponse.json(result)
}
