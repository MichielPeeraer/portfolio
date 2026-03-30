interface SkillCardProps {
    skill: string
    index?: number
}

export default function SkillCard({ skill }: SkillCardProps) {
    return (
        <span className="bg-green-900/80 border border-green-400/15 text-green-100 px-3 py-1 rounded text-sm transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-green-800/90 hover:border-green-300/45 hover:shadow-[0_0_18px_rgba(74,222,128,0.16)] hover:scale-[1.03]">
            {skill}
        </span>
    )
}
