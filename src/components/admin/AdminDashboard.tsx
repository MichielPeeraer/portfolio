'use client'

import { useEffect, useState } from 'react'
import { PortfolioEditor } from '@/components/admin/PortfolioEditor'
import type { PortfolioData } from '@/types'

type LoadState =
    | { status: 'loading' }
    | { status: 'loaded'; data: PortfolioData; version: number }
    | { status: 'error'; message: string }

function Spinner() {
    return (
        <svg
            className="h-5 w-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

export function AdminDashboard() {
    const [state, setState] = useState<LoadState>({ status: 'loading' })
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        let active = true

        fetch('/api/admin/portfolio')
            .then((res) =>
                res
                    .json()
                    .catch(() => null)
                    .then(
                        (
                            body: {
                                data?: PortfolioData
                                version?: number
                                error?: string
                            } | null
                        ) => {
                            if (!active) return
                            if (!res.ok || !body?.data) {
                                setState({
                                    status: 'error',
                                    message:
                                        body?.error ??
                                        'Failed to load editor data.',
                                })
                            } else {
                                setState({
                                    status: 'loaded',
                                    data: body.data,
                                    version: body.version ?? 0,
                                })
                            }
                        }
                    )
            )
            .catch(() => {
                if (active) {
                    setState({
                        status: 'error',
                        message: 'Network error. Please try again.',
                    })
                }
            })

        return () => {
            active = false
        }
    }, [retryCount])

    const retry = () => {
        setState({ status: 'loading' })
        setRetryCount((c) => c + 1)
    }

    if (state.status === 'loading') {
        return (
            <section className="rounded-xl border border-green-900/40 bg-black/20 p-6 sm:rounded-2xl sm:p-8 md:p-10">
                <div className="flex items-center gap-3 text-green-500">
                    <Spinner />
                    <p className="text-xs uppercase tracking-[0.2em] sm:text-sm">
                        Connecting to database...
                    </p>
                </div>
                <p className="mt-3 text-[10px] leading-relaxed text-green-700 sm:text-xs">
                    If the database was inactive, this may take a few seconds.
                </p>
            </section>
        )
    }

    if (state.status === 'error') {
        return (
            <section className="rounded-lg border border-red-900/70 bg-red-950/30 p-4 sm:rounded-xl sm:p-5 md:p-6 lg:rounded-2xl lg:p-8">
                <h2 className="text-base font-medium text-red-300 sm:text-lg md:text-xl">
                    Database unavailable
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-red-200/80 sm:mt-3 sm:text-sm md:text-base">
                    {state.message}
                </p>
                <div className="mt-4 sm:mt-5">
                    <button
                        type="button"
                        onClick={retry}
                        className="inline-flex rounded-lg border border-red-800/70 bg-black/30 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-900/20 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                        Retry
                    </button>
                </div>
            </section>
        )
    }

    return (
        <PortfolioEditor
            initialData={state.data}
            initialVersion={state.version}
        />
    )
}
