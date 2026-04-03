import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkillCard } from '@/components/cards'

describe('SkillCard', () => {
    it('renders the skill label', () => {
        const { container } = render(<SkillCard skill="TypeScript" />)
        expect(container).toHaveTextContent('TypeScript')
    })

    it('renders as a span element', () => {
        const { container } = render(<SkillCard skill="React.js" />)
        expect(container.querySelector('span')).toBeInTheDocument()
    })
})
