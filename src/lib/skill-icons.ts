import type { IconType } from 'react-icons'
import {
    SiDocker,
    SiDotnet,
    SiExpress,
    SiEslint,
    SiFastapi,
    SiFlask,
    SiFormik,
    SiFramer,
    SiGit,
    SiGithub,
    SiGithubactions,
    SiJest,
    SiJsonwebtokens,
    SiKubernetes,
    SiMantine,
    SiMongodb,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiPostman,
    SiPrettier,
    SiPrisma,
    SiPython,
    SiReact,
    SiRedux,
    SiSass,
    SiSqlalchemy,
    SiSupabase,
    SiTailwindcss,
    SiTypescript,
    SiVercel,
    SiVitest,
    SiZod,
} from 'react-icons/si'
import type { SkillIconKey, SkillItem } from '@/types'

const ICONS: Record<SkillIconKey, IconType> = {
    react: SiReact,
    nextdotjs: SiNextdotjs,
    typescript: SiTypescript,
    tailwindcss: SiTailwindcss,
    sass: SiSass,
    framer: SiFramer,
    nodedotjs: SiNodedotjs,
    express: SiExpress,
    eslint: SiEslint,
    python: SiPython,
    flask: SiFlask,
    fastapi: SiFastapi,
    mantine: SiMantine,
    mongodb: SiMongodb,
    postgresql: SiPostgresql,
    sqlalchemy: SiSqlalchemy,
    supabase: SiSupabase,
    prisma: SiPrisma,
    redux: SiRedux,
    formik: SiFormik,
    git: SiGit,
    github: SiGithub,
    docker: SiDocker,
    githubactions: SiGithubactions,
    kubernetes: SiKubernetes,
    jest: SiJest,
    vitest: SiVitest,
    jwt: SiJsonwebtokens,
    postman: SiPostman,
    prettier: SiPrettier,
    vercel: SiVercel,
    zod: SiZod,
    dotnet: SiDotnet,
}

export function getSkillLabel(skill: SkillItem): string {
    return typeof skill === 'string' ? skill : skill.label
}

export function getSkillIcon(skill: SkillItem): IconType | null {
    if (typeof skill === 'string' || !skill.icon) return null
    return ICONS[skill.icon] ?? null
}
