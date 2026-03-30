'use client'

import { motion } from 'framer-motion'

interface RevealProps {
    children: React.ReactNode
    delay?: number
    y?: number
    x?: number
    className?: string
}

export default function Reveal({
    children,
    delay = 0,
    y = 20,
    x = 0,
    className,
}: RevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y, x, scale: 0.93 }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
