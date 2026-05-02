import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { createAuthOptions } from '@/lib/auth-options'
import { MatrixRain } from '@/components/effects'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const session = await getServerSession(createAuthOptions())

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/login')
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-3 py-4 font-mono text-green-400 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
            <MatrixRain />

            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                <header className="rounded-xl border border-green-900/60 bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.12),transparent_55%),rgba(3,14,9,0.95)] p-4 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                        {/* Left: title block */}
                        <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-800/70 bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.3em] text-green-500 sm:text-[10px] sm:px-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                Live portfolio control
                            </span>
                            <div className="space-y-1 sm:space-y-2">
                                <h1 className="wrap-break-word text-2xl font-light text-green-100 sm:text-3xl md:text-4xl lg:text-5xl">
                                    Admin Dashboard
                                </h1>
                                <p className="max-w-2xl text-xs leading-relaxed text-green-600 sm:text-sm md:text-base">
                                    Update content, reorder sections, and
                                    publish changes without touching source
                                    files.
                                </p>
                            </div>
                        </div>

                        {/* Right: meta + actions */}
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto lg:flex-col lg:items-end lg:shrink-0">
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:gap-3 sm:text-xs md:gap-4 md:text-sm">
                                {[
                                    { label: 'Source', value: 'Database' },
                                    { label: 'Access', value: 'Admin only' },
                                    { label: 'Cache', value: 'On demand' },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="rounded-lg border border-green-900/60 bg-black/40 px-2 py-2 sm:rounded-xl sm:px-3 sm:py-2.5"
                                    >
                                        <p className="uppercase tracking-[0.2em] text-green-700 text-[9px] sm:text-[10px]">
                                            {label}
                                        </p>
                                        <p className="mt-0.5 font-medium text-green-300 text-xs sm:text-sm sm:mt-1">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/signout"
                                className="w-full rounded-lg border border-green-800/70 bg-black/30 px-3 py-2 text-center text-xs font-medium text-green-300 transition hover:bg-green-900/30 hover:text-green-100 sm:w-auto sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                            >
                                Sign out
                            </Link>
                        </div>
                    </div>
                </header>

                <AdminDashboard />
            </div>
        </main>
    )
}
