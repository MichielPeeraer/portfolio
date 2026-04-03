import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { getPortfolioData } from '@/lib/portfolio-data'
import { authOptions } from '@/lib/auth-options'
import { PortfolioEditor } from '@/components/admin/PortfolioEditor'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/login')
    }

    const data = await getPortfolioData()

    return (
        <main className="min-h-screen bg-black text-green-400 font-mono p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-4">
                <header className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl text-green-300">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-green-600">
                            Update portfolio content without editing source
                            files.
                        </p>
                    </div>

                    <form action="/api/auth/signout" method="post">
                        <input
                            type="hidden"
                            name="callbackUrl"
                            value="/login"
                        />
                        <button
                            type="submit"
                            className="rounded border border-green-700 text-green-300 px-3 py-2 hover:bg-green-900/30"
                        >
                            Sign out
                        </button>
                    </form>
                </header>

                <PortfolioEditor initialData={data} />
            </div>
        </main>
    )
}
