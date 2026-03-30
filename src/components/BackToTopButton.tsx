'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_SCROLL_PX = 480

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_PX)
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleBackToTop = () => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
    }

    return (
        <AnimatePresence>
            {isVisible ? (
                <motion.button
                    type="button"
                    aria-label="Back to top"
                    onClick={handleBackToTop}
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-60 h-11 w-11 md:h-12 md:w-12 rounded-full border border-green-400/60 bg-black/85 text-green-300 backdrop-blur-md shadow-[0_0_16px_rgba(74,222,128,0.2)] hover:border-green-300 hover:text-green-200 hover:shadow-[0_0_24px_rgba(74,222,128,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                    <span className="sr-only">Back to top</span>
                    <ArrowUp className="mx-auto" size={20} />
                </motion.button>
            ) : null}
        </AnimatePresence>
    )
}
