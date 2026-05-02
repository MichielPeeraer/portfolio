const SITE_URL_FALLBACK = 'https://michiel-peeraer.vercel.app'

const toHttpsOrigin = (value: string | undefined) => {
    if (!value) return null

    const trimmed = value.trim()
    if (!trimmed) return null

    const maybeWithProtocol =
        trimmed.startsWith('http://') || trimmed.startsWith('https://')
            ? trimmed
            : `https://${trimmed}`

    try {
        const parsed = new URL(maybeWithProtocol)
        if (
            parsed.hostname === 'example.com' ||
            parsed.hostname === 'localhost' ||
            parsed.hostname.endsWith('.local')
        ) {
            return null
        }

        return parsed.origin
    } catch {
        return null
    }
}

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
const parsedSiteUrl = toHttpsOrigin(rawSiteUrl)
if (rawSiteUrl && !parsedSiteUrl) {
    console.warn(
        `[site] NEXT_PUBLIC_SITE_URL="${rawSiteUrl}" could not be parsed as a valid HTTPS origin — falling back to ${SITE_URL_FALLBACK}`
    )
}

const resolvedSiteUrl =
    parsedSiteUrl ??
    toHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    toHttpsOrigin(process.env.VERCEL_URL) ??
    SITE_URL_FALLBACK

export const siteConfig = {
    name: 'Michiel Peeraer',
    title: 'Michiel Peeraer | Full-Stack TypeScript Developer',
    description:
        'Portfolio of Michiel Peeraer — Full-Stack TypeScript developer specialising in MERN/PERN stacks, Python and scalable web applications.',
    url: resolvedSiteUrl,
} as const
