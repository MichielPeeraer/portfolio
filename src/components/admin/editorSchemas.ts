import { z } from 'zod'
import type { PortfolioData } from '@/types'

export const adminFormSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    title: z.string().trim().min(1, 'Title is required'),
    about: z.string().trim().min(20, 'About should be at least 20 characters'),
    status: z.boolean(),
    statusLabel: z.string().trim().min(1, 'Status text is required'),
    cvPath: z.string().trim().min(1, 'CV path is required'),
    profileImageUrl: z.string().trim().optional(),
    profileImageCurrentPathname: z.string().trim().optional(),
    profileImagePendingPathnames: z.string().trim().optional(),
    contactEmail: z.email('Valid contact email is required'),
    contactPhone: z.string().trim().min(1, 'Contact phone is required'),
    githubUrl: z.url('GitHub URL must be valid'),
    linkedinUrl: z.url('LinkedIn URL must be valid'),
    heroTypedLinesText: z
        .string()
        .trim()
        .min(1, 'At least one hero line is required'),
    ogTechPillsText: z
        .string()
        .trim()
        .min(1, 'At least one tech pill is required'),
    devPracticesText: z
        .string()
        .trim()
        .min(1, 'At least one dev practice is required'),
})

export type AdminFormValues = z.infer<typeof adminFormSchema>

export const sectionsFormSchema = z.object({
    experience: z
        .array(
            z.object({
                period: z.string().trim().min(1, 'Period is required'),
                title: z.string().trim().min(1, 'Role title is required'),
                company: z.string().trim().min(1, 'Company is required'),
                location: z.string().trim().min(1, 'Location is required'),
                pointsText: z
                    .string()
                    .trim()
                    .min(1, 'At least one bullet point is required'),
            })
        )
        .min(1, 'At least one experience item is required'),
    education: z
        .array(
            z.object({
                degree: z.string().trim().min(1, 'Degree is required'),
                institution: z
                    .string()
                    .trim()
                    .min(1, 'Institution is required'),
                location: z.string().trim().min(1, 'Location is required'),
                year: z.string().trim().min(1, 'Year is required'),
                details: z.string(),
            })
        )
        .min(1, 'At least one education item is required'),
    skillCategories: z
        .array(
            z.object({
                label: z.string().trim().min(1, 'Category label is required'),
                wide: z.boolean(),
                skillsText: z
                    .string()
                    .trim()
                    .min(1, 'At least one skill is required'),
            })
        )
        .min(1, 'At least one skill category is required'),
    learning: z.object({
        heading: z.string().trim().min(1, 'Learning heading is required'),
        description: z
            .string()
            .trim()
            .min(1, 'Learning description is required'),
        languagesText: z
            .string()
            .trim()
            .min(1, 'At least one language is required'),
        bootDevSrc: z.url('Boot.dev embed URL must be valid'),
        bootDevAlt: z.string().trim().min(1, 'Boot.dev alt is required'),
        duolingoSrc: z.url('Duolingo embed URL must be valid'),
        duolingoAlt: z.string().trim().min(1, 'Duolingo alt is required'),
        duolingoUnoptimized: z.boolean(),
    }),
})

export type SectionsFormValues = z.infer<typeof sectionsFormSchema>

export const buildAdminFormDefaults = (
    data: PortfolioData
): AdminFormValues => ({
    name: data.personal.name,
    title: data.personal.title,
    about: data.personal.about,
    status: Boolean(data.personal.status),
    statusLabel: data.personal.statusLabel ?? 'Open to opportunities',
    cvPath: data.personal.cvPath ?? '/cv.pdf',
    profileImageUrl: data.personal.profileImageUrl ?? '',
    profileImageCurrentPathname: '',
    profileImagePendingPathnames: '[]',
    contactEmail: data.personal.contact.email,
    contactPhone: data.personal.contact.phone,
    githubUrl:
        data.personal.contact.socialLinks.find((link) => link.name === 'GitHub')
            ?.url ?? '',
    linkedinUrl:
        data.personal.contact.socialLinks.find(
            (link) => link.name === 'LinkedIn'
        )?.url ?? '',
    heroTypedLinesText: toMultiline(data.personal.heroTypedLines),
    ogTechPillsText: toMultiline(data.personal.ogTechPills),
    devPracticesText: toMultiline(data.devPractices),
})

export const buildSectionsDraft = (
    data: PortfolioData
): SectionsFormValues => ({
    experience: data.experience.map((item) => ({
        period: item.period,
        title: item.title,
        company: item.company,
        location: item.location,
        pointsText: item.points.join('\n'),
    })),
    education: data.education.map((item) => ({
        degree: item.degree,
        institution: item.institution,
        location: item.location,
        year: item.year,
        details: item.details,
    })),
    skillCategories: data.skillCategories.map((category) => ({
        label: category.label,
        wide: Boolean(category.wide),
        skillsText: category.skills.map(skillItemToLine).join('\n'),
    })),
    learning: {
        heading: data.learning.heading,
        description: data.learning.description,
        languagesText: data.learning.languages.join('\n'),
        bootDevSrc: data.learning.bootDevEmbed.src,
        bootDevAlt: data.learning.bootDevEmbed.alt,
        duolingoSrc: data.learning.duolingoEmbed.src,
        duolingoAlt: data.learning.duolingoEmbed.alt,
        duolingoUnoptimized: Boolean(data.learning.duolingoEmbed.unoptimized),
    },
})

export const toMultiline = (values: string[] | undefined) =>
    (values ?? []).join('\n')

export const fromMultiline = (value: string) =>
    value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

export const skillItemToLine = (
    skill: string | { label: string; icon?: string }
) => {
    if (typeof skill === 'string') {
        return skill
    }

    return skill.icon ? `${skill.label}|${skill.icon}` : skill.label
}

export const parseSkillLine = (line: string) => {
    const [labelRaw, iconRaw] = line.split('|').map((item) => item.trim())
    const label = labelRaw ?? ''
    const icon = iconRaw ?? ''

    if (!label) {
        return null
    }

    if (!icon) {
        return label
    }

    return {
        label,
        icon,
    }
}

export const getRawIssues = (result: z.ZodError) =>
    result.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'root'
        return `${path}: ${issue.message}`
    })

export const moveItem = <T>(items: T[], fromIndex: number, toIndex: number) => {
    const next = [...items]
    const [item] = next.splice(fromIndex, 1)
    if (!item) {
        return next
    }

    next.splice(toIndex, 0, item)
    return next
}
