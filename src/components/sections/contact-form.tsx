"use client";

import { AnimatePresence, m } from "motion/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { BASE_PATH } from "@/lib/base-path";
import { EASE, cn } from "@/lib/utils";

/**
 * On techfahm.com the form posts to /contact.php (public/contact.php), which emails
 * info@techfahm.com. The GitHub Pages preview (BASE_PATH set) has no PHP, so there it
 * opens the visitor's email app with the message filled in.
 */
const HAS_MAILER = !BASE_PATH;

/** Bots submit instantly; people take a few seconds. Starts on first focus. */
function createFillTimer() {
  let start = 0;
  return {
    start: () => {
      if (!start) start = Date.now();
    },
    elapsed: () => (start ? Date.now() - start : 0),
    tooFast: () => !start || Date.now() - start < 3000,
  };
}

type Values = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  topic?: string;
  message: string;
  botcheck?: string;
};

// Validation rules (react-hook-form built-in, no extra library)
const rules = {
  name: {
    validate: (v: string) => (v.trim().length >= 2 && v.trim().length <= 100) || "Enter your name",
  },
  email: {
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Enter a valid email address" },
    required: "Enter a valid email address",
  },
  message: {
    minLength: { value: 10, message: "Tell us a little more (10 characters or more)" },
    maxLength: { value: 5000, message: "Keep it under 5,000 characters" },
    required: "Tell us a little more (10 characters or more)",
  },
};

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const timer = useMemo(() => createFillTimer(), []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ mode: "onSubmit" });

  async function onSubmit(v: Values) {
    if (v.botcheck) return;
    if (timer.tooFast()) {
      setState("error");
      return;
    }
    if (!HAS_MAILER) {
      const body = encodeURIComponent(
        `${v.message}\n\nName: ${v.name}\nCompany: ${v.company ?? ""}\nPhone: ${v.phone ?? ""}\nTopic: ${v.topic ?? ""}`,
      );
      window.location.assign(`mailto:${site.email}?subject=${encodeURIComponent("Consultation request")}&body=${body}`);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...v, elapsed: timer.elapsed() }),
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
              <input {...register("name", rules.name)} autoComplete="name" className={input(!!errors.name)} />
            </Field>
            <Field label="Work email" error={errors.email?.message}>
              <input {...register("email", rules.email)} type="email" autoComplete="email" inputMode="email" className={input(!!errors.email)} />
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
              <textarea {...register("message", rules.message)} rows={5} className={cn(input(!!errors.message), "h-auto resize-y py-3")} />
            </Field>
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("botcheck")} />
            <div className="flex flex-col-reverse gap-4 text-center sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="muted text-sm">
                Or call us at <a href={site.phoneHref} className="text-ink underline decoration-signal underline-offset-4">{site.phone}</a>.
              </p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === "sending"}>
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
