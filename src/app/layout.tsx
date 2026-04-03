import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { siteConfig } from '@/lib/site'
import { MatrixToaster } from '@/components/effects'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.title,
    description: siteConfig.description,
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} | Full-Stack TypeScript Developer`,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    keywords: [
        'Full-Stack Developer',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'MERN',
        'PERN',
        'Python',
        siteConfig.name,
        'Web Developer Belgium',
    ],
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                {children}
                <MatrixToaster />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
