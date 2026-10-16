# Locus AI: website and live demo

Marketing site and interactive product demo for Locus AI, organizational memory infrastructure for enterprise AI.

**Live:** https://shubhamshrivastava11.github.io/LOCUS-AI-DEMO-WEB-MOBILE/

- **Stack:** Next.js 14 (App Router, static export), TypeScript, plain CSS design tokens
- **Routes:** home, product, security, integrations, pricing, contact, privacy, terms, sign-in, and `/demo` (interactive web + mobile app demo)
- **Hosting:** GitHub Pages, served from the `gh-pages` branch

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000/LOCUS-AI-DEMO-WEB-MOBILE
```

## Publish an update

```bash
npm run build                 # writes the static site to out/
# then push the contents of out/ to the gh-pages branch
```
