import type { ContactInfo } from './contact'
import type { SkillCategory } from './skills'

export interface Experience {
    period: string
    title: string
    company: string
    location: string
    points: string[]
}

export interface Education {
    degree: string
    institution: string
    location: string
    year: string
    details: string
}

export interface PersonalInfo {
    name: string
    title: string
    about: string
    status?: boolean
    statusLabel?: string
    cvPath?: string
    profileImageUrl?: string
    ogTechPills?: string[]
    heroTypedLines?: string[]
    contact: ContactInfo
}

export interface LearningEmbed {
    src: string
    alt: string
    unoptimized?: boolean
    wide?: boolean
}

export interface LearningInfo {
    heading: string
    description: string
    languages: string[]
    embeds: LearningEmbed[]
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
