'use client'

import { motion } from 'framer-motion'
import type { Experience } from '@/types'

interface ExperienceCardProps {
    experience: Experience
    index: number
}

export default function ExperienceCard({
    experience,
    index,
}: ExperienceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="relative border border-green-400/60 p-6 rounded transition-[transform,border-color,box-shadow] duration-300 hover:border-green-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.14)]"
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-green-300">
                        {experience.title}
                    </h3>
                    <p className="text-green-200">{experience.company}</p>
                </div>
                <span className="text-sm text-green-500 whitespace-nowrap">
                    {experience.period}
                </span>
            </div>
            <ul className="space-y-2">
                {experience.points.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                        <span className="text-green-400 mt-1">▸</span>
                        <span className="text-green-100">{point}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}
