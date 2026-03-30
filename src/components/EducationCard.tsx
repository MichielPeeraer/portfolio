'use client'

import { motion } from 'framer-motion'
import type { Education } from '@/types'

interface EducationCardProps {
    education: Education
    index: number
}

export default function EducationCard({
    education,
    index,
}: EducationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="relative transition-transform duration-300"
        >
            <span className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-300">
                        {education.degree}
                    </h3>
                    <p className="text-green-200">{education.institution}</p>
                </div>
                <span className="text-sm text-green-500 whitespace-nowrap">
                    {education.year}
                </span>
            </div>
            {education.details && (
                <p className="text-green-100 text-sm">{education.details}</p>
            )}
        </motion.div>
    )
}
