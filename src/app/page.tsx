import { MatrixRain } from '@/components/effects'
import { BackToTopButton, FloatingNavbar, Footer } from '@/components/layout'
import {
    AboutSection,
    ContactSection,
    EducationSection,
    ExperienceSection,
    HeroSection,
    LearningSection,
    SkillsSection,
} from '@/components/sections'
import portfolioData from '@/data/portfolio.json'
import { siteConfig } from '@/lib/site'
import type { PortfolioData } from '@/types'

const data: PortfolioData = portfolioData as PortfolioData

const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
        },
        {
            '@type': 'Person',
            name: data.personal.name,
            url: siteConfig.url,
            jobTitle: data.personal.title,
            description: data.personal.about,
            email: data.personal.contact.email,
            telephone: data.personal.contact.phone,
            sameAs: data.personal.contact.socialLinks
                .filter((link) => link.name !== 'Website')
                .map((link) => link.url),
            knowsAbout: [
                ...data.skillCategories.flatMap((category) => category.skills),
                ...data.devPractices,
            ],
        },
    ],
}

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <MatrixRain />
            <FloatingNavbar />

            <HeroSection data={data.personal} />
            <AboutSection about={data.personal.about} />
            <ExperienceSection experiences={data.experience} />
            <SkillsSection
                skillCategories={data.skillCategories}
                devPractices={data.devPractices}
            />
            <EducationSection education={data.education} />
            <LearningSection data={data.learning} />
            <ContactSection contact={data.personal.contact} />
            <Footer />
            <BackToTopButton />
        </div>
    )
}
