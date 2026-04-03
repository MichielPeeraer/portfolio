import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const adminGithubLogin = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase()

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
            allowDangerousEmailAccountLinking: true,
            authorization: {
                params: {
                    scope: 'read:user user:email',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider !== 'github') {
                return false
            }

            const email = user.email?.trim().toLowerCase()
            const githubLogin =
                profile &&
                    typeof (profile as { login?: unknown }).login === 'string'
                    ? ((profile as { login: string }).login ?? '')
                        .trim()
                        .toLowerCase()
                    : ''

            const matchesEmail = Boolean(adminEmail && email === adminEmail)
            const matchesGithubLogin = Boolean(
                adminGithubLogin && githubLogin === adminGithubLogin
            )

            return matchesEmail || matchesGithubLogin
        },
        async jwt({ token, user, profile }) {
            const email = (user?.email ?? token.email)?.trim().toLowerCase()
            const githubLoginFromProfile =
                profile &&
                    typeof (profile as { login?: unknown }).login === 'string'
                    ? ((profile as { login: string }).login ?? '')
                        .trim()
                        .toLowerCase()
                    : ''
            const githubLoginFromToken =
                typeof (token as { githubLogin?: unknown }).githubLogin ===
                    'string'
                    ? ((token as { githubLogin: string }).githubLogin ?? '')
                        .trim()
                        .toLowerCase()
                    : ''
            const githubLogin = githubLoginFromProfile || githubLoginFromToken

                ; (token as { githubLogin?: string }).githubLogin = githubLogin

            const dbUser = token.sub
                ? await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, email: true },
                })
                : email
                    ? await prisma.user.findUnique({
                        where: { email },
                        select: { role: true, email: true },
                    })
                    : null

            if (dbUser?.role) {
                token.role = dbUser.role
            } else if (adminEmail && email === adminEmail) {
                token.role = 'admin'
            } else if (adminGithubLogin && githubLogin === adminGithubLogin) {
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
