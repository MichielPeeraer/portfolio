import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { useContactSubmission } from '@/hooks/useContactSubmission'
import type { ContactFormValues } from '@/types'

const trackMock = vi.hoisted(() => vi.fn())
const toastSuccessMock = vi.hoisted(() => vi.fn())
const toastErrorMock = vi.hoisted(() => vi.fn())

vi.mock('@vercel/analytics', () => ({
    track: trackMock,
}))

vi.mock('sonner', () => ({
    toast: {
        success: toastSuccessMock,
        error: toastErrorMock,
    },
}))

const validPayload: ContactFormValues = {
    firstname: 'Neo',
    lastname: 'Anderson',
    email: 'neo@zion.io',
    phone: '',
    company: '',
    linkedin: '',
    message: 'Follow the white rabbit.',
    website: '',
}

describe('useContactSubmission', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('fetch', vi.fn())
    })

    it('tracks form start only once', () => {
        const resetMock = vi.fn()
        const { result } = renderHook(() =>
            useContactSubmission({ reset: resetMock })
        )

        act(() => {
            result.current.markFormStarted(false)
            result.current.markFormStarted(true)
            result.current.markFormStarted(true)
        })

        expect(trackMock).toHaveBeenCalledWith('contact_form_started')
        expect(trackMock).toHaveBeenCalledTimes(1)
    })

    it('short-circuits on honeypot field', async () => {
        const resetMock = vi.fn()
        const { result } = renderHook(() =>
            useContactSubmission({ reset: resetMock })
        )

        await act(async () => {
            await result.current.submit({
                ...validPayload,
                website: 'https://spam.invalid',
            })
        })

        expect(trackMock).toHaveBeenCalledWith(
            'contact_form_honeypot_triggered'
        )
        expect(toastSuccessMock).toHaveBeenCalledTimes(1)
        expect(resetMock).toHaveBeenCalledTimes(1)
        expect(globalThis.fetch).not.toHaveBeenCalled()
    })

    it('shows too-fast error before network call', async () => {
        const resetMock = vi.fn()
        const { result } = renderHook(() =>
            useContactSubmission({ reset: resetMock })
        )

        await act(async () => {
            await result.current.submit(validPayload)
        })

        expect(toastErrorMock).toHaveBeenCalledWith('Transmission failed', {
            description: 'Please wait a moment before submitting the form.',
        })
        expect(globalThis.fetch).not.toHaveBeenCalled()
    })
})
