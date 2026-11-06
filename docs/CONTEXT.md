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
Per-page title/description/canonical/OG/Twitter · Organization + ProfessionalService + WebSite JSON-LD · Service JSON-LD on every service page · BreadcrumbList on inner pages · FAQPage on home · sitemap.xml · robots.txt · web manifest · one h1 per page · alt text on all photos · same URLs as WordPress.

## Status
- [x] All pages built, lint + build pass, screenshots checked at 390px and 1440px
- [ ] Run `npm run images` on a machine with internet (the build environment couldn't reach techfahm.com) → replaces placeholders with real photos + real logo
- [ ] Check every Pexels photo after download (IDs in `scripts/images.mjs`); swap any that don't fit
- [ ] Add Web3Forms key to `.env.local`, rebuild, send a test message
- [ ] Lighthouse run on the real-image build
- [ ] Upload to cPanel (see README)

## Ideas for later
- Real team photos and names (with permission) on /our-team/
- Case studies / testimonials once the client provides real ones
- Blog for SEO ("IT tips for Toronto small businesses")
- Location pages: /it-support-hamilton/, /it-support-waterloo/

## Change log
- 2026-11-06 — Project created. Full site, motion system, SEO, image pipeline, cPanel `.htaccess`, docs. Placeholders used for images until `npm run images` runs with internet access.
- 2026-11-06 — Footer: big "techfahm" wordmark is now a centred background behind the whole footer (no extra space below). Bottom row credits "Designed & developed by Milink" → https://milink.ca.
