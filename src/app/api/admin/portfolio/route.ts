import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { createAuthOptions } from '@/lib/auth-options'
import {
    clearPortfolioDataCache,
    getPortfolioData,
    primePortfolioDataCache,
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
} from '@/db/schema'

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

    const d = parsed.data

    await db.transaction(async (tx) => {
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
        ])

        // Singleton personal info row
        await tx.insert(personalInfo).values({
            name: d.personal.name,
            title: d.personal.title,
            about: d.personal.about,
            openToWork: d.personal.openToWork ?? false,
            openToWorkLabel: d.personal.openToWorkLabel ?? null,
            cvPath: d.personal.cvPath ?? null,
            devPracticesLabel: d.devPracticesLabel ?? null,
            contactPhone: d.personal.contact.phone,
            contactEmail: d.personal.contact.email,
            learningHeading: d.learning.heading,
            learningDescription: d.learning.description,
            bootDevEmbedSrc: d.learning.bootDevEmbed.src,
            bootDevEmbedAlt: d.learning.bootDevEmbed.alt,
            duolingoEmbedSrc: d.learning.duolingoEmbed.src,
            duolingoEmbedAlt: d.learning.duolingoEmbed.alt,
            duolingoEmbedUnoptimized:
                d.learning.duolingoEmbed.unoptimized ?? false,
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

    // Make newly saved data visible immediately in this runtime.
    clearPortfolioDataCache()
    primePortfolioDataCache(d)

    revalidatePath('/', 'layout')
    revalidatePath('/admin')
    revalidatePath('/opengraph-image')

    return NextResponse.json({ success: true })
}
