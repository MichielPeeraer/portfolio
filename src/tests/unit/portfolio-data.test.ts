import { describe, it, expect } from 'vitest'
import data from '@/data/portfolio.json'

describe('portfolio.json', () => {
    it('has required personal fields', () => {
        expect(data.personal.name).toBeTruthy()
        expect(data.personal.title).toBeTruthy()
        expect(data.personal.about).toBeTruthy()
    })

    it('has at least one experience entry with required fields', () => {
        expect(data.experience.length).toBeGreaterThan(0)
        for (const exp of data.experience) {
            expect(exp.title).toBeTruthy()
            expect(exp.company).toBeTruthy()
            expect(exp.location).toBeTruthy()
            expect(exp.period).toBeTruthy()
            expect(exp.points.length).toBeGreaterThan(0)
        }
    })

    it('has at least one skill category with skills', () => {
        expect(data.skillCategories.length).toBeGreaterThan(0)
        for (const category of data.skillCategories) {
            expect(category.label).toBeTruthy()
            expect(category.skills.length).toBeGreaterThan(0)
        }
    })

    it('has at least one education entry with required fields', () => {
        expect(data.education.length).toBeGreaterThan(0)
        for (const edu of data.education) {
            expect(edu.degree).toBeTruthy()
            expect(edu.institution).toBeTruthy()
            expect(edu.location).toBeTruthy()
            expect(edu.year).toBeTruthy()
        }
    })

    it('has devPractices entries', () => {
        expect(data.devPractices.length).toBeGreaterThan(0)
    })
})
