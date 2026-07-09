# CLAUDE.md

## Project overview

A single-page bilingual (EN/FR) developer portfolio for freelance developer
Cantin Bartel. It serves double duty: a job-search profile and a freelance
business card, presenting background, experience, services, and selected work
with a contact form.

**Rule:** all code, comments, and documentation in this repo must be written
in English, regardless of the FR/EN content the site displays to visitors.

## Commands

- `npm run dev` — starts `next dev -H 0.0.0.0` (binds all interfaces, useful
  for testing on LAN/mobile).
- `npm run build` — `next build`.
- `npm start` — `next start --port $PORT` (requires `$PORT` env var; used in
  production, not local dev).
- `npm run lint` — `eslint .`.
- `npm run pm2:start` / `pm2:startup` / `pm2:restart` / `pm2:stop` /
  `pm2:delete` — process management for the production deployment via PM2.
- Node version is pinned in `.nvmrc` to **22**.
- There are no automated tests in this repo currently.

## Tech stack

- Next.js 16, **Pages Router** (not App Router) — routes live under `pages/`.
- TypeScript, React 18.
- Chakra UI v2 + Emotion for all styling. There is no Tailwind, despite a
  Tailwind icon referenced in the skills config.
- Framer Motion for animation.
- next-i18next for i18n, with YAML (not JSON) locale files.
- nodemailer for the contact form API route.

## Architecture & conventions

`pages/index.tsx` is the entry point. It composes the page as a Chakra `Grid`
with a fixed `Sidebar` column and a scrollable main column containing, in
order: **About → Services → SelectedWork → Experience → GetInTouch**.
`GetInTouch` is lazy-loaded via `next/dynamic` since it's below the fold.

Components live as folders: `index.tsx` plus an optional
`styles.module.css` (see `components/Sidebar/`).

Imports are bare from the repo root (`tsconfig.json` sets `baseUrl: "."`
with no path aliases) — e.g. `components/Sections/About`, `config/theme`,
`hooks/useColorModePreference`, `types/article`. Don't add `@/`-style
aliases; follow the existing bare-import convention.

Content is decoupled from components:
- UI copy: `public/locales/{en,fr}/common.yml` (YAML).
- Structured data (skills, experience, education, sidebar links): `config/*.ts(x)`.
- Theme/colors: `config/theme.ts` — two named palettes, `midnight` (dark) and
  `daylight` (light), applied via Chakra `extendTheme` with `mode(...)` and
  custom component variants.
- Animation variants: `config/animations.ts` (e.g. `fadeInUp`, durations,
  easing curves). Reuse these; don't inline new Framer Motion variants.

## Internationalization

- next-i18next, locales `en`/`fr`, copy in `public/locales/{en,fr}/common.yml`.
- Routing is **domain-based**, configured in `next.config.js`:
  - Production: `www.cantinbartel.dev` → `en`, `fr.cantinbartel.dev` → `fr`
    (overridable via `NEXT_PUBLIC_SITE_DOMAIN_EN` / `_FR`).
  - Development: `localhost` → `en`, `fr.localhost` → `fr`.
- Any new user-facing string must be added to **both** `en/common.yml` and
  `fr/common.yml`.

## Theming & color mode

- Light/dark mode is driven by Chakra's `useColorMode`, synced from a custom
  preference hook (`hooks/useColorModePreference.tsx`, `'system' | 'light' | 'dark'`,
  persisted to `localStorage`) via `ColorModeSync` in `pages/_app.tsx`.
- `pages/_app.tsx` also handles a `?theme=light|dark` query param on mount:
  it's read once and stripped from the URL (it does not persist the
  preference itself — it's a one-time override hook for sharing links).
- **Known inconsistency to preserve for now:** many components hardcode hex
  colors via `useColorModeValue('#172033', '#B8BEC9')` instead of referencing
  theme tokens (see `components/Misc/ScrollMore.tsx`,
  `components/Sections/Experience/ExperienceTab.tsx`). `config/theme.ts`'s
  `midnight`/`daylight` palettes are the source of truth — any new hardcoded
  hex should mirror the corresponding palette value, not invent a new color.

## Environment variables

Set in `.env.local` (see `README.md`):

```
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
GMAIL_USER=your@gmail.com
GMAIL_PASS=your-email-app-password
HOSTINGER_USER=contact@yourdomain.com
HOSTINGER_PASS=your-hosting-password
NEXT_PUBLIC_GOOGLE_CALENDAR="https://calendar.google.com/..."
NEXT_PUBLIC_SITE_DOMAIN_EN=www.cantinbartel.dev
NEXT_PUBLIC_SITE_DOMAIN_FR=fr.cantinbartel.dev
```

## Golden rules

- English only for all code, comments, and documentation — always.
- Add new user-facing copy to both `en/common.yml` and `fr/common.yml`.
- Reuse existing animation variants (`config/animations.ts`) and theme
  palettes (`config/theme.ts`) instead of introducing new ones.
- Do not modify user-facing copy (the FR/EN strings in
  `public/locales/*/common.yml` or any visible text) unless explicitly asked —
  this holds even during redesign work. Redesign = layout/visual/structure only.
  If a design needs a wording change, propose it and wait for approval.
