import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { createAuthOptions } from '@/lib/auth-options'
import { getPortfolioData } from '@/lib/portfolio-data'
import { portfolioSchema } from '@/lib/portfolio-schema'
import { prisma } from '@/lib/prisma'

const isAdmin = async () => {
    const session = await getServerSession(createAuthOptions())
    return session?.user?.role === 'admin'
}

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getPortfolioData()
    return NextResponse.json({ data })
}

export async function PUT(request: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown

    try {
        body = await request.json()
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON payload' },
            { status: 400 }
        )
    }

    const parsed = portfolioSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Validation failed', issues: parsed.error.issues },
            { status: 400 }
        )
    }

    await prisma.portfolioContent.upsert({
        where: { key: 'primary' },
        update: { data: parsed.data },
        create: { key: 'primary', data: parsed.data },
    })

    revalidatePath('/', 'layout')
    revalidatePath('/admin')
    revalidatePath('/opengraph-image')

    return NextResponse.json({ success: true })
}
