# Michiel Peeraer Portfolio

[![CI](https://github.com/MichielPeeraer/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MichielPeeraer/portfolio/actions/workflows/ci.yml)

A retro Matrix-themed portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Motivation

I wanted a personal portfolio that felt different from the usual clean-and-minimal templates. The Matrix rain aesthetic reflects my appreciation for retro hacker culture while still being a fully production-ready Next.js application with auth, a database-backed admin dashboard, and solid test coverage.

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
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: NextAuth (GitHub OAuth)

## Quick Start

```bash
git clone https://github.com/MichielPeeraer/portfolio.git
cd portfolio
npm install
cp .env.example .env.local   # then fill in the required values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it for a local preview.

For full functionality (admin dashboard, contact form, database) see the [Environment Variables](#environment-variables) and [Database and Admin Setup](#database-and-admin-setup) sections below.

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

| Variable                | Required | Description                                                                       |
| ----------------------- | -------- | --------------------------------------------------------------------------------- |
| `DATABASE_URL`          | ✅       | Pooled connection string (port 6543)                                              |
| `DATABASE_URL_UNPOOLED` | ✅       | Direct connection string (port 5432) — used for migrations and seeding            |
| `NEXTAUTH_URL`          | ✅       | Full base URL of the app (e.g. `http://localhost:3000`)                           |
| `NEXTAUTH_SECRET`       | ✅       | Random secret for signing JWTs                                                    |
| `ADMIN_EMAIL`           | ✅       | Email address allowed to sign in as admin                                         |
| `ADMIN_GITHUB_LOGIN`    | ✅       | GitHub username allowed to sign in as admin                                       |
| `GITHUB_ID`             | ✅       | GitHub OAuth App client ID                                                        |
| `GITHUB_SECRET`         | ✅       | GitHub OAuth App client secret                                                    |
| `SMTP_HOST`             | ✅       | SMTP server hostname                                                              |
| `SMTP_PORT`             | ✅       | SMTP server port (e.g. `465`)                                                     |
| `SMTP_USER`             | ✅       | SMTP login username                                                               |
| `SMTP_PASS`             | ✅       | SMTP password / app password                                                      |
| `NEXT_PUBLIC_SITE_URL`  | ✅       | Public site URL used for canonical links and OpenGraph                            |
| `CRON_SECRET`           | ⚠️ opt   | Bearer token to protect `/api/cron/ping-db`; if unset the endpoint is unprotected |
| `BLOB_READ_WRITE_TOKEN` | ⚠️ opt   | Vercel Blob read/write token — required for profile photo uploads                 |

Optional performance tuning (rarely needed):

| Variable                        | Default                        | Description                               |
| ------------------------------- | ------------------------------ | ----------------------------------------- |
| `DB_POOL_MAX`                   | `5`                            | Maximum DB connections                    |
| `DB_IDLE_TIMEOUT_S`             | `20`                           | Idle connection timeout (seconds)         |
| `DB_CONNECT_TIMEOUT_S`          | `30`                           | Connection timeout (seconds)              |
| `PORTFOLIO_DB_FETCH_TIMEOUT_MS` | `20000` (prod) / `15000` (dev) | DB query timeout for portfolio data       |
| `PORTFOLIO_DB_FETCH_RETRIES`    | `2` (prod) / `1` (dev)         | Retry attempts for portfolio data queries |

> If you use the **Neon Vercel integration**, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_URL`, and `POSTGRES_URL_NON_POOLING` are injected automatically into all Vercel environments — you only need to set them locally in `.env.local`.

> If you use the **Vercel Blob integration**, `BLOB_READ_WRITE_TOKEN` is injected automatically into all Vercel environments. Pull it locally with `vercel env pull .env.local`.

Notes:

- The contact form submits to `/api/contact`, sending the main message to `ADMIN_EMAIL` and an auto-reply to the sender.
- SMTP credentials should come from your email provider (for Gmail/Outlook use an app password).
- For production, set the same variables in your hosting platform (Vercel → Project Settings → Environment Variables).

## Security Runbook

If any `.env` value is exposed, rotate secrets immediately and redeploy.

### Rotation Priority

1. Database credentials (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`)
2. OAuth secret (`GITHUB_SECRET`)
3. Email credentials (`SMTP_PASS`)
4. Session secret (`NEXTAUTH_SECRET`)

### Emergency Response Steps

1. Rotate secrets in your database provider, GitHub OAuth app settings, and SMTP provider.
2. Update Vercel project environment variables for all environments.
3. Update local `.env.local` with fresh values.
4. Redeploy and verify `/login`, `/admin`, and `/api/contact`.
5. Invalidate old sessions by rotating `NEXTAUTH_SECRET`.

### Runtime Guardrails

- The app now fails fast on missing required auth/contact env vars in development and production.
- Deprecated keys (`ADMIN_PASSWORD`, `CONTACT_TO_EMAIL`) now trigger startup errors to avoid insecure legacy config.

## Database and Admin Setup

1. Generate SQL migration files from the Drizzle schema:

```bash
npm run db:generate
```

2. Apply migrations to the database:

```bash
npm run db:migrate
```

> **Tip — dev shortcut:** `npm run db:push` applies schema changes directly without generating migration files. Use this for fast local iteration; use `db:generate` + `db:migrate` for production-grade change tracking.

3. Seed database with current `src/data/portfolio.json` and bootstrap admin user:

```bash
npm run db:seed
```

4. Configure a GitHub OAuth App and set callback URLs:
    - **Production**: `https://<your-domain>/api/auth/callback/github`
    - **Local dev**: create a separate GitHub OAuth app with callback `http://localhost:3000/api/auth/callback/github` and use its `GITHUB_ID`/`GITHUB_SECRET` in `.env.local`

5. Start app and sign in at `/login` with GitHub.
   Access is restricted to `ADMIN_GITHUB_LOGIN` (recommended), with
   `ADMIN_EMAIL` as fallback.

The public site reads portfolio data from the normalized DB tables and falls back to `src/data/portfolio.json` if the DB is unavailable.

> **Drizzle Studio:** run `npm run db:studio` to open a browser-based DB viewer/editor.

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
├── app/                  # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── admin/        # Portfolio PUT + profile image upload
│   │   ├── auth/         # NextAuth handlers
│   │   ├── contact/      # Contact form endpoint
│   │   └── cron/         # DB keep-warm cron
│   ├── admin/            # Admin dashboard page
│   ├── login/
│   └── page.tsx          # Public portfolio
├── components/
│   ├── admin/            # Admin dashboard UI and state
│   ├── cards/            # Experience, Education, Skill cards
│   ├── effects/          # Matrix rain, loader, toaster
│   ├── layout/           # Navbar, footer, back-to-top
│   ├── sections/         # Hero, About, Experience, Skills, Education, Contact
│   └── ui/               # Shared UI primitives
├── db/                   # Drizzle schema, client, seed script
├── hooks/                # Custom React hooks
├── lib/                  # Auth, email, env, portfolio data helpers
├── tests/                # Vitest unit and component tests
└── types/                # Shared TypeScript types
public/
├── cv.pdf                # CV fallback (replace with your own)
└── profile.jpg           # Profile photo fallback (replace with your own)
```

## Customization

If you're using this as a base for your own portfolio, make sure to replace all personal content with your own:

- **Personal details**: Edit `src/data/portfolio.json` with your own name, bio, experience, education, and skills
- **Profile picture**: Replace `public/profile.jpg` with your own photo (used as fallback when no image has been uploaded via the admin dashboard)
- **CV / résumé**: Replace `public/cv.pdf` with your own CV (used as fallback when no path is set in the admin dashboard)
- **Contact info & social links**: Update the relevant fields in `portfolio.json`
- **Site metadata**: Set your name, URL, and description in `src/lib/site.ts`
- **Global styles**: Adjust colours and fonts in `src/app/globals.css`
- **Section components**: Tweak layout and copy in `src/components/sections/`
- **Visual effects**: Fine-tune the Matrix rain and other effects in `src/components/effects/`

> The admin dashboard lets you upload a profile photo (stored in Vercel Blob) and set a custom CV path. The files in `public/` act as static fallbacks — they are served automatically when those fields have not been configured yet.

## Usage

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start development server at `localhost:3000` |
| `npm run build`       | Create an optimised production build         |
| `npm start`           | Serve the production build                   |
| `npm run test`        | Run unit & component tests (Vitest)          |
| `npm run test:e2e`    | Run end-to-end tests (Playwright)            |
| `npm run lint`        | Lint with ESLint                             |
| `npm run format`      | Format all files with Prettier               |
| `npm run typecheck`   | Type-check without emitting output           |
| `npm run db:generate` | Generate Drizzle migration SQL files         |
| `npm run db:migrate`  | Apply pending migrations to the database     |
| `npm run db:push`     | Push schema directly (dev fast-path)         |
| `npm run db:seed`     | Seed the database from `portfolio.json`      |
| `npm run db:studio`   | Open Drizzle Studio (browser DB viewer)      |

The admin dashboard is available at `/admin` after signing in via `/login` with the GitHub account configured in `ADMIN_GITHUB_LOGIN`.

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository and create a branch: `git checkout -b feat/your-feature`
2. Make your changes and ensure all checks pass:
    ```bash
    npm run typecheck
    npm run lint
    npm run test
    ```
3. Commit using a descriptive message and open a Pull Request against `main`.

Please keep PRs focused — one feature or fix per PR makes review faster.

## License

This project is open source and available under the [MIT License](LICENSE).
