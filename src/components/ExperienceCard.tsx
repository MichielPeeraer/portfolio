import type { Experience } from '@/types'
import Reveal from './Reveal'

interface ExperienceCardProps {
    experience: Experience
    delay?: number
}

export default function ExperienceCard({
    experience,
    delay = 0,
}: ExperienceCardProps) {
    return (
        <Reveal y={16} delay={delay}>
            <div className="relative border border-green-400/60 p-6 rounded transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.14)]">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-green-300">
                            {experience.title}
                        </h3>
                        <p className="text-green-200">
                            {experience.company}{' '}
                            <span className="text-green-300/70">
                                · {experience.location}
                            </span>
                        </p>
                    </div>
                    <span className="text-sm text-green-500 whitespace-nowrap">
                        {experience.period}
                    </span>
                </div>
                <ul className="space-y-2">
                    {experience.points.map((point) => (
                        <li key={point} className="flex items-start space-x-3">
                            <span className="text-green-400 mt-1">▸</span>
                            <span className="text-green-100">{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Reveal>
    )
}
