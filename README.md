# Locus AI: website and live demo

Marketing site and interactive product demo for Locus AI, organizational memory infrastructure for enterprise AI.

- **Stack:** Next.js 14 (App Router), TypeScript, plain CSS design tokens
- **Routes:** home, product, security, integrations, pricing, contact, privacy, terms, sign-in, and `/demo` (interactive web + mobile app demo)
- **Contact API:** `/api/contact` validates work emails; set `LEADS_WEBHOOK_URL` to forward leads

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import this repo in Vercel. Framework preset: Next.js. No build settings needed.
