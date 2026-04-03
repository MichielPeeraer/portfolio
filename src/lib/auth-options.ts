import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { getAuthEnv } from '@/lib/env'
import { prisma } from '@/lib/prisma'

const authEnv = getAuthEnv()
const adminEmail = authEnv.adminEmail
const adminGithubLogin = authEnv.adminGithubLogin

type TokenWithGithubLogin = { githubLogin?: unknown }
type GithubProfile = { login?: unknown }

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? ''

const readGithubLoginFromProfile = (profile?: GithubProfile | null) =>
    typeof profile?.login === 'string' ? normalize(profile.login) : ''

const readGithubLoginFromToken = (token: TokenWithGithubLogin) =>
    typeof token.githubLogin === 'string' ? normalize(token.githubLogin) : ''

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
            clientId: authEnv.githubId,
            clientSecret: authEnv.githubSecret,
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

            const email = normalize(user.email)
            const githubLogin = readGithubLoginFromProfile(
                profile as GithubProfile | null | undefined
            )

            const matchesEmail = Boolean(adminEmail && email === adminEmail)
            const matchesGithubLogin = Boolean(
                adminGithubLogin && githubLogin === adminGithubLogin
            )

            return matchesEmail || matchesGithubLogin
        },
        async jwt({ token, user, profile }) {
            const email = normalize(user?.email ?? token.email)
            const githubLoginFromProfile = readGithubLoginFromProfile(
                profile as GithubProfile | null | undefined
            )
            const githubLoginFromToken = readGithubLoginFromToken(
                token as TokenWithGithubLogin
            )
            const githubLogin = githubLoginFromProfile || githubLoginFromToken

            ;(token as { githubLogin?: string }).githubLogin = githubLogin

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
