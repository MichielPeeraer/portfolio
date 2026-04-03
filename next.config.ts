import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const isDev = process.env.NODE_ENV !== 'production'

const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://va.vercel-scripts.com',
]

const scriptSrcAdmin = [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://va.vercel-scripts.com',
]

const connectSrc = [
    "'self'",
    'https://vitals.vercel-insights.com',
    'https://vitals.vercel-analytics.com',
    ...(isDev ? ['ws:', 'wss:', 'http://localhost:*'] : []),
]

const buildCsp = (overrideScriptSrc: string[]) =>
    [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        `script-src ${overrideScriptSrc.join(' ')}`,
        "script-src-attr 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        `connect-src ${connectSrc.join(' ')}`,
        ...(isDev ? [] : ['upgrade-insecure-requests']),
    ].join('; ')

const contentSecurityPolicy = buildCsp(scriptSrc)
const adminContentSecurityPolicy = buildCsp(scriptSrcAdmin)

const nextConfig: NextConfig = {
    poweredByHeader: false,
    async headers() {
        const commonHeaders = [
            {
                key: 'X-Frame-Options',
                value: 'DENY',
            },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
            },
            {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin',
            },
            {
                key: 'Permissions-Policy',
                value: 'camera=(), microphone=(), geolocation=()',
            },
        ]
        return [
            // Admin routes: allow unsafe-eval (required by admin-only libraries
            // such as the rich JSON editor and animation engine)
            {
                source: '/(admin|api/admin)(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: adminContentSecurityPolicy,
                    },
                    ...commonHeaders,
                ],
            },
            // All other routes: strict CSP with no eval
            {
                source: '/((?!admin|api/admin).*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: contentSecurityPolicy,
                    },
                    ...commonHeaders,
                ],
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.boot.dev',
            },
            {
                protocol: 'https',
                hostname: 'duolingo-stats-card.vercel.app',
            },
        ],
    },
}

export default withBotId(nextConfig)
