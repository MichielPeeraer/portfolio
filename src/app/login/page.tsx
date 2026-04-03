'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { MatrixRain } from '@/components/effects'

function GitHubIcon() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 2C6.477 2 2 6.486 2 12.018a10.02 10.02 0 006.838 9.503c.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.344-3.369-1.344-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.893 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.027A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.297 2.747-1.027 2.747-1.027.547 1.378.204 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .269.18.58.688.481A10.019 10.019 0 0022 12.018C22 6.486 17.523 2 12 2z" />
        </svg>
    )
}
export default function LoginPage() {
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSignIn = async () => {
        setError('')
        setIsSubmitting(true)

        const result = await signIn('github', {
            callbackUrl: '/admin',
        })

        if (result?.error) {
            setError('GitHub sign-in failed. Please try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 font-mono text-green-400">
            <MatrixRain />

            <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-center">
                <div className="w-full rounded-lg border border-green-900/70 bg-green-950/20 p-6">
                    <h1 className="text-2xl text-green-300 mb-2">
                        Admin Login
                    </h1>
                    <p className="text-sm text-green-600 mb-6">
                        Continue with your GitHub account to manage portfolio
                        data.
                    </p>

                    <div className="space-y-4">
                        {error ? (
                            <p className="text-sm text-red-400" role="alert">
                                {error}
                            </p>
                        ) : null}

                        <button
                            type="button"
                            onClick={onSignIn}
                            disabled={isSubmitting}
                            className="w-full rounded bg-green-700 text-black font-semibold py-2 hover:bg-green-500 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        className="h-4 w-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <GitHubIcon />
                                    Continue with GitHub
                                </>
                            )}
                        </button>

                        <p className="text-xs text-green-700">
                            Access is limited to your configured admin email.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
