import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
    var __db: ReturnType<typeof drizzle> | undefined
}

const cleanConnectionString = (value: string | undefined) =>
    value?.trim().replace(/^['\"]|['\"]$/g, '') ?? ''

const databaseUrl = cleanConnectionString(process.env.DATABASE_URL)

if (!databaseUrl) {
    throw new Error('[db] Missing DATABASE_URL')
}

const client = postgres(databaseUrl, {
    max: 5,
    // Required when connecting through a pgBouncer transaction-mode pooler
    // (e.g. Supabase Session Pooler / Transaction Pooler).
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
})

export const db = globalThis.__db ?? drizzle(client, { schema })

if (process.env.NODE_ENV !== 'production') {
    globalThis.__db = db
}
