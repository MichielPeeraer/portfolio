'use client'

import { useInViewOnce } from '@/hooks'

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
    const { containerRef, isVisible } = useInViewOnce<HTMLDivElement>({
        rootMargin,
    })

    return <div ref={containerRef}>{isVisible ? children : fallback}</div>
}
