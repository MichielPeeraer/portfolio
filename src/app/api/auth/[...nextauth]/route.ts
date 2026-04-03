import NextAuth from 'next-auth'
import { createAuthOptions } from '@/lib/auth-options'

const getHandler = () => NextAuth(createAuthOptions())

export const GET = (request: Request, context: unknown) =>
    getHandler()(request, context)

export const POST = (request: Request, context: unknown) =>
    getHandler()(request, context)
