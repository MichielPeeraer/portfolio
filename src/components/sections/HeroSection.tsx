'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useMatrixLoaderReady, useTypewriter } from '@/hooks'
import { getSocialIcon } from '@/lib/social-icons'
import type { PersonalInfo } from '@/types'

interface HeroSectionProps {
    data: PersonalInfo
}

export default function HeroSection({ data }: HeroSectionProps) {
    const canAnimate = useMatrixLoaderReady()
    const typedLines = useMemo(
        () => data.heroTypedLines ?? [],
        [data.heroTypedLines]
    )
    const typedText = useTypewriter({
        lines: typedLines,
        enabled: canAnimate,
    })

    return (
        <section
            id="hero"
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        >
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.72, opacity: 0 }}
                    animate={canAnimate ? { scale: 1, opacity: 1 } : undefined}
                    transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 18,
                        delay: 0.1,
                    }}
                    className="mb-8"
                >
                    <div className="crt-lines rounded-full w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                        <Image
                            src={data.profileImageUrl || '/profile.jpg'}
                            alt={`Profile photo of ${data.name}`}
                            width={200}
                            height={200}
                            priority
                            className="rounded-full border-2 border-green-400 w-full h-full object-cover grayscale"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
                    transition={{
                        duration: 0.55,
                        delay: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-green-300"
                >
                    {data.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-base sm:text-lg md:text-xl mb-6"
                >
                    {data.title}
                </motion.p>

                {typedLines.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
                        transition={{
                            duration: 0.45,
                            delay: 0.56,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-6 flex w-full justify-center"
                        aria-live="polite"
                    >
                        <span className="inline-block max-w-[calc(100vw-2rem)] rounded border border-green-500/30 bg-black/50 px-3 py-2 text-center text-sm leading-relaxed text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.08)] sm:max-w-2xl sm:px-4 sm:text-base">
                            <span className="text-green-500/80">&gt; </span>
                            <span className="whitespace-normal wrap-break-word">
                                {typedText}
                            </span>
                            <span className="ml-1 inline-block h-[0.95em] w-2 align-[-0.12em] bg-green-400/90 animate-pulse" />
                        </span>
                    </motion.div>
                )}

                {data.status && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
                        transition={{
                            duration: 0.4,
                            delay: 0.58,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex justify-center mb-8"
                    >
                        <span className="inline-flex items-center gap-2 border border-green-500/40 bg-green-950/40 text-green-400 text-sm px-4 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            {data.statusLabel ?? 'Open to opportunities'}
                        </span>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
                    transition={{
                        duration: 0.45,
                        delay: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center items-center"
                >
                    <a
                        href={data.cvPath ?? '/cv.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-400 text-black px-6 py-3 rounded font-semibold transition-all duration-200 hover:bg-green-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(74,222,128,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                        <ExternalLink
                            size={16}
                            className="inline mr-2 -mt-0.5"
                        />
                        View CV
                    </a>
                    <div className="flex space-x-6">
                        {data.contact.socialLinks
                            .filter((link) => link.name !== 'Website')
                            .map((link) => {
                                const Icon = link.icon
                                    ? getSocialIcon(link.icon)
                                    : null
                                if (!Icon) return null
                                return (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-all duration-200 hover:text-green-300 hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                                        aria-label={link.name}
                                    >
                                        <Icon size={24} />
                                    </a>
                                )
                            })}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
