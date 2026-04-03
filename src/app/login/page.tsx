'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (!result || result.error) {
            setError('Invalid credentials.')
            setIsSubmitting(false)
            return
        }

        window.location.href = '/admin'
    }

    return (
        <main className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-4">
            <section className="w-full max-w-md border border-green-900/70 bg-green-950/20 rounded-lg p-6">
                <h1 className="text-2xl text-green-300 mb-2">Admin Login</h1>
                <p className="text-sm text-green-600 mb-6">
                    Sign in to manage your portfolio data.
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm mb-1"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                    </div>

                    {error ? (
                        <p className="text-sm text-red-400" role="alert">
                            {error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded bg-green-700 text-black font-semibold py-2 hover:bg-green-500 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </section>
        </main>
    )
}
