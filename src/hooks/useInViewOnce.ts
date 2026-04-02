import { useEffect, useRef, useState } from 'react'

interface UseInViewOnceOptions {
    rootMargin?: string
}

export const useInViewOnce = <T extends HTMLElement>({
    rootMargin = '200px',
}: UseInViewOnceOptions = {}) => {
    const containerRef = useRef<T | null>(null)
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

        return () => {
            observer.disconnect()
        }
    }, [isVisible, rootMargin])

    return {
        containerRef,
        isVisible,
    }
}
