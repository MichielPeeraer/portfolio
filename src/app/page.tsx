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
import { getPortfolioData } from '@/lib/portfolio-data'
import { getSkillLabel } from '@/lib/skill-icons'
import { siteConfig } from '@/lib/site'

export default async function Home() {
    const data = await getPortfolioData()

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
                    ...data.skillCategories.flatMap((category) =>
                        category.skills.map((skill) => getSkillLabel(skill))
                    ),
                    ...data.devPractices,
                ],
            },
        ],
    }

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <MatrixRain />
            <FloatingNavbar socialLinks={data.personal.contact.socialLinks} />

            <HeroSection data={data.personal} />
            <AboutSection about={data.personal.about} />
            <ExperienceSection experiences={data.experience} />
            <SkillsSection
                skillCategories={data.skillCategories}
                devPracticesLabel={data.devPracticesLabel}
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
