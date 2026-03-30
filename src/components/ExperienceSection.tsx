'use client'

import { motion } from 'framer-motion'
import ExperienceCard from './ExperienceCard'
import type { Experience } from '@/types'

interface ExperienceSectionProps {
    experiences: Experience[]
}

export default function ExperienceSection({
    experiences,
}: ExperienceSectionProps) {
    return (
        <section id="experience" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold mb-8 text-green-300"
                >
                    Experience
                </motion.h2>

                <div className="space-y-8">
                    {experiences.map((exp, index) => (
                        <ExperienceCard
                            key={index}
                            experience={exp}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
