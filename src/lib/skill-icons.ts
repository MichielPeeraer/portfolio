import type { IconType } from 'react-icons'
import * as SimpleIcons from 'react-icons/si'
import type { SkillItem } from '@/types'

const SIMPLE_ICON_INDEX: Record<string, IconType> = Object.entries(SimpleIcons)
    .filter(
        (entry): entry is [string, IconType] =>
            entry[0].startsWith('Si') && typeof entry[1] === 'function'
    )
    .reduce<Record<string, IconType>>((acc, [exportName, icon]) => {
        acc[exportName.slice(2).toLowerCase()] = icon
        return acc
    }, {})

const ICON_ALIASES: Record<string, string> = {
    nextjs: 'nextdotjs',
    nodejs: 'nodedotjs',
    javascript: 'js',
    ts: 'typescript',
    js: 'javascript',
    jwt: 'jsonwebtokens',
}

function toIconSlug(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\.js\b/g, 'dotjs')
        .replace(/\.net\b/g, 'dotnet')
        .replace(/\+\+/g, 'plusplus')
        .replace(/\+/g, 'plus')
        .replace(/#/g, 'sharp')
        .replace(/[^a-z0-9]/g, '')
}

function resolveIcon(iconOrLabel?: string): IconType | null {
    if (!iconOrLabel) return null
    const slug = toIconSlug(iconOrLabel)
    if (!slug) return null

    const alias = ICON_ALIASES[slug]
    if (alias && SIMPLE_ICON_INDEX[alias]) {
        return SIMPLE_ICON_INDEX[alias]
    }

    return SIMPLE_ICON_INDEX[slug] ?? null
}

export function getSkillLabel(skill: SkillItem): string {
    return typeof skill === 'string' ? skill : skill.label
}

export function getSkillIcon(skill: SkillItem): IconType | null {
    if (typeof skill === 'string') {
        return resolveIcon(skill)
    }

    return resolveIcon(skill.icon) ?? resolveIcon(skill.label)
}
