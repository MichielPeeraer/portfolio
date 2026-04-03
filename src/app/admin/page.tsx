import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { getPortfolioData } from '@/lib/portfolio-data'
import { createAuthOptions } from '@/lib/auth-options'
import { MatrixRain } from '@/components/effects'
import { PortfolioEditor } from '@/components/admin/PortfolioEditor'

export default async function AdminPage() {
    const session = await getServerSession(createAuthOptions())

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/login')
    }

    const data = await getPortfolioData()

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 py-6 font-mono text-green-400 md:px-8 md:py-10">
            <MatrixRain />

            <div className="relative z-10 mx-auto max-w-7xl space-y-6">
                <header className="rounded-2xl border border-green-900/70 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_35%),rgba(5,18,12,0.92)] p-5 md:p-7">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl space-y-3">
                            <div className="inline-flex items-center rounded-full border border-green-800/80 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.28em] text-green-500">
                                Live portfolio control
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl text-green-200 md:text-4xl">
                                    Admin Dashboard
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-green-500 md:text-base">
                                    Update portfolio content, reorder sections,
                                    and publish copy changes without touching
                                    source files.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row md:items-stretch xl:flex-col xl:items-end">
                            <div className="grid grid-cols-2 gap-3 text-xs text-green-500">
                                <div className="rounded-xl border border-green-900/70 bg-black/35 px-4 py-3">
                                    <p className="uppercase tracking-[0.2em] text-green-700">
                                        Source
                                    </p>
                                    <p className="mt-1 text-sm text-green-300">
                                        Database
                                    </p>
                                </div>
                                <div className="rounded-xl border border-green-900/70 bg-black/35 px-4 py-3">
                                    <p className="uppercase tracking-[0.2em] text-green-700">
                                        Access
                                    </p>
                                    <p className="mt-1 text-sm text-green-300">
                                        Admin only
                                    </p>
                                </div>
                            </div>

                            <form action="/api/auth/signout" method="post">
                                <input
                                    type="hidden"
                                    name="callbackUrl"
                                    value="/login"
                                />
                                <button
                                    type="submit"
                                    className="w-full rounded-xl border border-green-700 px-4 py-3 text-sm text-green-200 transition hover:bg-green-900/30 md:w-auto"
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                <PortfolioEditor initialData={data} />
            </div>
        </main>
    )
}
