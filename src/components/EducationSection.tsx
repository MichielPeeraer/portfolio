import EducationCard from './EducationCard'
import Reveal from './Reveal'
import type { Education } from '@/types'

interface EducationSectionProps {
    education: Education[]
}

export default function EducationSection({ education }: EducationSectionProps) {
    return (
        <section id="education" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Reveal x={-30}>
                    <h2 className="text-4xl font-bold mb-8 text-green-300">
                        Education
                    </h2>
                </Reveal>

                <div className="space-y-6 border-l-2 border-green-400 pl-6">
                    {education.map((edu, index) => (
                        <EducationCard
                            key={`${edu.degree}-${edu.institution}-${edu.year}`}
                            education={edu}
                            delay={Math.min(index * 0.08, 0.4)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
