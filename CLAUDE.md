# CLAUDE.md — read this first

This is the **Techfahm.com redesign**: a static Next.js site that replaces the old WordPress site and is uploaded to **cPanel shared hosting** (no Node server, no PHP).

## Before you change anything
1. Read `docs/CONTEXT.md` — decisions, design system, file map, status and change log.
2. Read `AGENTS.md` — this Next.js version has breaking changes; check `node_modules/next/dist/docs/` before using an API you're unsure of.
3. **Find and load skills** before design or content work. Search the available skills (skill finder / `SearchSkills` / plugin list) for: `frontend-design`, `motion`, `animation`, `seo`, `accessibility`, `performance`. Always load `frontend-design` for any visual change.
4. After every task, add a dated line to the **Change log** in `docs/CONTEXT.md`.

## Hard rules
- **Static export only** (`output: "export"`). No API routes, server actions, middleware, cookies, rewrites/redirects in next.config, or ISR. Redirects go in `public/.htaccess`.
- Keep the **old WordPress URLs with trailing slashes** (`/services/<slug>/`, `/industry/<slug>/`, `/partners/`, `/our-team/`, `/contact/`).
- **No Client Portal** link anywhere (the old `techfahm.myportallogin.com` link was removed on purpose).
- **No hotlinked images.** Every image lives in the project. Add new images to `SOURCES` in `scripts/images.mjs`, run `npm run images`, then use `<Photo name="..." />`.
- **Never invent facts**: no fake testimonials, client logos, stats, years, certifications, hours or addresses. True numbers only (6 services, 3 regions, 4 partners).
- All copy lives in `src/content/*.ts`. Change text there, not in components.
- Mobile-first. Check 375px and 1440px screenshots before finishing. No horizontal overflow.
- Respect `prefers-reduced-motion` in every new animation. Animate `transform`/`opacity` only.
- `npm run lint` and `npm run build` must pass with zero errors.

## Commands
```bash
npm install
npm run images      # download + optimise all images (needs internet)
npm run dev         # http://localhost:3000
npm run build       # writes the static site to /out
npm run preview     # serve /out locally
```
