export interface Skill {
    name: string
    level: number
}

export type SkillIconKey =
    | 'react'
    | 'nextdotjs'
    | 'typescript'
    | 'tailwindcss'
    | 'sass'
    | 'framer'
    | 'nodedotjs'
    | 'express'
    | 'eslint'
    | 'python'
    | 'flask'
    | 'fastapi'
    | 'mantine'
    | 'mongodb'
    | 'postgresql'
    | 'sqlalchemy'
    | 'prisma'
    | 'redux'
    | 'formik'
    | 'git'
    | 'github'
    | 'docker'
    | 'githubactions'
    | 'kubernetes'
    | 'jest'
    | 'vitest'
    | 'jwt'
    | 'postman'
    | 'prettier'
    | 'vercel'
    | 'zod'
    | 'dotnet'

export type SkillItem =
    | string
    | {
          label: string
          icon?: SkillIconKey
      }

export interface SkillCategory {
    label: string
    wide?: boolean
    skills: SkillItem[]
}
