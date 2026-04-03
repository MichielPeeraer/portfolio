import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import { MatrixLoader } from '@/components/effects'

describe('MatrixLoader keyboard dismissal', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        ;(
            window as Window & { __matrixLoaderReady?: boolean }
        ).__matrixLoaderReady = undefined
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('dismisses when Enter is pressed', () => {
        const doneListener = vi.fn()
        window.addEventListener('matrix-loader:done', doneListener)

        render(<MatrixLoader name="Neo" />)

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
        })

        expect(
            (window as Window & { __matrixLoaderReady?: boolean })
                .__matrixLoaderReady
        ).toBe(true)
        expect(doneListener).toHaveBeenCalledTimes(1)

        window.removeEventListener('matrix-loader:done', doneListener)
    })

    it('dismisses when Space is pressed', () => {
        render(<MatrixLoader name="Neo" />)

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
        })

        expect(
            (window as Window & { __matrixLoaderReady?: boolean })
                .__matrixLoaderReady
        ).toBe(true)
    })

    it('does not dismiss on unrelated keys', () => {
        render(<MatrixLoader name="Neo" />)

        act(() => {
            window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape' })
            )
        })

        expect(
            (window as Window & { __matrixLoaderReady?: boolean })
                .__matrixLoaderReady
        ).toBeUndefined()
    })
})
