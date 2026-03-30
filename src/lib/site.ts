const SITE_URL_FALLBACK = 'https://michiel-peeraer.vercel.app'

export const siteConfig = {
    name: 'Michiel Peeraer',
    title: 'Michiel Peeraer | Full-Stack TypeScript Developer',
    description:
        'Portfolio of Michiel Peeraer — Full-Stack TypeScript developer specialising in MERN/PERN stacks, React, Node.js, and scalable web applications.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_FALLBACK,
} as const
