import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { getRevalidateEnv } from '@/lib/env'
import { PORTFOLIO_DATA_TAG } from '@/lib/portfolio-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store',
}

const isAuthorized = (request: Request) => {
    try {
        const { revalidateSecret } = getRevalidateEnv()
        const authHeader = request.headers.get('authorization')?.trim()
        if (authHeader === `Bearer ${revalidateSecret}`) {
            return true
        }

        const secretHeader = request.headers.get('x-revalidate-secret')?.trim()
        return secretHeader === revalidateSecret
    } catch {
        return false
    }
}

export async function POST(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401, headers: NO_STORE_HEADERS }
        )
    }

    revalidateTag(PORTFOLIO_DATA_TAG, 'max')
    revalidatePath('/', 'layout')
    revalidatePath('/opengraph-image')

    return NextResponse.json(
        {
            revalidated: true,
            tag: PORTFOLIO_DATA_TAG,
            paths: ['/', '/opengraph-image'],
        },
        { headers: NO_STORE_HEADERS }
    )
}
