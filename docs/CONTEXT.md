# Project context — Techfahm redesign

_Last updated: 2026-11-06_

## Goal
Rebuild https://techfahm.com (WordPress + Slider Revolution) as a premium, mobile-first, fast, SEO-strong Next.js site with professional motion. Hosted on the client's existing **cPanel** as static files. Owner (Milad) has the client's permission.

## Decisions
| Topic | Decision | Why |
|---|---|---|
| Hosting | `output: "export"`, upload `/out` to `public_html` | cPanel, no Node, no PHP |
| URLs | `trailingSlash: true`, same paths as WordPress | Keep Google rankings |
| Client Portal | **Removed** from the site | Owner's request |
| Cookie banner | Removed | No tracking scripts on the site |
| Contact form | Web3Forms (free) via `NEXT_PUBLIC_WEB3FORMS_KEY`; falls back to `mailto:` with no key | No PHP / server |
| Images | `scripts/images.mjs` downloads → sharp → WebP at 240/480/828/1200/1920 in `public/images`; `next/image` with custom loader `src/lib/image-loader.ts` | Optimised images with static export |
| Fonts | Schibsted Grotesk Variable (display, `@fontsource-variable`), Geist Sans/Mono (`geist` package) | Self-hosted, no Google Fonts requests |
| Motion | `motion` (LazyMotion + `m`), Lenis smooth scroll, custom canvas network map | Premium feel, small bundle |
| UI kit | shadcn-style components hand-written (`Button` with cva, Radix Dialog/Accordion) | shadcn CLI not needed |
| Copy | Rewritten from the old site's content, nothing invented | Honesty |
| Local SEO | `/managed-it-services-{toronto,hamilton,waterloo}/` from `src/content/locations.ts` (dynamic `[location]` route) | Rank for "IT support + city" searches |
| Share images | `opengraph-image.tsx` next to every page, rendered by `src/lib/og.tsx` (next/og, Schibsted font, real photo) | Branded previews on LinkedIn, Facebook, X, iMessage |
| Security | Headers + rules in `public/.htaccess` (CSP, HSTS, 410 for WP paths, method + file blocking), `public/.well-known/security.txt` | Static site on shared Apache |
| Preview hosting | GitHub Pages via `.github/workflows/pages.yml`, `NEXT_PUBLIC_BASE_PATH=/Techfahm`, auto `noindex` | Free live preview without hurting SEO |
| Brand red | `#E41C38`, sampled from the real logo | Exact match with logo |
| Photo look | `scripts/images.mjs` applies a brand colour grade (desaturate, navy multiply, faint red glow); `--no-grade` to skip; originals untouched | Stock and real photos read as one family |
| Page-load animation | Hero/page-hero headline, lead, buttons and image use CSS classes `tf-rise`, `tf-fade-up`, `tf-fade-scale`, `tf-clip` (delay via `--d`), softer on <1024px; scroll animations stay in Motion; `template.tsx` only animates client-side navigations | First paint doesn't wait for JS, so LCP stays fast |
| Form validation | react-hook-form built-in rules (zod removed, −144KB JS) | Speed |
| Real proof | techfahm.com has no testimonials, team names, stats or address. Used only what it has: "decades of experience", the group team photo, partner brands (colour marks on /partners/), the real logo | Never invent facts |

