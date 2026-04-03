import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import data from '@/data/portfolio.json'
import { usePortfolioEditorState } from '@/components/admin/usePortfolioEditorState'
import type { PortfolioData } from '@/types'

const initialData = data as PortfolioData

describe('usePortfolioEditorState', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('fetch', vi.fn())
    })

    it('does not call API when JSON payload is invalid', async () => {
        const { result } = renderHook(() =>
            usePortfolioEditorState(initialData)
        )

        act(() => {
            result.current.setValue('{ invalid json')
        })

        await act(async () => {
            await result.current.saveJson()
        })

        expect(result.current.rawStatus).toBe('Invalid JSON format.')
        expect(globalThis.fetch).not.toHaveBeenCalled()
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

        expect(result.current.sectionsStatus).toContain('Validation failed')
        expect(result.current.sectionIssues.length).toBeGreaterThan(0)
        expect(globalThis.fetch).not.toHaveBeenCalled()
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
        expect(result.current.sectionsStatus).toBe(
            'Section changes saved successfully.'
        )
    })
})
