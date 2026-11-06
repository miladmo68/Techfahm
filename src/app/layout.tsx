import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/schibsted-grotesk";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/layout/cursor";
import { ScrollProgress } from "@/components/ui/motion";
import { site } from "@/content/site";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";

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
    icon: [{ url: "/favicon.png", sizes: "48x48", type: "image/png" }, { url: "/icon-192.png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
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
        </Providers>
        <JsonLd data={[organizationLd, websiteLd]} />
      </body>
    </html>
  );
}
