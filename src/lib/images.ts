import manifest from "./image-manifest.json";

type Entry = { width: number; height: number; blurDataURL: string; source: string };
const m = manifest as unknown as Record<string, Entry & { source: string }>;

export function img(name: string) {
  const e = m[name];
  if (!e) throw new Error(`Image "${name}" missing — add it to scripts/images.mjs and run npm run images`);
  return {
    src: `/images/${name}.jpg`,
    width: e.width,
    height: e.height,
    blurDataURL: e.blurDataURL,
  };
}

export const logo = (manifest as Record<string, { source: string; width?: number; height?: number }>).__logo;
