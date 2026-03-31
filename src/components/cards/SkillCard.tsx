import { useMemo } from 'react'
import { getSkillIcon, getSkillLabel } from '@/lib/skill-icons'
import type { SkillItem } from '@/types'

interface SkillCardProps {
    skill: SkillItem
    index?: number
}

function IconRenderer({ skill }: { skill: SkillItem }) {
    const Icon = useMemo(() => getSkillIcon(skill), [skill])
    if (!Icon) return null
    // eslint-disable-next-line react-hooks/static-components
    return <Icon size={14} aria-hidden="true" />
}

export default function SkillCard({ skill }: SkillCardProps) {
    const label = getSkillLabel(skill)

    return (
        <span className="inline-flex items-center gap-1.5 bg-green-900/80 border border-green-400/15 text-green-100 px-3 py-1 rounded text-sm transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-green-800/90 hover:border-green-300/45 hover:shadow-[0_0_18px_rgba(74,222,128,0.16)] hover:scale-[1.03]">
            <IconRenderer skill={skill} />
            {label}
        </span>
    )
}
