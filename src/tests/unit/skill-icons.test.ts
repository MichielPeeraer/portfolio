import { describe, expect, it } from 'vitest'
import { getSkillIcon } from '@/lib/skill-icons'

describe('getSkillIcon', () => {
    it('resolves an icon from the skill label when no icon key is provided', () => {
        expect(getSkillIcon('Next.js')).toBeTypeOf('function')
    })

    it('resolves an icon from an explicit icon key', () => {
        expect(getSkillIcon({ label: 'My DB', icon: 'postgresql' })).toBeTypeOf(
            'function'
        )
    })

    it('returns null when no matching icon exists', () => {
        expect(getSkillIcon({ label: 'MadeUpTech', icon: 'madeuptech' })).toBe(
            null
        )
    })
})
