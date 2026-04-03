import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const email = credentials?.email?.trim().toLowerCase()
                const password = credentials?.password

                if (!email || !password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) {
                    return null
                }

                const isValid = await bcrypt.compare(
                    password,
                    user.passwordHash
                )
                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && 'role' in user) {
                token.role = (user.role as string | undefined) ?? 'admin'
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
