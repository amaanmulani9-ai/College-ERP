/**
 * College ERP Design System — Utility Functions
 */

// ─── Class Name Merger ──────────────────────────────────────────────────────
/**
 * Merges class names, filtering falsy values.
 * Lightweight alternative to clsx/cn without extra dependencies.
 *
 * Usage: cx("base-class", condition && "conditional", undefined, "another")
 */
export const cx = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(" ");

// ─── Format Utilities ───────────────────────────────────────────────────────
/**
 * Formats a number as compact notation (e.g., 1234 → "1.2K")
 */
export const formatCompact = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

/**
 * Formats currency in Indian format (₹1,23,456.78)
 */
export const formatCurrency = (
  amount: number,
  currency = "INR",
  locale = "en-IN"
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * Formats a number as a percentage string
 */
export const formatPercent = (value: number, decimals = 1): string =>
  `${value.toFixed(decimals)}%`;

/**
 * Formats a date to a locale string (default: Indian English)
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" },
  locale = "en-IN"
): string => new Intl.DateTimeFormat(locale, options).format(new Date(date));

/**
 * Formats a date to relative time ("2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = then.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr  = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr  / 24);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(diffSec) < 60)   return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60)   return rtf.format(diffMin, "minute");
  if (Math.abs(diffHr)  < 24)   return rtf.format(diffHr,  "hour");
  return rtf.format(diffDay, "day");
};

// ─── String Utilities ────────────────────────────────────────────────────────
/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Converts a string to Title Case.
 */
export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, (txt) => capitalize(txt));

/**
 * Truncates a string to maxLength and appends ellipsis.
 */
export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;

/**
 * Generates initials from a full name (e.g., "John Doe" → "JD")
 */
export const getInitials = (name: string, maxChars = 2): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, maxChars);

/**
 * Slugifies a string for use in URLs or IDs.
 */
export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// ─── Color Utilities ─────────────────────────────────────────────────────────
/**
 * Returns consistent color based on a string (for avatars, tags, etc.)
 */
export const getStringColor = (str: string): string => {
  const colors = [
    "bg-indigo-500", "bg-purple-500", "bg-emerald-500",
    "bg-amber-500",  "bg-sky-500",    "bg-rose-500",
    "bg-cyan-500",   "bg-pink-500",   "bg-violet-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// ─── DOM Utilities ───────────────────────────────────────────────────────────
/**
 * Generates a unique element ID (for ARIA associations).
 */
let _idCounter = 0;
export const generateId = (prefix = "ds"): string =>
  `${prefix}-${++_idCounter}`;

/**
 * Scrolls an element into view smoothly.
 */
export const scrollIntoView = (el: HTMLElement | null, block: ScrollLogicalPosition = "nearest") => {
  el?.scrollIntoView({ behavior: "smooth", block });
};

// ─── Array Utilities ─────────────────────────────────────────────────────────
/**
 * Groups an array of objects by a key.
 */
export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> =>
  arr.reduce((acc, item) => {
    const group = String(item[key]);
    return { ...acc, [group]: [...(acc[group] ?? []), item] };
  }, {} as Record<string, T[]>);

/**
 * Removes duplicates from an array.
 */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

/**
 * Sorts an array of objects by a key ascending.
 */
export const sortBy = <T>(arr: T[], key: keyof T, dir: "asc" | "desc" = "asc"): T[] =>
  [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === "asc" ? -1 : 1;
    if (a[key] > b[key]) return dir === "asc" ? 1 : -1;
    return 0;
  });
