export interface Skill {
    name: string
    level: number
}

export type SkillIconKey = string

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
