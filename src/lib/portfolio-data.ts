import fallbackData from '@/data/portfolio.json'
import { unstable_noStore as noStore } from 'next/cache'
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
const DB_CACHE_TTL_MS = parsePositiveInt(
    process.env.PORTFOLIO_DB_CACHE_TTL_MS,
    process.env.NODE_ENV === 'production' ? 60_000 : 15_000
)

let cachedPortfolio: PortfolioData | null = null
let cachedAt = 0

const getFreshCachedPortfolio = () => {
    if (!cachedPortfolio) return null
    if (Date.now() - cachedAt > DB_CACHE_TTL_MS) return null
    return cachedPortfolio
}

const setCachedPortfolio = (data: PortfolioData) => {
    cachedPortfolio = data
    cachedAt = Date.now()
}

export const clearPortfolioDataCache = () => {
    cachedPortfolio = null
    cachedAt = 0
}

export const primePortfolioDataCache = (data: PortfolioData) => {
    setCachedPortfolio(data)
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

export const getPortfolioData = async (): Promise<PortfolioData> => {
    noStore()

    const cached = getFreshCachedPortfolio()
    if (cached) return cached

    try {
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
                db
                    .select()
                    .from(ogTechPills)
                    .orderBy(asc(ogTechPills.sortOrder)),
                db
                    .select()
                    .from(socialLinks)
                    .orderBy(asc(socialLinks.sortOrder)),
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
                db
                    .select()
                    .from(devPractices)
                    .orderBy(asc(devPractices.sortOrder)),
                db.select().from(education).orderBy(asc(education.sortOrder)),
                db
                    .select()
                    .from(learningLanguages)
                    .orderBy(asc(learningLanguages.sortOrder)),
            ]),
            DB_FETCH_TIMEOUT_MS
        )

        if (!personal[0]) {
            console.warn('[portfolio-data] No data in DB. Using JSON fallback.')
            return fallbackPortfolio
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
            console.warn(
                '[portfolio-data] DB data failed schema validation. Using JSON fallback.'
            )
            setCachedPortfolio(fallbackPortfolio)
            return fallbackPortfolio
        }

        setCachedPortfolio(parsed.data as PortfolioData)
        return parsed.data as PortfolioData
    } catch (err) {
        console.warn('[portfolio-data] DB error, using JSON fallback:', err)
        setCachedPortfolio(fallbackPortfolio)
        return fallbackPortfolio
    }
}
