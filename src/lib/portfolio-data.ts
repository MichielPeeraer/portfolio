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

export const getPortfolioData = async (): Promise<PortfolioData> => {
    noStore()

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
        ] = await Promise.all([
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
        ])

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
            return fallbackPortfolio
        }

        return parsed.data as PortfolioData
    } catch (err) {
        console.error('[portfolio-data] DB error, using JSON fallback:', err)
        return fallbackPortfolio
    }
}
