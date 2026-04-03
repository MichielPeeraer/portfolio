const SITE_URL_FALLBACK = 'https://michiel-peeraer.vercel.app'

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
const isPlaceholderSiteUrl =
    configuredSiteUrl === 'example.com' ||
    configuredSiteUrl === 'https://example.com'

const resolvedSiteUrl =
    configuredSiteUrl && !isPlaceholderSiteUrl
        ? configuredSiteUrl
        : SITE_URL_FALLBACK

export const siteConfig = {
    name: 'Michiel Peeraer',
    title: 'Michiel Peeraer | Full-Stack TypeScript Developer',
    description:
        'Portfolio of Michiel Peeraer — Full-Stack TypeScript developer specialising in MERN/PERN stacks, React, Node.js, and scalable web applications.',
    url: resolvedSiteUrl,
} as const
