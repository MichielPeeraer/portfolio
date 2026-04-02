import { useEffect, useState } from 'react'

const MEDIA_QUERY = '(prefers-reduced-motion: reduce)'

type LegacyMediaQueryList = MediaQueryList & {
    addListener?: (listener: (event: MediaQueryListEvent) => void) => void
    removeListener?: (listener: (event: MediaQueryListEvent) => void) => void
}

const getInitialPreference = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MEDIA_QUERY).matches
}

export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] =
        useState(getInitialPreference)

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            MEDIA_QUERY
        ) as LegacyMediaQueryList

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches)
        }

        if (typeof mediaQueryList.addEventListener === 'function') {
            mediaQueryList.addEventListener('change', handleChange)
        } else if (typeof mediaQueryList.addListener === 'function') {
            mediaQueryList.addListener(handleChange)
        }

        return () => {
            if (typeof mediaQueryList.removeEventListener === 'function') {
                mediaQueryList.removeEventListener('change', handleChange)
            } else if (typeof mediaQueryList.removeListener === 'function') {
                mediaQueryList.removeListener(handleChange)
            }
        }
    }, [])

    return prefersReducedMotion
}
