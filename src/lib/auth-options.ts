import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'github') {
                return false
            }

            if (!adminEmail) {
                return false
            }

            const email = user.email?.trim().toLowerCase()
            return email === adminEmail
        },
        async jwt({ token, user }) {
            const email = (user?.email ?? token.email)?.trim().toLowerCase()

            if (!email) {
                token.role = 'guest'
                return token
            }

            const dbUser = await prisma.user.findUnique({
                where: { email },
                select: { role: true },
            })

            if (dbUser?.role) {
                token.role = dbUser.role
            } else if (adminEmail && email === adminEmail) {
                token.role = 'admin'
            } else {
                token.role = 'guest'
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub ?? ''
                session.user.role =
                    typeof token.role === 'string' ? token.role : 'admin'
            }

            return session
        },
    },
}
