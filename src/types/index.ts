export interface Experience {
    period: string
    title: string
    company: string
    location: string
    points: string[]
}

export interface Skill {
    name: string
    level: number
}

export interface Education {
    degree: string
    institution: string
    location: string
    year: string
    details: string
}

export interface SocialLink {
    name: string
    url: string
    icon?: string
}

export interface ContactInfo {
    phone: string
    email: string
    socialLinks: SocialLink[]
}

export interface PersonalInfo {
    name: string
    title: string
    about: string
    openToWork?: boolean
    openToWorkLabel?: string
    cvPath?: string
    ogTechPills?: string[]
    heroTypedLines?: string[]
    contact: ContactInfo
}

export interface LearningEmbed {
    src: string
    alt: string
    unoptimized?: boolean
}

export interface LearningInfo {
    heading: string
    description: string
    languages: string[]
    bootDevEmbed: LearningEmbed
    duolingoEmbed: LearningEmbed
}

export interface PortfolioData {
    personal: PersonalInfo
    experience: Experience[]
    skillCategories: SkillCategory[]
    devPracticesLabel?: string
    devPractices: string[]
    education: Education[]
    learning: LearningInfo
}

export type SkillIconKey =
    | 'react'
    | 'nextdotjs'
    | 'typescript'
    | 'tailwindcss'
    | 'sass'
    | 'framer'
    | 'nodedotjs'
    | 'express'
    | 'eslint'
    | 'python'
    | 'flask'
    | 'fastapi'
    | 'mantine'
    | 'mongodb'
    | 'postgresql'
    | 'sqlalchemy'
    | 'prisma'
    | 'redux'
    | 'formik'
    | 'git'
    | 'github'
    | 'docker'
    | 'githubactions'
    | 'kubernetes'
    | 'jest'
    | 'vitest'
    | 'jwt'
    | 'postman'
    | 'prettier'
    | 'vercel'
    | 'zod'
    | 'dotnet'

export type SkillItem =
    | string
    | {
        label: string
        icon?: SkillIconKey
    }

export interface SkillCategory {
    label: string
    wide?: boolean
    skills: SkillItem[]
}

export type ContactEmailData = {
    firstName: string
    lastName: string
    email: string
    phone?: string
    company?: string
    linkedIn?: string
    message: string
}
