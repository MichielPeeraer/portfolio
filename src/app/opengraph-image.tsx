import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import portfolioData from '@/data/portfolio.json'
import { siteConfig } from '@/lib/site'
import type { PortfolioData } from '@/types'

export const runtime = 'nodejs'
export const alt = `${siteConfig.name} – Full-Stack TypeScript Developer`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
    const data = portfolioData as PortfolioData
    const tech = data.personal.ogTechPills ?? []

    let profileSrc = ''
    try {
        const profilePath = resolve(process.cwd(), 'public/profile.jpg')
        const profileImg = readFileSync(profilePath)
        profileSrc = `data:image/jpeg;base64,${profileImg.toString('base64')}`
    } catch (error) {
        console.error('Failed to read profile image:', error)
        profileSrc = ''
    }
    const linkedInUrl = data.personal.contact.socialLinks.find(
        (link) => link.name === 'LinkedIn'
    )?.url
    const linkedInLabel = linkedInUrl
        ? `linkedin.com${new URL(linkedInUrl).pathname}`
        : siteConfig.url.replace('https://', '')

    return new ImageResponse(
        <div
            style={{
                background: '#000000',
                width: '100%',
                height: '100%',
                display: 'flex',
                position: 'relative',
            }}
        >
            {/* Dot grid background */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(circle, #14532d28 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    display: 'flex',
                }}
            />

            {/* Left accent bar */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '5px',
                    background: 'linear-gradient(180deg, #4ade80, #14532d)',
                    display: 'flex',
                }}
            />

            {/* Bottom border line */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background:
                        'linear-gradient(90deg, #4ade80, #14532d, transparent)',
                    display: 'flex',
                }}
            />

            {/* Main content row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '56px 80px 56px 88px',
                    position: 'relative',
                }}
            >
                {/* Left: text */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                >
                    {/* Terminal label */}
                    <div
                        style={{
                            color: '#166534',
                            fontSize: '15px',
                            letterSpacing: '5px',
                            textTransform: 'uppercase',
                            marginBottom: '24px',
                            display: 'flex',
                        }}
                    >
                        {'> portfolio_'}
                    </div>

                    {/* Name */}
                    <div
                        style={{
                            color: '#86efac',
                            fontSize: '74px',
                            fontWeight: 'bold',
                            lineHeight: 1,
                            marginBottom: '16px',
                            display: 'flex',
                        }}
                    >
                        {data.personal.name}
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            color: '#4ade80',
                            fontSize: '26px',
                            lineHeight: 1.3,
                            marginBottom: '24px',
                            display: 'flex',
                        }}
                    >
                        {data.personal.title}
                    </div>

                    {data.personal.openToWork && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '36px',
                                alignSelf: 'flex-start',
                                border: '1px solid #166534',
                                background: '#052e16cc',
                                color: '#86efac',
                                padding: '8px 14px',
                                borderRadius: '999px',
                            }}
                        >
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#4ade80',
                                    boxShadow: '0 0 18px #4ade80',
                                    display: 'flex',
                                }}
                            />
                            <div
                                style={{
                                    fontSize: '16px',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                }}
                            >
                                {data.personal.openToWorkLabel ??
                                    'Open to opportunities'}
                            </div>
                        </div>
                    )}

                    {/* Tech pills */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            marginBottom: '44px',
                        }}
                    >
                        {tech.map((t) => (
                            <div
                                key={t}
                                style={{
                                    border: '1px solid #14532d',
                                    background: '#052e1666',
                                    color: '#4ade80',
                                    fontSize: '15px',
                                    padding: '5px 14px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                }}
                            >
                                {t}
                            </div>
                        ))}
                    </div>

                    {/* LinkedIn */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#4ade80',
                                flexShrink: 0,
                                display: 'flex',
                            }}
                        />
                        <div
                            style={{
                                color: '#166534',
                                fontSize: '18px',
                                display: 'flex',
                            }}
                        >
                            {linkedInLabel}
                        </div>
                    </div>
                </div>

                {/* Right: photo with rings */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '64px',
                        flexShrink: 0,
                    }}
                >
                    {/* Outer decorative ring */}
                    <div
                        style={{
                            width: '268px',
                            height: '268px',
                            borderRadius: '50%',
                            border: '1px solid #14532d',
                            boxShadow: '0 0 34px rgba(74, 222, 128, 0.16)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Inner border ring */}
                        <div
                            style={{
                                width: '244px',
                                height: '244px',
                                borderRadius: '50%',
                                border: '3px solid #4ade80',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={profileSrc}
                                width={244}
                                height={244}
                                alt=""
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '50%',
                                    backgroundImage:
                                        'repeating-linear-gradient(180deg, rgba(74, 222, 128, 0.02) 0px, rgba(74, 222, 128, 0.02) 2px, transparent 2px, transparent 6px, rgba(74, 222, 128, 0.1) 6px, rgba(74, 222, 128, 0.1) 7px, transparent 7px, transparent 9px)',
                                    opacity: 0.78,
                                    display: 'flex',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        { ...size }
    )
}
