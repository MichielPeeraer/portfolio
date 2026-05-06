import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import data from '@/data/portfolio.example.json'
import { usePortfolioEditorState } from '@/components/admin/usePortfolioEditorState'
import type { PortfolioData } from '@/types'

const toastSuccessMock = vi.hoisted(() => vi.fn())
const toastErrorMock = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
    toast: {
        success: toastSuccessMock,
        error: toastErrorMock,
    },
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}))

const initialData = data as PortfolioData

describe('usePortfolioEditorState', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('fetch', vi.fn())
    })

    it('shows sections validation errors before network call', async () => {
        const { result } = renderHook(() =>
            usePortfolioEditorState(initialData)
        )

        act(() => {
            result.current.setSectionsDraft((current) => ({
                ...current,
                experience: [],
            }))
        })

        await act(async () => {
            await result.current.saveSections()
        })

        expect(globalThis.fetch).not.toHaveBeenCalled()
        expect(toastErrorMock).toHaveBeenCalledWith(
            'Sections validation failed',
            expect.objectContaining({
                description: expect.stringContaining('experience'),
            })
        )
    })

    it('persists transformed section payload on successful save', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ success: true }),
            })
        )

        const { result } = renderHook(() =>
            usePortfolioEditorState(initialData)
        )

        act(() => {
            result.current.setSectionsDraft((current) => ({
                ...current,
                experience: [
                    {
                        period: '2026',
                        title: 'Engineer',
                        company: 'Acme',
                        location: 'Brussels',
                        pointsText: 'Line one\nLine two',
                    },
                ],
                skillCategories: [
                    {
                        label: 'Frontend',
                        wide: false,
                        skillsText: 'React|react\nTypeScript',
                    },
                ],
            }))
        })

        await act(async () => {
            await result.current.saveSections()
        })

        expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        const [, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
            .calls[0]

        const body = JSON.parse(String(options?.body)) as PortfolioData
        expect(body.experience[0]?.points).toEqual(['Line one', 'Line two'])
        expect(body.skillCategories[0]?.skills).toEqual([
            { label: 'React', icon: 'react' },
            'TypeScript',
        ])
        expect(toastSuccessMock).toHaveBeenCalledWith('Sections saved')
    })

    it('returns proper quick form state after initialization', () => {
        const { result } = renderHook(() =>
            usePortfolioEditorState(initialData)
        )

        expect(result.current.register).toBeDefined()
        expect(result.current.handleSubmit).toBeDefined()
        expect(result.current.watch).toBeDefined()
        expect(result.current.isQuickFormDirty).toBe(false)
        expect(result.current.isSectionsDirty).toBe(false)
    })
})
