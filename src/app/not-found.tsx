import Link from "next/link";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="on-dark grain relative flex min-h-[100svh] items-center pt-[var(--header-h)]">
      <div className="container-x py-20">
        <p className="font-mono text-sm text-signal">404</p>
        <h1 className="t-h1 mt-4 max-w-3xl text-white">This page isn&apos;t on our network.</h1>
        <p className="muted t-lead mt-6 max-w-xl">The address may have changed when we rebuilt the site. Try one of these instead.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/">Go to the homepage</Link></Button>
          <Button asChild size="lg" variant="outline" className="text-white"><Link href="/contact/">Contact us</Link></Button>
        </div>
        <ul className="mt-14 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}/`} className="text-white/75 hover:text-white">{s.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
