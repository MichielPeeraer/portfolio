type NodeEnv = 'development' | 'production' | 'test'

const readEnv = (name: string) =>
    process.env[name]?.trim().replace(/^['"]|['"]$/g, '') ?? ''

const runtimeEnv =
    (process.env.NODE_ENV as NodeEnv | undefined) ?? 'development'
const shouldThrow = runtimeEnv !== 'test'

const requireEnv = (name: string, context: string) => {
    const value = readEnv(name)

    if (value) {
        return value
    }

    const message = `[env] Missing required env var ${name} for ${context}.`

    if (shouldThrow) {
        throw new Error(message)
    }

    return ''
}

export const getAuthEnv = () => {
    return {
        adminEmail: requireEnv('ADMIN_EMAIL', 'authentication').toLowerCase(),
        adminGithubLogin: readEnv('ADMIN_GITHUB_LOGIN').toLowerCase(),
        githubId: requireEnv('GITHUB_ID', 'authentication'),
        githubSecret: requireEnv('GITHUB_SECRET', 'authentication'),
        nextAuthSecret: requireEnv('NEXTAUTH_SECRET', 'authentication'),
    }
}

export const getContactEnv = () => {
    return {
        smtpHost: requireEnv('SMTP_HOST', 'contact email delivery'),
        smtpPort: requireEnv('SMTP_PORT', 'contact email delivery'),
        smtpUser: requireEnv('SMTP_USER', 'contact email delivery'),
        smtpPass: requireEnv('SMTP_PASS', 'contact email delivery'),
        adminEmail: requireEnv('ADMIN_EMAIL', 'contact email delivery'),
    }
}
