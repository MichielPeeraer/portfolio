'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import type { PersonalInfo } from '@/types'

interface HeroSectionProps {
    data: PersonalInfo
}

export default function HeroSection({ data }: HeroSectionProps) {
    return (
        <section
            id="hero"
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="crt-lines rounded-full w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                        <Image
                            src="/profile.jpg"
                            alt={data.name}
                            width={200}
                            height={200}
                            priority
                            className="rounded-full border-2 border-green-400 w-full h-full object-cover grayscale"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-green-300"
                >
                    {data.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="text-base sm:text-lg md:text-xl mb-8"
                >
                    {data.title}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center items-center"
                >
                    <a
                        href="/CV_Michiel_Peeraer.pdf"
                        download
                        className="bg-green-400 text-black px-6 py-3 rounded font-semibold transition-all duration-200 hover:bg-green-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(74,222,128,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                        <Download size={16} className="inline mr-2 -mt-0.5" />
                        Download CV
                    </a>
                    <div className="flex space-x-6">
                        {data.contact.socialLinks
                            .filter((link) => link.name !== 'Website')
                            .map((link) => {
                                const Icon =
                                    link.name === 'GitHub'
                                        ? FaGithub
                                        : FaLinkedin
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
            </motion.div>
        </section>
    )
}
