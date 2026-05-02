import fallbackData from '@/data/portfolio.json'
import { unstable_cache, unstable_noStore as noStore } from 'next/cache'
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
    process.env.NODE_ENV === 'production' ? 5000 : 4000
)
const DB_FETCH_RETRIES = parsePositiveInt(
    process.env.PORTFOLIO_DB_FETCH_RETRIES,
    process.env.NODE_ENV === 'production' ? 0 : 1
)
export const PORTFOLIO_DATA_TAG = 'portfolio-data'

type DbReadOptions = {
    strict?: boolean
}

let ongoingDirectFetch: Promise<PortfolioData> | null = null

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
    const [
        personal,
        typedLines,
        pills,
        links,
        experiences,
        allPoints,
        categories,
        allSkills,
        practices,
        educations,
        languages,
    ] = await withTimeout(
        Promise.all([
            db.select().from(personalInfo).limit(1),
            db
                .select()
                .from(heroTypedLines)
                .orderBy(asc(heroTypedLines.sortOrder)),
            db.select().from(ogTechPills).orderBy(asc(ogTechPills.sortOrder)),
            db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)),
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
            db.select().from(devPractices).orderBy(asc(devPractices.sortOrder)),
            db.select().from(education).orderBy(asc(education.sortOrder)),
            db
                .select()
                .from(learningLanguages)
                .orderBy(asc(learningLanguages.sortOrder)),
        ]),
        DB_FETCH_TIMEOUT_MS
    )

    if (!personal[0]) {
        throw new Error('[portfolio-data] Missing personalInfo row in DB')
    }

    const p = personal[0]

    const built: PortfolioData = {
        personal: {
            name: p.name,
            title: p.title,
            about: p.about,
            openToWork: p.openToWork,
            openToWorkLabel: p.openToWorkLabel ?? undefined,
            cvPath: p.cvPath ?? undefined,
            ogTechPills: pills.map((x) => x.label),
            heroTypedLines: typedLines.map((x) => x.text),
            contact: {
                phone: p.contactPhone,
                email: p.contactEmail,
                socialLinks: links.map((x) => ({
                    name: x.name,
                    icon: x.icon,
                    url: x.url,
                })),
            },
        },
        experience: experiences.map((exp) => ({
            period: exp.period,
            title: exp.title,
            company: exp.company,
            location: exp.location,
            points: allPoints
                .filter((pt) => pt.experienceId === exp.id)
                .map((pt) => pt.text),
        })),
        skillCategories: categories.map((cat) => ({
            label: cat.label,
            wide: cat.wide || undefined,
            skills: allSkills
                .filter((sk) => sk.categoryId === cat.id)
                .map((sk) =>
                    sk.icon ? { label: sk.label, icon: sk.icon } : sk.label
                ),
        })),
        devPracticesLabel: p.devPracticesLabel ?? undefined,
        devPractices: practices.map((x) => x.text),
        education: educations.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            location: edu.location,
            year: edu.year,
            details: edu.details,
        })),
        learning: {
            heading: p.learningHeading,
            description: p.learningDescription,
            languages: languages.map((x) => x.label),
            bootDevEmbed: {
                src: p.bootDevEmbedSrc,
                alt: p.bootDevEmbedAlt,
            },
            duolingoEmbed: {
                src: p.duolingoEmbedSrc,
                alt: p.duolingoEmbedAlt,
                unoptimized: p.duolingoEmbedUnoptimized || undefined,
            },
        },
    }

    const parsed = portfolioSchema.safeParse(built)
    if (!parsed.success) {
        throw new Error('[portfolio-data] DB data failed schema validation')
    }

    return parsed.data as PortfolioData
}

const getCachedPortfolioData = unstable_cache(
    buildPortfolioFromDb,
    ['portfolio-data'],
    {
        tags: [PORTFOLIO_DATA_TAG],
    }
)

export const getPortfolioData = async (): Promise<PortfolioData> => {
    noStore()

    try {
        return await getCachedPortfolioData()
    } catch (error) {
        console.warn('[portfolio-data] Falling back to JSON data:', error)
        return fallbackPortfolio
    }
}

export const getPortfolioDataFromDb = async (): Promise<PortfolioData> => {
    noStore()

    if (ongoingDirectFetch) {
        return ongoingDirectFetch
    }

    ongoingDirectFetch = (async () => {
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
                console.warn(
                    `[portfolio-data] Direct DB fetch attempt ${attempt + 1} timed out, retrying...`
                )
            }
        }

        throw lastError instanceof Error
            ? lastError
            : new Error('[portfolio-data] Direct DB fetch failed.')
    })()

    try {
        return await ongoingDirectFetch
    } finally {
        ongoingDirectFetch = null
    }
}

export const getPortfolioDataFromDbOrFallback = async (
    options: DbReadOptions = {}
): Promise<PortfolioData> => {
    noStore()

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
