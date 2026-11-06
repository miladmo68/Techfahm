import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/schibsted-grotesk";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/layout/cursor";
import { MobileCta } from "@/components/layout/mobile-cta";
import { ScrollProgress } from "@/components/ui/motion";
import { site } from "@/content/site";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import { asset, BASE_PATH } from "@/lib/base-path";

/** Preview builds (GitHub Pages) must not compete with techfahm.com in Google */
const isPreview = Boolean(BASE_PATH) || process.env.NEXT_PUBLIC_NOINDEX === "1";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Managed IT Services in Toronto, Hamilton & Waterloo | Techfahm",
    template: "%s | Techfahm",
  },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: true, email: true },
  icons: {
    icon: [
      { url: asset("/favicon.png"), sizes: "48x48", type: "image/png" },
      { url: asset("/icon-192.png"), sizes: "192x192", type: "image/png" },
    ],
    apple: asset("/apple-touch-icon.png"),
  },
  robots: isPreview
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      },
  // Paste the codes from Google Search Console / Bing Webmaster Tools into .env.local
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  other: { "geo.region": "CA-ON", "geo.placename": "Toronto" },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[90] rounded-full bg-signal px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <Cursor />
          <MobileCta />
        </Providers>
        <JsonLd data={[organizationLd, websiteLd]} />
      </body>
    </html>
  );
}
