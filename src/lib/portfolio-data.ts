import fallbackData from '@/data/portfolio.json'
import { unstable_noStore as noStore } from 'next/cache'
import { portfolioSchema } from '@/lib/portfolio-schema'
import { prisma } from '@/lib/prisma'
import type { PortfolioData } from '@/types'

const fallbackPortfolio = fallbackData as PortfolioData

export const getPortfolioData = async (): Promise<PortfolioData> => {
    noStore()

    try {
        const stored = await prisma.portfolioContent.findUnique({
            where: { key: 'primary' },
            select: { data: true },
        })

        if (!stored?.data) {
            return fallbackPortfolio
        }

        const parsed = portfolioSchema.safeParse(stored.data)
        if (!parsed.success) {
            console.warn(
                '[portfolio-data] Invalid DB payload. Using JSON fallback.'
            )
            return fallbackPortfolio
        }

        return parsed.data as PortfolioData
    } catch {
        return fallbackPortfolio
    }
}
