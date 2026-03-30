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
    contact: ContactInfo
}

export interface PortfolioData {
    personal: PersonalInfo
    experience: Experience[]
    skillCategories: SkillCategory[]
    devPractices: string[]
    education: Education[]
}

export interface SkillCategory {
    label: string
    skills: string[]
}
