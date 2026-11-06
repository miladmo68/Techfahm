# Techfahm.com — Next.js redesign

Static, mobile-first marketing site for Techfahm Systems Inc. Built with Next.js (App Router, static export), TypeScript, Tailwind CSS v4, Motion, Lenis and Radix. Runs on any cPanel host. No Node or PHP needed on the server.

> Working on this project with an AI assistant? Tell it: **"Read CLAUDE.md and docs/CONTEXT.md first."**

## 1. First run (on your computer)

```bash
npm install
npm run images     # downloads every Techfahm photo + free Pexels photos and optimises them
npm run dev        # open http://localhost:3000
```

`npm run images` needs internet. It saves originals in `assets/raw/` and optimised WebP files in `public/images/`, then rewrites `src/lib/image-manifest.json`. Any image it can't download is replaced by a fallback or a placeholder, and it prints which ones. Run it again any time (`npm run images -- --force` re-downloads everything).

## 2. Contact form (free)

1. Go to https://web3forms.com, enter `info@techfahm.com`, and copy the access key they email you.
2. Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=your-key-here
   ```
3. Rebuild. Without a key, the form opens the visitor's email app instead.

## 3. Build

```bash
npm run build      # creates /out
npm run preview    # check the static site locally
```

## 4. Upload to cPanel

1. **Back up the current WordPress site** in cPanel (Backup Wizard, or download `public_html` and export the database).
2. Zip the **contents** of `out/` (not the folder itself): `cd out && zip -r ../techfahm-site.zip . && cd ..`
3. In cPanel → File Manager → `public_html`: move the old WordPress files into a backup folder, upload `techfahm-site.zip`, and extract it.
4. Make sure hidden files are visible (Settings → Show Hidden Files) and that `.htaccess` is there.
5. Open https://techfahm.com and click through every page. In Google Search Console, submit `https://techfahm.com/sitemap.xml`.

## Editing content

All text is in `src/content/` (`site.ts`, `services.ts`, `industries.ts`, `faq.ts`). Images: add to `SOURCES` in `scripts/images.mjs`, run `npm run images`, then use `<Photo name="your-name" alt="…" />`.
