# Michiel Peeraer Portfolio

[![CI](https://github.com/MichielPeeraer/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MichielPeeraer/portfolio/actions/workflows/ci.yml)

A retro Matrix-themed portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Matrix Rain Effect**: Animated falling green characters in the background
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for entrance animations and interactions
- **Retro Theme**: Black background with green text, monospace font
- **Protected Contact Form**: Vercel BotID verification before form submission
- **SEO Ready**: Metadata, sitemap, robots.txt, and JSON-LD structured data
- **Production Instrumentation**: Vercel Analytics and Speed Insights support
- **Sections**: Hero, About, Experience, Skills, Education, Contact
- **Admin Dashboard**: Protected login at `/admin` to edit portfolio data

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Formatting**: Prettier
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth (credentials)

## Getting Started

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Copy `.env.example` to `.env.local` and set these values:

```bash
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
ADMIN_EMAIL=
ADMIN_GITHUB_LOGIN=
GITHUB_ID=
GITHUB_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

Notes:

- BotID requires JavaScript-based form submission, which is already handled by the client-side `fetch` flow in the contact form.
- The contact form submits to `/api/contact`, where `checkBotId()` is run before sending:
    - the main message to `ADMIN_EMAIL` (or `CONTACT_TO_EMAIL` if you explicitly set it)
    - an auto-reply to the sender's email address
- BotID classification headers are attached by `src/instrumentation-client.ts` for `POST /api/contact`.
- In development, the server logs a warning if any required email env vars are missing.
- By default, using only `ADMIN_EMAIL` is enough for both incoming notifications and auto-replies.
- SMTP credentials should come from your email provider (for Gmail/Outlook use an app password).
- For production, set the same variables in your hosting platform.

## Database and Admin Setup

1. Generate Prisma client:

```bash
npm run db:generate
```

2. Create and apply local migrations:

```bash
npm run db:migrate -- --name init_auth_and_portfolio
```

3. Seed database with current `src/data/portfolio.json` and bootstrap admin user:

```bash
npm run db:seed
```

4. Configure a GitHub OAuth App and set callback URLs:

```text
http://localhost:3000/api/auth/callback/github
https://<your-domain>/api/auth/callback/github
```

5. Start app and sign in at `/login` with GitHub.
   Access is restricted to `ADMIN_GITHUB_LOGIN` (recommended), with
   `ADMIN_EMAIL` as fallback.

The public site reads portfolio data from DB and falls back to JSON if DB is unavailable.

### Prisma CLI note

If you see this error:

`The datasource property url is no longer supported in schema files...`

you are likely running Prisma v7 globally. This project currently uses Prisma v6.

- Use project scripts (`npm run db:generate`, `npm run db:migrate`) so the local Prisma version is used.
- Avoid running a global `prisma` binary in this repo.

## Build for Production

```bash
npm run build
npm start
```

## Testing

- Run all unit/component tests:

```bash
npm run test
```

- Run E2E tests (Playwright):

```bash
npm run test:e2e
```

- First-time Playwright setup (or after Playwright version updates):

```bash
npx playwright install
```

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    └── MatrixRain.tsx
public/
└── profile.jpg
```

## Customization

- Update portfolio content in `src/data/portfolio.json`
- Adjust global styles in `src/app/globals.css`
- Tweak section components in `src/components/sections/`
- Fine-tune visual effects in `src/components/effects/`

## License

This project is open source and available under the [MIT License](LICENSE).
