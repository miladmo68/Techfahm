import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Lower-case a title for use mid-sentence, keeping acronyms like "IT" intact. */
export const lowerTitle = (t: string) => t.replace(/[A-Za-z]+/g, (w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()));
