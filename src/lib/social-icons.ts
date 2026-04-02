import { FaGithub, FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'

const iconMap: Record<string, IconType> = {
    github: FaGithub,
    linkedin: FaLinkedin,
}

export function getSocialIcon(iconKey: string): IconType | null {
    return iconMap[iconKey] ?? null
}
