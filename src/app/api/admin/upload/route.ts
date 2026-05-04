import { getServerSession } from 'next-auth'
import { del, put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { createAuthOptions } from '@/lib/auth-options'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
const PROFILE_PREFIX = 'profile/'

const toValidProfilePathname = (value: string) => {
    const normalized = value.replace(/^\/+/, '')
    return normalized.startsWith(PROFILE_PREFIX) ? normalized : null
}

const extensionByType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

const getAdminSession = async () => {
    try {
        const session = await getServerSession(createAuthOptions())
        return session?.user?.role === 'admin' ? session : null
    } catch {
        return null
    }
}

export async function POST(request: Request) {
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData().catch(() => null)
    if (!formData) {
        return NextResponse.json(
            { error: 'Invalid multipart body' },
            { status: 400 }
        )
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
            { error: 'Only JPEG, PNG, and WebP images are allowed' },
            { status: 415 }
        )
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
            { error: 'File exceeds the 2 MB limit' },
            { status: 413 }
        )
    }

    try {
        const extension = extensionByType[file.type] ?? 'bin'
        const pathname = `${PROFILE_PREFIX}${Date.now()}-${crypto.randomUUID()}.${extension}`

        const blob = await put(pathname, file, {
            access: 'public',
            contentType: file.type,
        })

        return NextResponse.json({ url: blob.url, pathname: blob.pathname })
    } catch (error) {
        console.error('[admin-upload] Blob upload failed:', error)
        return NextResponse.json(
            { error: 'Upload failed. Please try again.' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await request.json().catch(() => null)) as {
        pathnames?: unknown
    } | null

    const candidatePathnames = Array.isArray(payload?.pathnames)
        ? payload.pathnames
        : []

    const pathnames = candidatePathnames
        .filter((value): value is string => typeof value === 'string')
        .map((value) => toValidProfilePathname(value))
        .filter((value): value is string => Boolean(value))

    if (!pathnames.length) {
        return NextResponse.json({ success: true, deleted: 0 })
    }

    try {
        await del(pathnames)
        return NextResponse.json({ success: true, deleted: pathnames.length })
    } catch (error) {
        console.error('[admin-upload] Blob delete failed:', error)
        return NextResponse.json(
            { error: 'Delete failed. Please try again.' },
            { status: 500 }
        )
    }
}
