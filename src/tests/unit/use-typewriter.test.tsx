import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useTypewriter } from '@/hooks/useTypewriter'

describe('useTypewriter', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('types text progressively when enabled', () => {
        vi.useFakeTimers()

        const { result } = renderHook(() =>
            useTypewriter({
                lines: ['Neo'],
                enabled: true,
                typingSpeedMs: 10,
                deletingSpeedMs: 10,
                holdAtFullMs: 1000,
                holdAtEmptyMs: 10,
            })
        )

        expect(result.current).toBe('')

        act(() => {
            vi.advanceTimersByTime(10)
        })
        expect(result.current).toBe('N')

        act(() => {
            vi.advanceTimersByTime(10)
        })
        expect(result.current).toBe('Ne')
    })

    it('does not type when disabled', () => {
        vi.useFakeTimers()

        const { result } = renderHook(() =>
            useTypewriter({
                lines: ['Trinity'],
                enabled: false,
                typingSpeedMs: 10,
            })
        )

        act(() => {
            vi.advanceTimersByTime(100)
        })

        expect(result.current).toBe('')
    })
})
