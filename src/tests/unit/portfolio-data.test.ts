import { describe, it, expect } from 'vitest'
import data from '@/data/portfolio.example.json'
import { portfolioSchema } from '@/lib/portfolio-schema'
import type { PortfolioData } from '@/types'

const portfolio = data as PortfolioData

describe('portfolio.example.json', () => {
    it('has required personal fields', () => {
        expect(portfolio.personal.name).toBeTruthy()
        expect(portfolio.personal.title).toBeTruthy()
        expect(portfolio.personal.about).toBeTruthy()
    })

    it('has at least one experience entry with required fields', () => {
        expect(portfolio.experience.length).toBeGreaterThan(0)
        for (const exp of portfolio.experience) {
            expect(exp.title).toBeTruthy()
            expect(exp.company).toBeTruthy()
            expect(exp.location).toBeTruthy()
            expect(exp.period).toBeTruthy()
            expect(exp.points.length).toBeGreaterThan(0)
        }
    })

    it('has at least one skill category with skills', () => {
        expect(portfolio.skillCategories.length).toBeGreaterThan(0)
        for (const category of portfolio.skillCategories) {
            expect(category.label).toBeTruthy()
            expect(category.skills.length).toBeGreaterThan(0)
            for (const skill of category.skills) {
                if (typeof skill === 'string') {
                    expect(skill).toBeTruthy()
                } else {
                    expect(skill.label).toBeTruthy()
                }
            }
        }
    })

    it('has at least one education entry with required fields', () => {
        expect(portfolio.education.length).toBeGreaterThan(0)
        for (const edu of portfolio.education) {
            expect(edu.degree).toBeTruthy()
            expect(edu.institution).toBeTruthy()
            expect(edu.location).toBeTruthy()
            expect(edu.year).toBeTruthy()
        }
    })

    it('has devPractices entries', () => {
        expect(portfolio.devPractices.length).toBeGreaterThan(0)
    })

    it('passes portfolioSchema Zod validation', () => {
        const result = portfolioSchema.safeParse(data)
        if (!result.success) {
            // Surface the first issue to make failures actionable
            throw new Error(
                `portfolio.example.json failed schema validation: ${JSON.stringify(result.error.issues[0], null, 2)}`
            )
        }
        expect(result.success).toBe(true)
    })
})
