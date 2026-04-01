# Michiel Peeraer Portfolio

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

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Formatting**: Prettier

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
FORMSPARK_FORM_ID=
```

Notes:

- BotID requires JavaScript-based form submission, which is already handled by the client-side `fetch` flow in the contact form.
- The contact form now submits to `/api/contact`, where `checkBotId()` is run before forwarding the payload to Formspark.
- BotID classification headers are attached by `src/instrumentation-client.ts` for `POST /api/contact`.
- In development, the server logs a warning if `FORMSPARK_FORM_ID` is missing: `[contact-api] Missing FORMSPARK_FORM_ID. Contact submissions will fail until it is configured.`
- For production, set the same variables in your hosting platform.

## Build for Production

```bash
npm run build
npm start
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

- Update personal information in `src/app/page.tsx`
- Modify Matrix rain effect in `src/components/MatrixRain.tsx`
- Adjust styling in `src/app/globals.css` and Tailwind classes

## License

This project is open source and available under the [MIT License](LICENSE).
