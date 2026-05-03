import { z } from 'zod'

const socialLinkSchema = z.object({
    name: z.string().trim().min(1),
    icon: z.string().trim().min(1),
    url: z.url(),
})

const personalSchema = z.object({
    name: z.string().trim().min(1),
    title: z.string().trim().min(1),
    about: z.string().trim().min(1),
    status: z.boolean().optional(),
    statusLabel: z.string().trim().min(1).optional(),
    cvPath: z.string().trim().min(1).optional(),
    ogTechPills: z.array(z.string().trim().min(1)).optional(),
    heroTypedLines: z.array(z.string().trim().min(1)).optional(),
    contact: z.object({
        phone: z.string().trim().min(1),
        email: z.email(),
        socialLinks: z.array(socialLinkSchema),
    }),
})

const experienceSchema = z.object({
    period: z.string().trim().min(1),
    title: z.string().trim().min(1),
    company: z.string().trim().min(1),
    location: z.string().trim().min(1),
    points: z.array(z.string().trim().min(1)).min(1),
})

const skillItemSchema = z.union([
    z.string().trim().min(1),
    z.object({
        label: z.string().trim().min(1),
        icon: z.string().trim().min(1),
    }),
])

const skillCategorySchema = z.object({
    label: z.string().trim().min(1),
    wide: z.boolean().optional(),
    skills: z.array(skillItemSchema).min(1),
})

const educationSchema = z.object({
    degree: z.string().trim().min(1),
    institution: z.string().trim().min(1),
    location: z.string().trim().min(1),
    year: z.string().trim().min(1),
    details: z.string(),
})

const learningEmbedSchema = z.object({
    src: z.url(),
    alt: z.string().trim().min(1),
    unoptimized: z.boolean().optional(),
})

const learningSchema = z.object({
    heading: z.string().trim().min(1),
    description: z.string().trim().min(1),
    languages: z.array(z.string().trim().min(1)).min(1),
    bootDevEmbed: learningEmbedSchema,
    duolingoEmbed: learningEmbedSchema,
})

export const portfolioSchema = z.object({
    personal: personalSchema,
    experience: z.array(experienceSchema).min(1),
    skillCategories: z.array(skillCategorySchema).min(1),
    devPracticesLabel: z.string().trim().min(1).optional(),
    devPractices: z.array(z.string().trim().min(1)).min(1),
    education: z.array(educationSchema).min(1),
    learning: learningSchema,
})
