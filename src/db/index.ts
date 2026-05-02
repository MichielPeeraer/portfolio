import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
    var __db: ReturnType<typeof drizzle> | undefined
}

const cleanConnectionString = (value: string | undefined) =>
    value?.trim().replace(/^['\"]|['\"]$/g, '') ?? ''

const parsePositiveInt = (value: string | undefined, fallback: number) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const databaseUrl = cleanConnectionString(process.env.DATABASE_URL)
const directUrl = cleanConnectionString(process.env.DIRECT_URL)

const selectedUrl =
    process.env.NODE_ENV === 'development'
        ? directUrl || databaseUrl
        : databaseUrl || directUrl

const maskUrl = (url: string) =>
    url.replace(/:([^:@]{4})[^:@]*@/, ':$1***@')
console.log('[db] NODE_ENV:', process.env.NODE_ENV)
console.log('[db] DATABASE_URL present:', !!databaseUrl, databaseUrl ? maskUrl(databaseUrl) : 'MISSING')
console.log('[db] DIRECT_URL present:', !!directUrl, directUrl ? maskUrl(directUrl) : 'MISSING')
console.log('[db] selectedUrl:', selectedUrl ? maskUrl(selectedUrl) : 'NONE — will use proxy')

const createMissingDbProxy = () =>
    new Proxy(
        {},
        {
            get() {
                throw new Error('[db] Missing DATABASE_URL')
            },
        }
    ) as ReturnType<typeof drizzle>

const createDb = () => {
    if (!selectedUrl) {
        return createMissingDbProxy()
    }

    const maxConnections = parsePositiveInt(process.env.DB_POOL_MAX, 5)
    const idleTimeoutSeconds = parsePositiveInt(
        process.env.DB_IDLE_TIMEOUT_S,
        20
    )
    const connectTimeoutSeconds = parsePositiveInt(
        process.env.DB_CONNECT_TIMEOUT_S,
        10
    )

    const client = postgres(selectedUrl, {
        max: maxConnections,
        // Required when connecting through a pgBouncer transaction-mode pooler
        // (e.g. Supabase Session Pooler / Transaction Pooler).
        prepare: false,
        idle_timeout: idleTimeoutSeconds,
        connect_timeout: connectTimeoutSeconds,
    })

    return drizzle(client, { schema })
}

export const db = globalThis.__db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
    globalThis.__db = db
}
