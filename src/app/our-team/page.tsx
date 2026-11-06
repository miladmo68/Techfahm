import type { Metadata } from "next";
import { Cta, PageHero } from "@/components/sections/home-sections";
import { WidePhoto } from "@/components/sections/detail";
import { Reveal, RevealLines } from "@/components/ui/motion";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our Team: IT Experts in Toronto",
  description:
    "Meet the Techfahm team: vetted IT experts across networking, support, cloud and security, helping Ontario businesses run better technology.",
  path: "/our-team/",
});

const steps = [
  { title: "Vetting", body: "Every candidate's technical skills and track record are checked before an interview." },
  { title: "Hiring", body: "We hire people who can explain technology clearly, not just fix it." },
  { title: "Onboarding", body: "New team members learn our processes and client systems before they work on them." },
];

const skills = ["Network engineering", "Help desk and end-user support", "Cloud platforms", "Cybersecurity", "Backup and recovery", "IT strategy"];

export default function TeamPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Our team" }]}
        title={["IT experts who care", "how your business does."]}
        lead="Our team is made up of IT specialists who are passionate about helping businesses succeed, with a range of skills that covers your whole setup."
        image="team"
        imageAlt="Team working together in a large office"
      />
      <section className="section bg-paper">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="text-center lg:col-span-5 lg:text-left">
            <RevealLines className="t-h2" lines={["How people join", "the team."]} />
            <p className="muted t-lead mx-auto mt-6 max-w-md lg:mx-0">A careful process means the person working on your systems is qualified to do it.</p>
          </div>
          <ol className="lg:col-span-7">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <li className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/10 py-8">
                  <span className="font-display text-2xl font-semibold text-signal">{i + 1}</span>
                  <div>
                    <h3 className="t-h3">{s.title}</h3>
                    <p className="muted mt-2">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section on-dark">
        <div className="container-x">
          <RevealLines className="t-h2 text-center text-white md:text-left" lines={["Specialties across", "the whole stack."]} />
          <ul className="mt-12 flex flex-wrap justify-center gap-3 md:justify-start">
            {skills.map((s) => (
              <li key={s} className="rounded-full border border-white/15 px-5 py-3 text-[1.02rem]">{s}</li>
            ))}
          </ul>
        </div>
      </section>
      <WidePhoto name="office-team" alt="Techfahm team meeting in an office" />
      <Cta />
      <JsonLd data={breadcrumbLd([{ name: "Our team", path: "/our-team/" }])} />
    </>
  );
}
