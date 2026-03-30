import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'

// Mirror the schema from ContactForm.tsx
const contactSchema = z.object({
    firstname: z.string().min(1, '* Required'),
    lastname: z.string().min(1, '* Required'),
    email: z.string().email('* Not a valid email address'),
    phone: z
        .string()
        .optional()
        .refine(
            (value) => !value || isValidPhoneNumber(value),
            '* Not a valid phone number'
        ),
    company: z.string().optional(),
    linkedin: z
        .string()
        .optional()
        .refine(
            (value) =>
                !value ||
                /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(
                    value
                ),
            '* Not a valid LinkedIn URL'
        ),
    message: z.string().min(1, '* Required'),
    website: z.string().optional(),
    turnstile: z.string().min(1, '* Required'),
})

describe('contactSchema', () => {
    const valid = {
        firstname: 'Neo',
        lastname: 'Anderson',
        email: 'neo@zion.io',
        message: 'Hello from Zion',
        turnstile: 'token123',
    }

    it('accepts a valid minimal payload', () => {
        expect(contactSchema.safeParse(valid).success).toBe(true)
    })

    it('rejects missing firstname', () => {
        const result = contactSchema.safeParse({ ...valid, firstname: '' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
        const result = contactSchema.safeParse({
            ...valid,
            email: 'not-an-email',
        })
        expect(result.success).toBe(false)
    })

    it('rejects missing message', () => {
        const result = contactSchema.safeParse({ ...valid, message: '' })
        expect(result.success).toBe(false)
    })

    it('rejects missing turnstile token', () => {
        const result = contactSchema.safeParse({ ...valid, turnstile: '' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid LinkedIn URL', () => {
        const result = contactSchema.safeParse({
            ...valid,
            linkedin: 'https://twitter.com/neo',
        })
        expect(result.success).toBe(false)
    })

    it('accepts valid LinkedIn URL', () => {
        const result = contactSchema.safeParse({
            ...valid,
            linkedin: 'https://linkedin.com/in/neo-anderson',
        })
        expect(result.success).toBe(true)
    })

    it('allows optional fields to be omitted', () => {
        const result = contactSchema.safeParse({
            ...valid,
            phone: undefined,
            company: undefined,
            linkedin: undefined,
            website: undefined,
        })
        expect(result.success).toBe(true)
    })
})
