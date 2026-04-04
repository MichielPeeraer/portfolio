'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { MatrixRain } from '@/components/effects'

export default function SignOutPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSignOut = async () => {
        setIsSubmitting(true)
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 font-mono text-green-400">
            <MatrixRain />

            <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-center">
                <div className="w-full rounded-lg border border-green-900/70 bg-green-950/20 p-6">
                    <h1 className="mb-2 text-2xl text-green-300">Sign out</h1>
                    <p className="mb-6 text-sm text-green-600">
                        End your admin session and return to the login page.
                    </p>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={onSignOut}
                            disabled={isSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded bg-green-700 py-2 font-semibold text-black hover:bg-green-500 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        className="h-4 w-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                    Signing out...
                                </>
                            ) : (
                                'Confirm sign out'
                            )}
                        </button>

                        <Link
                            href="/admin"
                            className="inline-flex w-full items-center justify-center rounded border border-green-800/70 bg-black/30 px-4 py-2 text-sm text-green-300 transition hover:bg-green-900/30 hover:text-green-100"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
