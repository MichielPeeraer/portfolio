import type { Education } from '@/types'
import Reveal from './Reveal'

interface EducationCardProps {
    education: Education
    delay?: number
}

export default function EducationCard({
    education,
    delay = 0,
}: EducationCardProps) {
    return (
        <Reveal x={-20} delay={delay}>
            <div className="relative transition-transform duration-300 hover:translate-x-1">
                <span className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-300">
                            {education.degree}
                        </h3>
                        <p className="text-green-200">
                            {education.institution}{' '}
                            <span className="text-green-300/70">
                                · {education.location}
                            </span>
                        </p>
                    </div>
                    <span className="text-sm text-green-500 whitespace-nowrap">
                        {education.year}
                    </span>
                </div>
                {education.details && (
                    <p className="text-green-100 text-sm">
                        {education.details}
                    </p>
                )}
            </div>
        </Reveal>
    )
}