## Design system
- **Ink** `#0A1628` (dark surfaces), **Deep** `#10213F`, **Mist** `#EEF2F7`, **Paper** `#F8FAFC`, **Steel** `#5D6B82` (secondary text), **Signal** `#E3262F` (Techfahm red — CTAs, alerts, focus only), **Pulse** `#3DDC97` (healthy status in the hero map only).
- Type classes in `globals.css`: `.t-hero`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead`. Spacing: `--section-y`, `--gutter`, `.container-x`, `.section`.
- Dark sections use `.on-dark` (also makes `.muted` readable on dark).
- Easing everywhere: `[0.22, 1, 0.36, 1]` (`EASE` in `src/lib/utils.ts`).
- Avoid: ALL-CAPS eyebrow labels, one accented word per headline, identical card grids with the same shadow, fake 01/02/03 numbering (the onboarding steps are a real sequence, so they're numbered).

## Landing page (src/app/page.tsx)
1. **Hero** (`sections/hero.tsx` + `network-map.tsx`): canvas network map of the 3 regions; packets flow; a node raises an alert that turns amber and resolves; status panel mirrors it (labelled as an illustration). Masked line reveal headline, magnetic CTA.
2. **Partners strip**: marquee of Microsoft, Cisco, Fortinet, Acronis.
3. **Services stack** (`services-stack.tsx`): sticky stacked panels on desktop (previous panel scales back and dims); plain list on mobile.
4. **Statement**: words fill in on scroll + true stats.
5. **Why us**: sticky heading + parallax photo + 3 pillars.
6. **Process**: 4 steps with a scroll-drawn progress line.
7. **Industries**: two image panels.
8. **FAQ** (Radix accordion + FAQPage JSON-LD).
9. **CTA**: corners square off as you scroll in.

Global: Lenis smooth scroll, top scroll progress bar, custom cursor (mouse only), page transitions (`app/template.tsx`), hide-on-scroll navbar with desktop mega menu, full-screen mobile menu (circle reveal).

## File map
```
src/app/            pages (/, services, services/[slug], industry, industry/[slug], partners, our-team, contact, not-found), sitemap.ts, robots.ts, manifest.ts, template.tsx
src/components/layout/   navbar (+ mobile menu), footer, providers (Lenis + LazyMotion), cursor
src/components/sections/ hero, network-map, partners-strip, services-stack, home-sections (Statement, WhyUs, Process, Industries, Faq, Cta, PageHero), detail (IntroBlock, Checklist, Benefits, RelatedServices, WidePhoto), contact-form
src/components/ui/       button, photo, logo, magnetic, motion (RevealLines, Reveal, ParallaxFrame, ScrubText, ScrollProgress, TextLink)
src/content/        site.ts, services.ts, industries.ts, faq.ts   ← all copy
src/lib/            seo.tsx (metadata + JSON-LD), images.ts, image-loader.ts, image-manifest.json (generated), utils.ts
scripts/images.mjs  image pipeline
public/.htaccess    HTTPS, 404, caching, old WP redirects
```

## SEO checklist (done)
Per-page title/description/canonical/OG/Twitter · generated 1200×630 OG image per page · Organization + ProfessionalService (contactPoint, hasOfferCatalog, areaServed) + WebSite JSON-LD · Service JSON-LD on service and location pages · BreadcrumbList on inner pages · FAQPage on home and location pages · sitemap.xml with image entries · robots.txt · llms.txt · humans.txt · web manifest · Google/Bing verification via env · geo meta (CA-ON) · one h1 per page · alt text on all photos · same URLs as WordPress · internal links: footer + contact page → location pages.

## Security checklist (done)
HTTPS redirect + HSTS · Content-Security-Policy (self + Web3Forms only) · X-Frame-Options DENY / frame-ancestors none · nosniff · Referrer-Policy · Permissions-Policy · COOP/CORP · ServerSignature off · directory listing off · dotfiles/backups/source files blocked · only GET/HEAD/OPTIONS allowed · old WordPress paths (wp-admin, wp-login.php, xmlrpc.php, wp-content…) return 410 · query-string attack patterns blocked · security.txt · contact form: honeypot, 3-second timing check, length limits.

## Status
- [x] All pages built, lint + build pass, screenshots checked at 390px and 1440px
- [x] Real photos + logo downloaded with `npm run images` and committed
- [x] Pushed to GitHub https://github.com/miladmo68/Techfahm and GitHub Pages enabled (Source: GitHub Actions). Live preview: https://miladmo68.github.io/Techfahm/ (noindex)
- [ ] Add Web3Forms key to `.env.local`, rebuild, send a test message
- [x] Lighthouse: accessibility, best practices and SEO 100 on all tested pages; mobile performance 82–97, desktop 99
- [ ] After go-live: verify Google Search Console + Bing, submit sitemap, create/claim the free Google Business Profile
- [ ] Upload to cPanel (see README)

## Ideas for later
- Real team photos and names (with permission) on /our-team/
- Case studies / testimonials once the client provides real ones
- Blog for SEO ("IT tips for Toronto small businesses")
- Location pages: /it-support-hamilton/, /it-support-waterloo/

## Change log
- 2026-11-06 — Project created. Full site, motion system, SEO, image pipeline, cPanel `.htaccess`, docs. Placeholders used for images until `npm run images` runs with internet access.
- 2026-11-06 — Footer: big "techfahm" wordmark is now a centred background behind the whole footer (no extra space below). Bottom row credits "Designed & developed by Milink" → https://milink.ca.
- 2026-11-06 — Footer: removed the background wordmark entirely; tighter padding (pt-14/pb-10 mobile, pt-16/pb-12 desktop, bottom row py-5); on mobile Industries and Company sit side by side.
- 2026-11-06 — SEO + security pass: local landing pages (Toronto/Hamilton/Waterloo), generated OG images for every page, richer JSON-LD, sitemap images, llms.txt, verification env vars, hardened .htaccess (CSP, HSTS, 410 for WP), security.txt, form timing check, brand red set to logo red #E41C38, base-path support + GitHub Pages workflow, README with screenshots.
- 2026-11-06 — GitHub: repo miladmo68/Techfahm created, code pushed, Pages source set to GitHub Actions, workflow green, live preview at https://miladmo68.github.io/Techfahm/, repo About links to it.
- 2026-11-06 — Mobile parity pass: services now stack as sticky cards on mobile too (with "n / 6" badge); hero shows a live "Network status" pill under lg that mirrors the map alerts; on touch screens a soft red spotlight drifts across the network map (touch moves it); card and industry photos zoom in on scroll (ZoomIn) since touch has no hover; buttons get tap feedback; hero and CTA buttons are full-width on mobile; headings, leads, stats, page heroes, breadcrumbs, intro blocks, benefits, contact details, partners, team, 404 and footer are centred on mobile (long lists/FAQ/form stay left). Fixed: navbar logo/menu button were dark-on-dark on location pages.
- 2026-11-06 — Polish pass: mobile sticky Call/Book bar (`layout/mobile-cta.tsx`, hides over `[data-hide-mobile-cta]` and on /contact/); brand colour grade for all photos; animated diagram per service (`sections/service-diagram.tsx`, shown in the Benefits section); full-colour partner marks on /partners/; shorter hero map on short phones; "What happens next" on /contact/; "decades of experience" from techfahm.com; real company photo replaces stock on /our-team/; fixed "IT" being lower-cased in headings (`lowerTitle`). Performance: zod removed, CSS page-load animations, map animation starts on idle and runs at 30fps on touch, 480px logo with fetchPriority high, 640px image size, WebP q72. Accessibility: scroll text animates colour (passes contrast), list markup fixed. Lighthouse a11y/SEO/BP 100.
- 2026-11-06 — Mobile hero tightened so both CTAs fit on the first screen of an iPhone 14 Pro Max (430×739 and 430×664 with the Safari bar): map 36svh (30svh at 701–760px tall, 23svh ≤700px), content starts right under it, tighter gaps; on ≤700px-tall screens the map labels and status pill are hidden to avoid overlap.
- 2026-11-06 — Mobile/tablet hero reworked: instead of fixed svh offsets, the map is in the normal flow with flex-1 and the copy is pinned to the bottom of the first screen (pb 2rem + safe area). The whole hero (map, status, headline, text, both buttons) fits any phone height; the map simply grows on taller screens. Desktop layout unchanged.
- 2026-11-06 — iPhone Safari (floating bottom bar): hero is now min-h 100lvh on phones so the dark hero runs behind the Safari bar (no white strip), with extra bottom padding of (100lvh − 100svh) so the buttons stay above the bar. Page background (html/body) is now ink so Safari tints the top status-bar area dark to match; every section sets its own background.
