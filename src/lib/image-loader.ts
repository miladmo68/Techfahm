/**
 * Custom next/image loader for static export.
 * `src` is "/images/<name>.jpg" (the logical image). The pipeline in
 * scripts/images.mjs writes "/images/<name>-<width>.webp" for each width.
 */
const WIDTHS = [240, 480, 828, 1200, 1920];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!src.startsWith("/images/") || src.endsWith(".svg")) return `${base}${src}`;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  const name = src.replace(/\.(jpe?g|png|webp|avif)$/i, "");
  return `${base}${name}-${w}.webp`;
}
