'use client'

import { motion } from 'framer-motion'

interface SkillCardProps {
    skill: string
    index: number
}

export default function SkillCard({ skill, index }: SkillCardProps) {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.72, y: 8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
                type: 'spring',
                stiffness: 280,
                damping: 20,
                delay: index * 0.03,
            }}
            whileHover={{ scale: 1.03 }}
            className="bg-green-900/80 border border-green-400/15 text-green-100 px-3 py-1 rounded text-sm transition-[background-color,border-color,box-shadow] duration-200 hover:bg-green-800/90 hover:border-green-300/45 hover:shadow-[0_0_18px_rgba(74,222,128,0.16)]"
        >
            {skill}
        </motion.span>
    )
}
