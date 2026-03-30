'use client'

import { useEffect, useRef, useState } from 'react'

interface InViewMountProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    rootMargin?: string
}

export default function InViewMount({
    children,
    fallback = null,
    rootMargin = '200px',
}: InViewMountProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isVisible) return

        const element = containerRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                root: null,
                rootMargin,
                threshold: 0,
            }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [isVisible, rootMargin])

    return <div ref={containerRef}>{isVisible ? children : fallback}</div>
}
