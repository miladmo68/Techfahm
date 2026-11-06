/** Prefix for public assets when the site runs under a sub-path (GitHub Pages preview). Empty on techfahm.com. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE_PATH}${p}`;
