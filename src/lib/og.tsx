import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Branded Open Graph image (1200×630) generated at build time.
 * Uses the original photo from assets/raw when it exists.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/schibsted-grotesk/files");

async function photo(name?: string) {
  if (!name) return null;
  try {
    const buf = await readFile(join(process.cwd(), "assets/raw", `${name}.jpg`));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

async function logo() {
  try {
    const buf = await readFile(join(process.cwd(), "public/images/logo.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function ogImage({ title, kicker, image }: { title: string; kicker: string; image?: string }) {
  const [bold, regular, img, lg] = await Promise.all([
    readFile(join(fontDir, "schibsted-grotesk-latin-700-normal.woff")),
    readFile(join(fontDir, "schibsted-grotesk-latin-400-normal.woff")),
    photo(image),
    logo(),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a1628", fontFamily: "Schibsted" }}>
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" width={520} height={630} style={{ position: "absolute", right: 0, top: 0, width: 520, height: 630, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: img
              ? "linear-gradient(90deg, #0a1628 0%, #0a1628 52%, rgba(10,22,40,0.55) 72%, rgba(10,22,40,0.1) 100%)"
              : "radial-gradient(circle at 85% 20%, rgba(228,28,56,0.35), transparent 55%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 680 }}>
          {lg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lg} alt="" width={220} height={56} style={{ width: 220, height: 56, objectFit: "contain", objectPosition: "left", filter: "brightness(0) invert(1)" }} />
          ) : (
            <div style={{ display: "flex", color: "white", fontSize: 40, fontWeight: 700 }}>techfahm</div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#e41c38", fontSize: 28, fontWeight: 400, marginBottom: 18 }}>{kicker}</div>
            <div style={{ display: "flex", color: "white", fontSize: title.length > 40 ? 50 : title.length > 26 ? 58 : 68, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2 }}>
              {title}
            </div>
          </div>
          <div style={{ display: "flex", color: "#a9b6cc", fontSize: 24 }}>techfahm.com · Toronto · Hamilton · Waterloo</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Schibsted", data: bold, weight: 700, style: "normal" },
        { name: "Schibsted", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
