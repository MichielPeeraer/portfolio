import { test, expect, type Page } from '@playwright/test'

const fastForwardFormMinFillTimer = async (page: Page) => {
    await page.evaluate(() => {
        const originalNow = Date.now
        const bumpedNow = originalNow() + 3000
        Date.now = () => bumpedNow
    })
}

test.describe('Portfolio smoke tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' })
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

    test('CV link is present', async ({ page }) => {
        const link = page.getByRole('link', { name: 'View CV' })
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

    test('contact form submits to /api/contact (mocked)', async ({ page }) => {
        let submittedPayload: Record<string, unknown> | null = null

        await page.route('**/api/contact', async (route) => {
            submittedPayload = route.request().postDataJSON() as Record<
                string,
                unknown
            >

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            })
        })

        await page.locator('#contact').scrollIntoViewIfNeeded()
        await page.locator('input[name="firstname"]').fill('Neo')
        await page.locator('input[name="lastname"]').fill('Anderson')
        await page.locator('input[name="email"]').fill('neo@zion.io')
        await page
            .locator('input[name="linkedin"]')
            .fill('linkedin.com/in/neo-anderson')
        await page
            .locator('textarea[name="message"]')
            .fill('There is no spoon, only shipping.')

        await fastForwardFormMinFillTimer(page)
        await page.getByRole('button', { name: 'Send Secure Message' }).click()

        await expect
            .poll(() => submittedPayload)
            .toMatchObject({
                FirstName: 'Neo',
                LastName: 'Anderson',
                Email: 'neo@zion.io',
                LinkedIn: 'https://linkedin.com/in/neo-anderson',
                Message: 'There is no spoon, only shipping.',
                Website: '',
            })

        await expect(page.locator('input[name="firstname"]')).toHaveValue('')
        await expect(page.locator('textarea[name="message"]')).toHaveValue('')
    })

    test('contact form shows API error when /api/contact fails (mocked)', async ({
        page,
    }) => {
        await page.route('**/api/contact', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Server unavailable' }),
            })
        })

        await page.locator('#contact').scrollIntoViewIfNeeded()
        await page.locator('input[name="firstname"]').fill('Neo')
        await page.locator('input[name="lastname"]').fill('Anderson')
        await page.locator('input[name="email"]').fill('neo@zion.io')
        await page
            .locator('textarea[name="message"]')
            .fill('This should fail and show an error.')

        await fastForwardFormMinFillTimer(page)
        await page.getByRole('button', { name: 'Send Secure Message' }).click()

        await expect(
            page.getByText('* Server unavailable', { exact: true })
        ).toBeVisible()
        await expect(page.locator('input[name="firstname"]')).toHaveValue('Neo')
        await expect(page.locator('textarea[name="message"]')).toHaveValue(
            'This should fail and show an error.'
        )
    })
})

test.describe('Admin access tests', () => {
    test('login page renders GitHub sign-in button', async ({ page }) => {
        await page.goto('/login', { waitUntil: 'domcontentloaded' })
        await expect(
            page.getByRole('button', { name: /github/i })
        ).toBeVisible()
    })

    test('login page has admin heading', async ({ page }) => {
        await page.goto('/login', { waitUntil: 'domcontentloaded' })
        await expect(
            page.getByRole('heading', { name: 'Admin Login' })
        ).toBeVisible()
    })

    test('signout page renders confirm button', async ({ page }) => {
        await page.goto('/signout', { waitUntil: 'domcontentloaded' })
        await expect(
            page.getByRole('button', { name: /confirm sign out/i })
        ).toBeVisible()
    })

    test('/api/admin/portfolio returns 401 when unauthenticated', async ({
        request,
    }) => {
        const response = await request.get('/api/admin/portfolio')
        expect(response.status()).toBe(401)
    })

    test('/api/admin/portfolio PUT returns 401 when unauthenticated', async ({
        request,
    }) => {
        const response = await request.put('/api/admin/portfolio', {
            data: { _version: 0 },
        })
        expect(response.status()).toBe(401)
    })
})
