import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import GithubProvider from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { getAuthEnv } from '@/lib/env'
import { db } from '@/db'
import { users, accounts, sessions, verificationTokens } from '@/db/schema'

type TokenWithGithubLogin = { githubLogin?: unknown }
type GithubProfile = { login?: unknown }

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? ''

const readGithubLoginFromProfile = (profile?: GithubProfile | null) =>
    typeof profile?.login === 'string' ? normalize(profile.login) : ''

const readGithubLoginFromToken = (token: TokenWithGithubLogin) =>
    typeof token.githubLogin === 'string' ? normalize(token.githubLogin) : ''

export const createAuthOptions = (): NextAuthOptions => {
    const authEnv = getAuthEnv()
    const adminEmail = authEnv.adminEmail
    const adminGithubLogin = authEnv.adminGithubLogin

    return {
        adapter: DrizzleAdapter(db, {
            usersTable: users,
            accountsTable: accounts,
            sessionsTable: sessions,
            verificationTokensTable: verificationTokens,
        }) as Adapter,
        secret: authEnv.nextAuthSecret,
        session: {
            strategy: 'jwt',
        },
        pages: {
            signIn: '/login',
            signOut: '/signout',
        },
        providers: [
            GithubProvider({
                clientId: authEnv.githubId,
                clientSecret: authEnv.githubSecret,
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
                const githubLoginFromProfile = readGithubLoginFromProfile(
                    profile as GithubProfile | null | undefined
                )
                const githubLoginFromToken = readGithubLoginFromToken(
                    token as TokenWithGithubLogin
                )
                const githubLogin =
                    githubLoginFromProfile || githubLoginFromToken

                ;(token as { githubLogin?: string }).githubLogin = githubLogin

                // Only query the DB on the initial sign-in (when `user` is
                // present). On subsequent requests the role is already stored
                // in the JWT and the middleware runs in Edge (no TCP available).
                const isSignIn = !!user
                if (!isSignIn && token.role) {
                    return token
                }

                const email = normalize(user?.email ?? token.email)

                let dbUser: {
                    role: string | null
                    email: string | null
                } | null = null
                try {
                    dbUser = token.sub
                        ? await db
                              .select({ role: users.role, email: users.email })
                              .from(users)
                              .where(eq(users.id, token.sub))
                              .limit(1)
                              .then((rows) => rows[0] ?? null)
                        : email
                          ? await db
                                .select({
                                    role: users.role,
                                    email: users.email,
                                })
                                .from(users)
                                .where(eq(users.email, email))
                                .limit(1)
                                .then((rows) => rows[0] ?? null)
                          : null
                } catch {
                    // Fall back to env-based admin matching when DB is unreachable.
                }

                const isAdminByEnv =
                    (adminEmail && email === adminEmail) ||
                    (adminGithubLogin && githubLogin === adminGithubLogin)

                if (isAdminByEnv) {
                    token.role = 'admin'
                } else if (dbUser?.role) {
                    token.role = dbUser.role
                } else {
                    token.role = 'guest'
                }

                return token
            },
            async session({ session, token }) {
                if (session.user) {
                    session.user.id = token.sub ?? ''
                    session.user.role =
                        typeof token.role === 'string' ? token.role : 'guest'
                }

                return session
            },
        },
    }
}
