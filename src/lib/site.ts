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

const resolvedSiteUrl =
    toHttpsOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    toHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    toHttpsOrigin(process.env.VERCEL_URL) ??
    SITE_URL_FALLBACK

export const siteConfig = {
    name: 'Michiel Peeraer',
    title: 'Michiel Peeraer | Full-Stack TypeScript Developer',
    description:
        'Portfolio of Michiel Peeraer — Full-Stack TypeScript developer specialising in MERN/PERN stacks, React, Node.js, and scalable web applications.',
    url: resolvedSiteUrl,
} as const
