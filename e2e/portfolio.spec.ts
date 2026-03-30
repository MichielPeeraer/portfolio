import { test, expect } from '@playwright/test'

test.describe('Portfolio smoke tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('page loads and shows hero name', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Michiel Peeraer')
    })

    test('all main sections are present', async ({ page }) => {
        const sections = [
            '#hero',
            '#about',
            '#experience',
            '#skills',
            '#education',
            '#learning',
            '#contact',
        ]
        for (const id of sections) {
            await expect(page.locator(id)).toBeAttached()
        }
    })

    test('navbar links scroll to correct sections', async ({ page }) => {
        await page.locator('nav').getByText('About').click()
        await expect(page.locator('#about')).toBeInViewport({ ratio: 0.2 })
    })

    test('CV download link is present', async ({ page }) => {
        const link = page.locator('a[download]')
        await expect(link).toBeVisible()
        await expect(link).toHaveAttribute('href', /CV_Michiel_Peeraer/)
    })

    test('contact form renders required fields', async ({ page }) => {
        await page.locator('#contact').scrollIntoViewIfNeeded()
        await expect(page.locator('input[name="firstname"]')).toBeVisible({
            timeout: 8000,
        })
        await expect(page.locator('input[name="email"]')).toBeVisible()
        await expect(page.locator('textarea[name="message"]')).toBeVisible()
    })
})
