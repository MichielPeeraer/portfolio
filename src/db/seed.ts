/**
 * Seed script — run with: npm run db:seed
 *
 * Reads src/data/portfolio.json and inserts all rows into the normalized
 * Drizzle schema, then ensures the admin user record exists.
 *
 * Uses the DIRECT_URL (non-pooled) connection so that the script works even
 * when DATABASE_URL points at a pgBouncer transaction-mode pooler.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
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
    users,
} from './schema'
import type { PortfolioData } from '@/types'

const cleanConnectionString = (value: string | undefined) =>
    value?.trim().replace(/^['\"]|['\"]$/g, '') ?? ''

const connectionString = cleanConnectionString(
    process.env.DIRECT_URL ?? process.env.DATABASE_URL
)

if (!connectionString) {
    console.error('[seed] No DATABASE_URL / DIRECT_URL found. Aborting.')
    process.exit(1)
}

const client = postgres(connectionString, { max: 1, prepare: false })
const db = drizzle(client)

async function main() {
    const portfolioPath = join(process.cwd(), 'src', 'data', 'portfolio.json')
    const d = JSON.parse(readFileSync(portfolioPath, 'utf8')) as PortfolioData

    console.log('[seed] Seeding portfolio data…')

    await db.transaction(async (tx) => {
        // Clear all portfolio tables (cascade handles child rows)
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
                ? tx
                    .insert(devPractices)
                    .values(
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

        // Experience rows + bullet points (need parent ID first)
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

        // Skill categories + skills (need parent ID first)
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

    console.log('[seed] Portfolio data seeded.')

    // Ensure admin user record exists
    const adminEmail = process.env.ADMIN_EMAIL?.trim().replace(/^['"]|['"]$/g, '')

    if (adminEmail) {
        await db
            .insert(users)
            .values({
                email: adminEmail,
                role: 'admin',
                name: 'Portfolio Admin',
            })
            .onConflictDoUpdate({
                target: users.email,
                set: { role: 'admin' },
            })
        console.log(`[seed] Admin user ensured: ${adminEmail}`)
    } else {
        console.warn('[seed] ADMIN_EMAIL is not set. Skipping admin bootstrap.')
    }

    console.log('[seed] Done.')
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
