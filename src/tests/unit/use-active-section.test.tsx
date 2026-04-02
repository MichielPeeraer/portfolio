import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useActiveSection } from '@/hooks'

type MockSection = {
    offsetTop: number
}

describe('useActiveSection', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('tracks active section based on scroll position', () => {
        Object.defineProperty(window, 'innerHeight', {
            value: 1000,
            configurable: true,
        })
        Object.defineProperty(window, 'scrollY', {
            value: 0,
            writable: true,
            configurable: true,
        })

        const sections: Record<string, MockSection> = {
            hero: { offsetTop: 0 },
            about: { offsetTop: 500 },
        }

        vi.spyOn(document, 'getElementById').mockImplementation(
            (id: string) => {
                const section = sections[id]
                return (section ?? null) as unknown as HTMLElement | null
            }
        )

        const { result } = renderHook(() =>
            useActiveSection({
                sectionIds: ['hero', 'about'],
                initialSectionId: 'hero',
                triggerRatio: 0.35,
            })
        )

        expect(result.current).toBe('hero')

        act(() => {
            window.scrollY = 300
            window.dispatchEvent(new Event('scroll'))
        })

        expect(result.current).toBe('about')
    })
})
