import { getServerSession } from 'next-auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { z } from 'zod'
import { createAuthOptions } from '@/lib/auth-options'
import {
    PORTFOLIO_DATA_TAG,
    getPortfolioDataFromDb,
} from '@/lib/portfolio-data'
import { portfolioSchema } from '@/lib/portfolio-schema'
import { db } from '@/db'
import {
    personalInfo,
    heroTypedLines,
    ogTechPills,
    socialLinks,
    experience,
    experiencePoints,
    skillCategories,
    skills,
    devPractices,
    education,
    learningLanguages,
    learningEmbeds,
} from '@/db/schema'

const MANAGED_IMAGE_PREFIX = 'profile/'

const normalizeBlobPathname = (value: string) => value.replace(/^\/+/, '')

const toBlobPathnameFromUrl = (value: string | undefined) => {
    if (!value) {
        return null
    }

    try {
        const url = new URL(value)
        const pathname = normalizeBlobPathname(url.pathname)
        return pathname.startsWith(MANAGED_IMAGE_PREFIX) ? pathname : null
    } catch {
        return null
    }
}

const toManagedPathname = (value: string) => {
    const normalized = normalizeBlobPathname(value)
    return normalized.startsWith(MANAGED_IMAGE_PREFIX) ? normalized : null
}

