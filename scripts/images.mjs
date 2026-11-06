#!/usr/bin/env node
/**
 * Image pipeline — run with `npm run images`
 *
 * 1. Downloads every source image (real Techfahm photos + free Pexels photos)
 *    into assets/raw/  (skips files already downloaded; use --force to refresh)
 * 2. Converts each to optimised WebP at several widths into public/images/
 *    named <name>-<width>.webp  (used by src/lib/image-loader.ts)
 * 3. Writes src/lib/image-manifest.json  (width, height, blur placeholder)
 * 4. Generates favicon / apple icon / logo files
 *
 * If a download fails, the script keeps going. If an image has never been
 * downloaded it uses its `fallback` image, or a generated placeholder, so the
 * site always builds. Run it again later to replace placeholders.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const RAW = path.join(ROOT, "assets/raw");
const OUT = path.join(ROOT, "public/images");
const MANIFEST = path.join(ROOT, "src/lib/image-manifest.json");
const CREDITS = path.join(ROOT, "docs/image-credits.md");
const WIDTHS = [240, 480, 828, 1200, 1920]; // keep in sync with image-loader.ts + next.config.ts
const FORCE = process.argv.includes("--force");
const OFFLINE = process.argv.includes("--offline");

const WP = "https://techfahm.com/wp-content/uploads";
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;

/** name → source. `credit` is written to docs/image-credits.md */
export const SOURCES = [
  // Real Techfahm images
  { name: "hero", url: `${WP}/2022/11/happy-ceo-techfahm.jpg`, credit: "Techfahm (original site)" },
  { name: "company", url: `${WP}/2022/12/company-1024x683.jpg`, credit: "Techfahm (original site)" },
  { name: "team", url: `${WP}/2022/12/team-image-1024x820.jpg`, credit: "Techfahm (original site)" },
  { name: "network", url: `${WP}/2022/11/network.jpg`, credit: "Techfahm (original site)" },
  { name: "support", url: `${WP}/2022/11/support.jpg`, credit: "Techfahm (original site)" },
  { name: "cloud", url: `${WP}/2022/11/cloud.jpg`, credit: "Techfahm (original site)" },
  { name: "cyber", url: `${WP}/2022/11/cyber.jpg`, credit: "Techfahm (original site)" },
  { name: "backup", url: `${WP}/2022/11/backup.jpg`, credit: "Techfahm (original site)" },
  { name: "consulting", url: `${WP}/2022/11/consulting.jpg`, credit: "Techfahm (original site)" },
  { name: "health", url: `${WP}/2022/12/iStock-899023542.jpg`, credit: "Techfahm (original site, iStock licence)" },
  { name: "manufacturing", url: `${WP}/2022/12/Manufacturing-header.jpg`, credit: "Techfahm (original site)" },
  { name: "share", url: `${WP}/2022/12/Techfahm-Logo-Facebook-Share.jpg`, credit: "Techfahm (original site)" },
  // Free photos (Pexels licence — free for commercial use, no attribution required)
  { name: "datacenter", url: px(17489163), fallback: "network", credit: "Pexels #17489163" },
  { name: "server-room", url: px(325229), fallback: "cloud", credit: "Pexels #325229" },
  { name: "office-team", url: px(3184292), fallback: "company", credit: "Pexels #3184292" },
  { name: "technician", url: px(4508751), fallback: "support", credit: "Pexels #4508751" },
];

/** Logos / icons — processed to PNG, not responsive WebP */
const LOGOS = [
  { name: "logo", url: `${WP}/2023/08/Techfahm-Logo_Red-Outline-1024x259.png` },
  { name: "logo-border", url: `${WP}/2022/11/Techfahm-Logo-with-border-1.png` },
  { name: "favicon-src", url: `${WP}/2022/11/favicon.png` },
];

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function download(url, dest) {
  if (OFFLINE) return false;
  if (!FORCE && (await exists(dest))) return true;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (techfahm-site-build)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).metadata(); // validate it is an image
    await fs.writeFile(dest, buf);
    console.log(`  ✓ downloaded ${path.basename(dest)}`);
    return true;
  } catch (e) {
    console.warn(`  ✗ ${url} (${e.message})`);
    return false;
  }
}

