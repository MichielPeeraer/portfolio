import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillCard from '@/components/SkillCard'

describe('SkillCard', () => {
    it('renders the skill label', () => {
        render(<SkillCard skill="TypeScript" />)
        expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('renders as a span element', () => {
        const { container } = render(<SkillCard skill="React.js" />)
        expect(container.querySelector('span')).toBeInTheDocument()
    })
})
