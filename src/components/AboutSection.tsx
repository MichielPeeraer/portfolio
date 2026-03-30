'use client'

import { motion } from 'framer-motion'

interface AboutSectionProps {
    about: string
}

export default function AboutSection({ about }: AboutSectionProps) {
    return (
        <section id="about" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold mb-8 text-green-300"
                >
                    About
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg leading-relaxed"
                >
                    {about}
                </motion.p>
            </div>
        </section>
    )
}
