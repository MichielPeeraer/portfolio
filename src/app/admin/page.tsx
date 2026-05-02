import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { getPortfolioDataFromDb } from '@/lib/portfolio-data'
import { createAuthOptions } from '@/lib/auth-options'
import { MatrixRain } from '@/components/effects'
import { PortfolioEditor } from '@/components/admin/PortfolioEditor'
import { db } from '@/db'
import { personalInfo } from '@/db/schema'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const session = await getServerSession(createAuthOptions())

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/login')
    }

    let data: Awaited<ReturnType<typeof getPortfolioDataFromDb>> | null = null
    let dbVersion = 0

    try {
        console.log('[admin-page] Starting DB fetch...')
        const t0 = Date.now()

        console.log('[admin-page] Fetching portfolio data from DB...')
        const fetchedData = await getPortfolioDataFromDb()
        console.log(
            '[admin-page] Portfolio data fetched in',
            Date.now() - t0,
            'ms'
        )

        console.log('[admin-page] Fetching version...')
        const versionRows = await db
            .select({ version: personalInfo.version })
            .from(personalInfo)
            .limit(1)
        console.log(
            '[admin-page] Version fetched:',
            versionRows[0]?.version,
            'total time:',
            Date.now() - t0,
            'ms'
        )

        data = fetchedData
        dbVersion = versionRows[0]?.version ?? 0
    } catch (error) {
        console.error(
            '[admin-page] Failed to load portfolio data from DB:',
            error
        )
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 py-6 font-mono text-green-400 md:px-8 md:py-10">
            <MatrixRain />

            <div className="relative z-10 mx-auto max-w-7xl space-y-5">
                <header className="rounded-2xl border border-green-900/60 bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.12),transparent_55%),rgba(3,14,9,0.95)] p-5 md:p-7">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        {/* Left: title block */}
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-800/70 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-green-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                Live portfolio control
                            </span>
                            <div>
                                <h1 className="text-3xl font-light text-green-100 md:text-4xl">
                                    Admin Dashboard
                                </h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-green-600 md:text-base">
                                    Update content, reorder sections, and
                                    publish changes without touching source
                                    files.
                                </p>
                            </div>
                        </div>

                        {/* Right: meta + actions */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end xl:flex-col xl:items-end xl:shrink-0">
                            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-3">
                                {[
                                    { label: 'Source', value: 'Database' },
                                    { label: 'Access', value: 'Admin only' },
                                    { label: 'Cache', value: 'On demand' },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border border-green-900/60 bg-black/40 px-3 py-2.5"
                                    >
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-green-700">
                                            {label}
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-green-300">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/signout"
                                className="w-full rounded-xl border border-green-800/70 bg-black/30 px-4 py-2.5 text-center text-sm text-green-300 transition hover:bg-green-900/30 hover:text-green-100 sm:w-auto"
                            >
                                Sign out
                            </Link>
                        </div>
                    </div>
                </header>

                {data ? (
                    <PortfolioEditor
                        initialData={data}
                        initialVersion={dbVersion}
                    />
                ) : (
                    <section className="rounded-2xl border border-red-900/70 bg-red-950/30 p-5 md:p-6">
                        <h2 className="text-lg font-medium text-red-300">
                            Database unavailable
                        </h2>
                        <p className="mt-2 text-sm text-red-200/80">
                            The admin editor needs a live database connection.
                            Please try again in a moment.
                        </p>
                        <div className="mt-4">
                            <Link
                                href="/admin"
                                className="inline-flex rounded-lg border border-red-800/70 bg-black/30 px-3 py-2 text-sm text-red-200 transition hover:bg-red-900/20"
                            >
                                Retry
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}
