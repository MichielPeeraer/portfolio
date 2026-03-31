import { ExperienceCard } from '@/components/cards'
import { Reveal } from '@/components/ui'
import type { Experience } from '@/types'

interface ExperienceSectionProps {
    experiences: Experience[]
}

export default function ExperienceSection({
    experiences,
}: ExperienceSectionProps) {
    return (
        <section id="experience" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Reveal x={-30}>
                    <h2 className="text-4xl font-bold mb-8 text-green-300">
                        Experience
                    </h2>
                </Reveal>

                <div className="space-y-8">
                    {experiences.map((exp, index) => (
                        <ExperienceCard
                            key={`${exp.title}-${exp.company}-${exp.period}`}
                            experience={exp}
                            delay={Math.min(index * 0.08, 0.4)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