const isAdmin = async () => {
    try {
        const session = await getServerSession(createAuthOptions())
        const isAdminUser = session?.user?.role === 'admin'

        if (!isAdminUser) {
            console.warn('[admin-portfolio] Unauthorized access attempt')
        }

        return isAdminUser
    } catch (error) {
        console.error('[admin-portfolio] Session validation failed:', error)
        return false
    }
}

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const [data, versionRows] = await Promise.all([
            getPortfolioDataFromDb(),
            db
                .select({ version: personalInfo.version })
                .from(personalInfo)
                .limit(1),
        ])
        const version = versionRows[0]?.version ?? 0
        return NextResponse.json({ data, version })
    } catch (error) {
        console.error('[admin-portfolio] Failed to load DB data:', error)
        return NextResponse.json(
            { error: 'Database temporarily unavailable.' },
            { status: 503 }
        )
    }
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

    // Extract the optimistic-concurrency token before schema validation.
    // Zod strips unknown keys by default, so _version would be silently lost.
    const { _version, _blobPendingPathnames, ...portfolioPayload } =
        body as Record<string, unknown>
    const versionParsed = z.number().int().min(0).safeParse(_version)
    if (!versionParsed.success) {
        return NextResponse.json(
            { error: 'Missing or invalid version token.' },
            { status: 400 }
        )
    }
    const clientVersion = versionParsed.data

    const blobPendingPathnames = Array.isArray(_blobPendingPathnames)
        ? _blobPendingPathnames
              .filter((value): value is string => typeof value === 'string')
              .map((value) => toManagedPathname(value))
              .filter((value): value is string => Boolean(value))
        : []

    const parsed = portfolioSchema.safeParse(portfolioPayload)
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Validation failed', issues: parsed.error.issues },
            { status: 400 }
        )
    }

    const d = parsed.data

    const nextVersion = clientVersion + 1
    let versionConflict = false
    let previousProfileImagePathname: string | null = null

    await db.transaction(async (tx) => {
        // Atomic CAS: lock the row before reading the version to eliminate the
        // TOCTOU window between the version check and the DELETE/INSERT.
        const lockedRows = await tx
            .select({
                version: personalInfo.version,
                profileImageUrl: personalInfo.profileImageUrl,
            })
            .from(personalInfo)
            .limit(1)
            .for('update')

        previousProfileImagePathname = toBlobPathnameFromUrl(
            lockedRows[0]?.profileImageUrl ?? undefined
        )

        if ((lockedRows[0]?.version ?? 0) !== clientVersion) {
            versionConflict = true
            return
        }

        // Clear all portfolio tables.
        // experience_points and skills are deleted via ON DELETE CASCADE
        // when their parent rows are removed.
        await Promise.all([
            tx.delete(personalInfo),
            tx.delete(experience),
            tx.delete(skillCategories),
            tx.delete(heroTypedLines),
            tx.delete(ogTechPills),
            tx.delete(socialLinks),
            tx.delete(devPractices),
            tx.delete(education),
            tx.delete(learningLanguages),
            tx.delete(learningEmbeds),
        ])

        const primaryEmbed = d.learning.embeds[0]
        const secondaryEmbed = d.learning.embeds[1] ?? primaryEmbed

        // Singleton personal info row
        await tx.insert(personalInfo).values({
            name: d.personal.name,
            title: d.personal.title,
            about: d.personal.about,
            status: d.personal.status ?? false,
            statusLabel: d.personal.statusLabel ?? null,
            cvPath: d.personal.cvPath ?? null,
            profileImageUrl: d.personal.profileImageUrl ?? null,
            devPracticesLabel: d.devPracticesLabel ?? null,
            contactPhone: d.personal.contact.phone,
            contactEmail: d.personal.contact.email,
            learningHeading: d.learning.heading,
            learningDescription: d.learning.description,
            bootDevEmbedSrc: primaryEmbed.src,
            bootDevEmbedAlt: primaryEmbed.alt,
            duolingoEmbedSrc: secondaryEmbed.src,
            duolingoEmbedAlt: secondaryEmbed.alt,
            duolingoEmbedUnoptimized: secondaryEmbed.unoptimized ?? false,
            version: nextVersion,
        })

        // All flat array tables in parallel
        await Promise.all([
            d.personal.heroTypedLines?.length
                ? tx.insert(heroTypedLines).values(
                      d.personal.heroTypedLines.map((text, i) => ({
                          text,
                          sortOrder: i,
                      }))
                  )
                : Promise.resolve(),

            d.personal.ogTechPills?.length
                ? tx.insert(ogTechPills).values(
                      d.personal.ogTechPills.map((label, i) => ({
                          label,
                          sortOrder: i,
                      }))
                  )
                : Promise.resolve(),

            d.personal.contact.socialLinks.length
                ? tx.insert(socialLinks).values(
                      d.personal.contact.socialLinks.map((l, i) => ({
                          name: l.name,
                          icon: l.icon ?? '',
                          url: l.url,
                          sortOrder: i,
                      }))
                  )
                : Promise.resolve(),

            d.devPractices.length
                ? tx.insert(devPractices).values(
                      d.devPractices.map((text, i) => ({
                          text,
                          sortOrder: i,
                      }))
                  )
                : Promise.resolve(),

            d.education.length
                ? tx
                      .insert(education)
                      .values(
                          d.education.map((e, i) => ({ ...e, sortOrder: i }))
                      )
                : Promise.resolve(),

            d.learning.languages.length
                ? tx.insert(learningLanguages).values(
                      d.learning.languages.map((label, i) => ({
                          label,
                          sortOrder: i,
                      }))
                  )
                : Promise.resolve(),

            d.learning.embeds.length
                ? tx.insert(learningEmbeds).values(
                      d.learning.embeds.map((embed, i) => ({
                          src: embed.src,
                          alt: embed.alt,
                          unoptimized: embed.unoptimized ?? false,
                          wide: embed.wide ?? false,
                          sortOrder: i,
                      }))
                  )
                : Promise.resolve(),
        ])

        // Experience rows + their bullet points (need parent ID first)
        for (let i = 0; i < d.experience.length; i++) {
            const exp = d.experience[i]
            const [inserted] = await tx
                .insert(experience)
                .values({
                    period: exp.period,
                    title: exp.title,
                    company: exp.company,
                    location: exp.location,
                    sortOrder: i,
                })
                .returning({ id: experience.id })

            if (exp.points.length) {
                await tx.insert(experiencePoints).values(
                    exp.points.map((text, j) => ({
                        experienceId: inserted.id,
                        text,
                        sortOrder: j,
                    }))
                )
            }
        }

        // Skill categories + their skills (need parent ID first)
        for (let i = 0; i < d.skillCategories.length; i++) {
            const cat = d.skillCategories[i]
            const [inserted] = await tx
                .insert(skillCategories)
                .values({
                    label: cat.label,
                    wide: cat.wide ?? false,
                    sortOrder: i,
                })
                .returning({ id: skillCategories.id })

            if (cat.skills.length) {
                await tx.insert(skills).values(
                    cat.skills.map((sk, j) => ({
                        categoryId: inserted.id,
                        label: typeof sk === 'string' ? sk : sk.label,
                        icon: typeof sk === 'string' ? null : sk.icon,
                        sortOrder: j,
                    }))
                )
            }
        }
    })

    if (versionConflict) {
        return NextResponse.json(
            {
                error: 'The data has been modified by another session. Please reload and try again.',
            },
            { status: 409 }
        )
    }

    const selectedProfilePathname = toBlobPathnameFromUrl(
        d.personal.profileImageUrl
    )
    const pathnamesToDelete = new Set<string>()

    for (const pendingPathname of blobPendingPathnames) {
        if (pendingPathname !== selectedProfilePathname) {
            pathnamesToDelete.add(pendingPathname)
        }
    }

    if (
        previousProfileImagePathname &&
        previousProfileImagePathname !== selectedProfilePathname
    ) {
        pathnamesToDelete.add(previousProfileImagePathname)
    }

    if (pathnamesToDelete.size > 0) {
        try {
            await del(Array.from(pathnamesToDelete))
        } catch (error) {
            console.error('[admin-portfolio] Blob cleanup failed:', error)
        }
    }

    revalidateTag(PORTFOLIO_DATA_TAG, 'max')

    revalidatePath('/', 'layout')
    revalidatePath('/admin')
    revalidatePath('/opengraph-image')

    // Return fresh data and new version so client stays in sync
    return NextResponse.json({ success: true, data: d, version: nextVersion })
}
