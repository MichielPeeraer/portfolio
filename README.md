# Michiel Peeraer Portfolio

A retro Matrix-themed portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Matrix Rain Effect**: Animated falling green characters in the background
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for entrance animations and interactions
- **Retro Theme**: Black background with green text, monospace font
- **Protected Contact Form**: Cloudflare Turnstile verification before form submission
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
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_FORMSPARK_FORM_ID=
```

Notes:

- Use the same real Turnstile site key in development and production. Make sure `localhost` is added to the Turnstile allowed hostnames in Cloudflare.
- The contact form submits Turnstile token directly to Formspark as `cf-turnstile-response`.
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