/** Dark, on-brand placeholder so layouts look right before real photos exist */
function placeholder(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1280">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#132a4f"/><stop offset="1" stop-color="#0a1628"/>
      </linearGradient>
      <pattern id="p" width="64" height="64" patternUnits="userSpaceOnUse">
        <path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity=".06"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#p)"/>
    <circle cx="1500" cy="300" r="420" fill="#e3262f" fill-opacity=".12"/>
    <text x="80" y="1180" font-family="Helvetica, Arial" font-size="64" fill="#ffffff" fill-opacity=".35">${name} — run npm run images</text>
  </svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer();
}

async function processPhoto(name, input) {
  const img = sharp(input).rotate();
  const meta = await img.metadata();
  for (const w of WIDTHS) {
    await sharp(input).rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  const blur = await sharp(input).resize(16).webp({ quality: 40 }).toBuffer();
  return {
    width: meta.width,
    height: meta.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

async function main() {
  await fs.mkdir(RAW, { recursive: true });
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(path.dirname(CREDITS), { recursive: true });

  console.log("\n1/3 Downloading photos…");
  const manifest = {};
  const credits = ["# Image credits", "", "| Image | Source | Credit |", "|---|---|---|"];
  const status = {};

  for (const s of SOURCES) {
    const raw = path.join(RAW, `${s.name}.jpg`);
    const ok = await download(s.url, raw);
    status[s.name] = ok || (await exists(raw)) ? "real" : "missing";
  }

  console.log("\n2/3 Optimising photos…");
  for (const s of SOURCES) {
    let input;
    let kind = status[s.name];
    if (kind === "real") input = path.join(RAW, `${s.name}.jpg`);
    else if (s.fallback && status[s.fallback] === "real") {
      input = path.join(RAW, `${s.fallback}.jpg`);
      kind = `fallback:${s.fallback}`;
    } else {
      input = await placeholder(s.name);
      kind = "placeholder";
    }
    manifest[s.name] = { ...(await processPhoto(s.name, input)), source: kind };
    credits.push(`| ${s.name} | ${s.url} | ${s.credit}${kind !== "real" ? ` (currently ${kind})` : ""} |`);
    console.log(`  • ${s.name.padEnd(14)} ${kind}`);
  }

  console.log("\n3/3 Logos and icons…");
  for (const l of LOGOS) {
    const raw = path.join(RAW, `${l.name}.png`);
    await download(l.url, raw);
  }
  const logoRaw = path.join(RAW, "logo.png");
  if (await exists(logoRaw)) {
    await sharp(logoRaw).trim().png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo.png"));
    const m = await sharp(path.join(OUT, "logo.png")).metadata();
    manifest.__logo = { width: m.width, height: m.height, source: "real" };
    console.log("  ✓ logo.png");
  } else {
    manifest.__logo = { source: "missing" };
    console.log("  • logo: not downloaded yet, the site uses the text wordmark");
  }
  const favRaw = (await exists(path.join(RAW, "favicon-src.png"))) ? path.join(RAW, "favicon-src.png") : null;
  const favSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="112" fill="#0a1628"/><text x="50%" y="62%" text-anchor="middle" font-family="Helvetica, Arial" font-weight="700" font-size="300" fill="#e3262f">t</text></svg>`,
  );
  const fav = favRaw ?? favSvg;
  await sharp(fav).resize(512, 512, { fit: "contain", background: "#0a1628" }).png().toFile(path.join(ROOT, "public/icon-512.png"));
  await sharp(fav).resize(192, 192, { fit: "contain", background: "#0a1628" }).png().toFile(path.join(ROOT, "public/icon-192.png"));
  await sharp(fav).resize(180, 180, { fit: "contain", background: "#0a1628" }).png().toFile(path.join(ROOT, "public/apple-touch-icon.png"));
  await sharp(fav).resize(48, 48, { fit: "contain", background: "#0a1628" }).png().toFile(path.join(ROOT, "public/favicon.png"));
  console.log(`  ✓ favicons (${favRaw ? "real" : "placeholder"})`);

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  await fs.writeFile(CREDITS, credits.join("\n") + "\n");

  const missing = Object.entries(manifest).filter(([, v]) => v.source !== "real").map(([k]) => k);
  console.log(missing.length ? `\nDone. Not real yet: ${missing.join(", ")}` : "\nDone. All images are real and optimised.");
}

main().catch((e) => { console.error(e); process.exit(1); });
