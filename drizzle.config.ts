import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'
import { existsSync } from 'fs'

if (process.env.DRIZZLE_ENV === 'production' && existsSync('.env.production')) {
    config({ path: '.env.production', override: true })
} else if (existsSync('.env.local')) {
    config({ path: '.env.local' })
}

const cleanConnectionString = (value: string | undefined) =>
    value?.trim().replace(/^['\"]|['\"]$/g, '') ?? ''

const connectionUrl = cleanConnectionString(
    process.env.DATABASE_URL_UNPOOLED ??
        process.env.POSTGRES_URL_NON_POOLING ??
        process.env.DIRECT_URL ??
        process.env.DATABASE_URL ??
        process.env.POSTGRES_URL
)

if (!connectionUrl) {
    throw new Error(
        '[drizzle] Missing DATABASE_URL_UNPOOLED/POSTGRES_URL_NON_POOLING and DATABASE_URL/POSTGRES_URL'
    )
}

export default {
    schema: './src/db/schema.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        // Use the direct (non-pooled) URL for migrations so that DDL
        // statements bypass pgBouncer. Falls back to DATABASE_URL in
        // environments where only one URL is configured.
        url: connectionUrl,
    },
} satisfies Config
