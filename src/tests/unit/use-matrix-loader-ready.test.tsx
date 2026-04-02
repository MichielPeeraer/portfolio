import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useMatrixLoaderReady } from '@/hooks'

type MatrixLoaderWindow = Window & {
    __matrixLoaderReady?: boolean
}

describe('useMatrixLoaderReady', () => {
    it('starts ready when loader flag is already set', () => {
        ;(window as MatrixLoaderWindow).__matrixLoaderReady = true

        const { result } = renderHook(() => useMatrixLoaderReady())

        expect(result.current).toBe(true)

        delete (window as MatrixLoaderWindow).__matrixLoaderReady
    })

    it('becomes ready when matrix-loader:done is dispatched', () => {
        delete (window as MatrixLoaderWindow).__matrixLoaderReady

        const { result } = renderHook(() => useMatrixLoaderReady())
        expect(result.current).toBe(false)

        act(() => {
            window.dispatchEvent(new Event('matrix-loader:done'))
        })

        expect(result.current).toBe(true)
    })
})
