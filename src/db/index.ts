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
        30
    )

    const client = postgres(selectedUrl, {
        max: maxConnections,
        // Required for Neon serverless and any pgBouncer transaction-mode pooler.
        prepare: false,
        idle_timeout: idleTimeoutSeconds,
        connect_timeout: connectTimeoutSeconds,
        // Disable built-in statement timeout so app-level timeouts take priority
        connection: {
            statement_timeout: 0,
        },
    })

    return drizzle(client, { schema })
}

export const db = globalThis.__db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
    globalThis.__db = db
}
