import fallbackData from '@/data/portfolio.json'
import { unstable_cache } from 'next/cache'
import { portfolioSchema } from '@/lib/portfolio-schema'
import { asc } from 'drizzle-orm'
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
import type { PortfolioData } from '@/types'

const fallbackPortfolio = fallbackData as PortfolioData
const parsePositiveInt = (value: string | undefined, fallback: number) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const DB_FETCH_TIMEOUT_MS = parsePositiveInt(
    process.env.PORTFOLIO_DB_FETCH_TIMEOUT_MS,
    process.env.NODE_ENV === 'production' ? 20000 : 15000
)
const DB_FETCH_RETRIES = parsePositiveInt(
    process.env.PORTFOLIO_DB_FETCH_RETRIES,
    process.env.NODE_ENV === 'production' ? 2 : 1
)
export const PORTFOLIO_DATA_TAG = 'portfolio-data'

type DbReadOptions = {
    strict?: boolean
}

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
            reject(
                new Error(
                    `[portfolio-data] DB fetch timed out after ${timeoutMs}ms`
                )
            )
        }, timeoutMs)
    })

    try {
        return await Promise.race([promise, timeoutPromise])
    } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle)
    }
}

const isTimeoutError = (error: unknown) => {
    if (!(error instanceof Error)) return false
    return error.message.includes('timed out')
}

const buildPortfolioFromDb = async (): Promise<PortfolioData> => {
    // Fetch all base data in true parallel (9 queries)
    const [
        personalRows,
        typedLines,
        pills,
        links,
        practicesRows,
        educationsRows,
        languagesRows,
        experiencesRows,
        experiencePointsRows,
        skillCategoriesRows,
        skillsRows,
    ] = await withTimeout(
        Promise.all([
            db.select().from(personalInfo).limit(1),
            db
                .select()
                .from(heroTypedLines)
                .orderBy(asc(heroTypedLines.sortOrder)),
            db.select().from(ogTechPills).orderBy(asc(ogTechPills.sortOrder)),
            db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)),
            db.select().from(devPractices).orderBy(asc(devPractices.sortOrder)),
            db.select().from(education).orderBy(asc(education.sortOrder)),
            db
                .select()
                .from(learningLanguages)
                .orderBy(asc(learningLanguages.sortOrder)),
            db.select().from(experience).orderBy(asc(experience.sortOrder)),
            db
                .select()
                .from(experiencePoints)
                .orderBy(asc(experiencePoints.sortOrder)),
            db
                .select()
                .from(skillCategories)
                .orderBy(asc(skillCategories.sortOrder)),
            db.select().from(skills).orderBy(asc(skills.sortOrder)),
        ]),
        DB_FETCH_TIMEOUT_MS
    )

    // Join relations after all data is fetched
    const experiencesWithPoints = experiencesRows.map((exp) => ({
        ...exp,
        points: experiencePointsRows.filter((pt) => pt.experienceId === exp.id),
    }))

    const categoriesWithSkills = skillCategoriesRows.map((cat) => ({
        ...cat,
        skills: skillsRows.filter((sk) => sk.categoryId === cat.id),
    }))

    if (!personalRows[0]) {
        throw new Error('[portfolio-data] Missing personalInfo row in DB')
    }

    const p = personalRows[0]

    const built: PortfolioData = {
        personal: {
            name: p.name,
            title: p.title,
            about: p.about,
            status: p.status,
            statusLabel: p.statusLabel ?? undefined,
            cvPath: p.cvPath ?? undefined,
            ogTechPills: pills.map((x: (typeof pills)[number]) => x.label),
            heroTypedLines: typedLines.map(
                (x: (typeof typedLines)[number]) => x.text
            ),
            contact: {
                phone: p.contactPhone,
                email: p.contactEmail,
                socialLinks: links.map((x: (typeof links)[number]) => ({
                    name: x.name,
                    icon: x.icon,
                    url: x.url,
                })),
            },
        },
        // Use pre-loaded relations instead of filtering
        experience: experiencesWithPoints.map(
            (exp: (typeof experiencesWithPoints)[number]) => ({
                period: exp.period,
                title: exp.title,
                company: exp.company,
                location: exp.location,
                points: exp.points.map(
                    (pt: (typeof exp.points)[number]) => pt.text
                ),
            })
        ),
        skillCategories: categoriesWithSkills.map(
            (cat: (typeof categoriesWithSkills)[number]) => ({
                label: cat.label,
                wide: cat.wide || undefined,
                skills: cat.skills.map((sk: (typeof cat.skills)[number]) =>
                    sk.icon ? { label: sk.label, icon: sk.icon } : sk.label
                ),
            })
        ),
        devPracticesLabel: p.devPracticesLabel ?? undefined,
        devPractices: practicesRows.map(
            (x: (typeof practicesRows)[number]) => x.text
        ),
        education: educationsRows.map(
            (edu: (typeof educationsRows)[number]) => ({
                degree: edu.degree,
                institution: edu.institution,
                location: edu.location,
                year: edu.year,
                details: edu.details,
            })
        ),
        learning: {
            heading: p.learningHeading,
            description: p.learningDescription,
            languages: languagesRows.map(
                (x: (typeof languagesRows)[number]) => x.label
            ),
            bootDevEmbed: {
                src: p.bootDevEmbedSrc,
                alt: p.bootDevEmbedAlt,
            },
            duolingoEmbed: {
                src: p.duolingoEmbedSrc,
                alt: p.duolingoEmbedAlt,
                unoptimized: p.duolingoEmbedUnoptimized ?? true,
            },
        },
    }

    const parsed = portfolioSchema.safeParse(built)
    if (!parsed.success) {
        throw new Error('[portfolio-data] DB data failed schema validation')
    }

    return parsed.data as PortfolioData
}

export const getCachedPortfolioData = unstable_cache(
    buildPortfolioFromDb,
    ['portfolio-data'],
    {
        tags: [PORTFOLIO_DATA_TAG],
    }
)

export const getPortfolioData = async (): Promise<PortfolioData> => {
    try {
        return await getCachedPortfolioData()
    } catch (error) {
        console.warn('[portfolio-data] Falling back to JSON data:', error)
        return fallbackPortfolio
    }
}

export const getPortfolioDataFromDb = async (): Promise<PortfolioData> => {
    let lastError: unknown

    for (let attempt = 0; attempt <= DB_FETCH_RETRIES; attempt++) {
        try {
            return await buildPortfolioFromDb()
        } catch (error) {
            lastError = error
            const shouldRetry =
                isTimeoutError(error) && attempt < DB_FETCH_RETRIES
            if (!shouldRetry) {
                break
            }
            // Exponential backoff: 2s, 4s, 8s... to give paused DB time to wake
            const delayMs = Math.pow(2, attempt + 1) * 1000
            console.warn(
                `[portfolio-data] Direct DB fetch attempt ${attempt + 1} timed out. Retrying in ${delayMs}ms...`
            )
            await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error('[portfolio-data] Direct DB fetch failed.')
}

export const getPortfolioDataFromDbOrFallback = async (
    options: DbReadOptions = {}
): Promise<PortfolioData> => {
    const { strict = false } = options

    try {
        return await getPortfolioDataFromDb()
    } catch (error) {
        if (strict) {
            throw error
        }

        console.warn(
            '[portfolio-data] Direct DB fetch failed, using fallback:',
            error
        )
        return fallbackPortfolio
    }
}
