'use client'

import { motion } from 'framer-motion'
import EducationCard from './EducationCard'
import type { Education } from '@/types'

interface EducationSectionProps {
    education: Education[]
}

export default function EducationSection({ education }: EducationSectionProps) {
    return (
        <section id="education" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold mb-8 text-green-300"
                >
                    Education
                </motion.h2>

                <div className="space-y-6 border-l-2 border-green-400 pl-6">
                    {education.map((edu, index) => (
                        <EducationCard
                            key={index}
                            education={edu}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
