'use client'

import { motion } from 'framer-motion'

interface SkillCardProps {
    skill: string
    index: number
}

export default function SkillCard({ skill, index }: SkillCardProps) {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -2, scale: 1.03 }}
            className="bg-green-900/80 border border-green-400/15 text-green-100 px-3 py-1 rounded text-sm transition-[transform,background-color,border-color,box-shadow] duration-200 hover:bg-green-800/90 hover:border-green-300/45 hover:shadow-[0_0_18px_rgba(74,222,128,0.16)]"
        >
            {skill}
        </motion.span>
    )
}
