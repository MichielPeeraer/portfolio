import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const portfolioPath = join(process.cwd(), 'src', 'data', 'portfolio.json')
    const portfolioData = JSON.parse(readFileSync(portfolioPath, 'utf8'))

    await prisma.portfolioContent.upsert({
        where: { key: 'primary' },
        update: { data: portfolioData },
        create: {
            key: 'primary',
            data: portfolioData,
        },
    })

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (adminEmail && adminPassword) {
        const passwordHash = await bcrypt.hash(adminPassword, 12)

        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                passwordHash,
                role: 'admin',
            },
            create: {
                email: adminEmail,
                passwordHash,
                role: 'admin',
                name: 'Portfolio Admin',
            },
        })
    } else {
        console.warn(
            '[seed] ADMIN_EMAIL and ADMIN_PASSWORD are not set. Skipping admin bootstrap.'
        )
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })
