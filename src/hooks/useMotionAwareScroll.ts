import { useCallback } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

export const useMotionAwareScroll = () => {
    const prefersReducedMotion = useReducedMotion()

    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
    }, [prefersReducedMotion])

    const scrollElementIntoView = useCallback(
        (element: HTMLElement) => {
            element.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            })
        },
        [prefersReducedMotion]
    )

    return {
        scrollToTop,
        scrollElementIntoView,
    }
}
