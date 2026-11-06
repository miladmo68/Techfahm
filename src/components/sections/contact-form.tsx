"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { EASE, cn } from "@/lib/utils";

/**
 * Static-hosting friendly form: posts straight to Web3Forms (free).
 * Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local before building.
 * Without a key, it opens the visitor's email app with the message filled in.
 */
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

/** Bots submit instantly; people take a few seconds. Starts on first focus. */
function createFillTimer() {
  let start = 0;
  return {
    start: () => {
      if (!start) start = Date.now();
    },
    tooFast: () => !start || Date.now() - start < 3000,
  };
}

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.email("Enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  topic: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (10 characters or more)").max(5000, "Keep it under 5,000 characters"),
  botcheck: z.string().max(0).optional(),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const timer = useMemo(() => createFillTimer(), []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(v: Values) {
    if (v.botcheck) return;
    if (timer.tooFast()) {
      setState("error");
      return;
    }
    if (!KEY) {
      const body = encodeURIComponent(
        `${v.message}\n\nName: ${v.name}\nCompany: ${v.company ?? ""}\nPhone: ${v.phone ?? ""}\nTopic: ${v.topic ?? ""}`,
      );
      window.location.assign(`mailto:${site.email}?subject=${encodeURIComponent("Consultation request")}&body=${body}`);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KEY,
          subject: `New consultation request from ${v.name}`,
          from_name: "techfahm.com",
          ...v,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setState("sent");
      reset();
    } catch {
      setState("error");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === "sent" ? (
          <m.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            role="status"
            className="rounded-[1.5rem] bg-ink p-10 text-white"
          >
            <span className="grid size-12 place-items-center rounded-full bg-pulse/15 text-pulse">
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="t-h3 mt-6">Message sent</h2>
            <p className="muted mt-2">Thanks. We&apos;ll get back to you by email soon.</p>
            <Button variant="outline" className="mt-8 text-white" onClick={() => setState("idle")}>
              Send another message
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            onFocus={timer.start}
            noValidate
            className="grid gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:grid-cols-2 sm:p-9"
          >
            <Field label="Name" error={errors.name?.message}>
              <input {...register("name")} autoComplete="name" className={input(!!errors.name)} />
            </Field>
            <Field label="Work email" error={errors.email?.message}>
              <input {...register("email")} type="email" autoComplete="email" inputMode="email" className={input(!!errors.email)} />
            </Field>
            <Field label="Company" optional>
              <input {...register("company")} autoComplete="organization" className={input(false)} />
            </Field>
            <Field label="Phone" optional>
              <input {...register("phone")} type="tel" autoComplete="tel" inputMode="tel" className={input(false)} />
            </Field>
            <Field label="What do you need help with?" optional className="sm:col-span-2">
              <select {...register("topic")} className={cn(input(false), "appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%235d6b82' stroke-width='1.6'/%3E%3C/svg%3E\")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")} defaultValue="">
                <option value="">Not sure yet</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title}>{s.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Message" error={errors.message?.message} className="sm:col-span-2">
              <textarea {...register("message")} rows={5} className={cn(input(!!errors.message), "h-auto resize-y py-3")} />
            </Field>
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("botcheck")} />
            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="muted text-sm">Or call us at {site.phone}.</p>
              <Button type="submit" size="lg" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send message"}
              </Button>
            </div>
            {state === "error" && (
              <p role="alert" className="text-sm text-signal sm:col-span-2">
                The message didn&apos;t send. Check your connection and try again, or email {site.email}.
              </p>
            )}
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const input = (err: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-paper px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-signal focus:ring-4 focus:ring-signal/15",
    err ? "border-signal" : "border-ink/12",
  );

function Field({
  label,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium">
        {label}
        {optional && <span className="muted font-normal"> (optional)</span>}
      </span>
      {children}
      {error && <span className="text-sm text-signal">{error}</span>}
    </label>
  );
}
