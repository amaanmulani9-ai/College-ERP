import { useState, useEffect, useCallback, useRef } from "react";
import { breakpointsPx, type Breakpoint } from "../tokens/breakpoints";

// ─── useBreakpoint ──────────────────────────────────────────────────────────
/**
 * Returns the current active breakpoint name.
 * Usage: const bp = useBreakpoint(); if (bp === "mobile") { ... }
 */
export const useBreakpoint = (): Breakpoint => {
  const getBreakpoint = (): Breakpoint => {
    const w = window.innerWidth;
    if (w >= breakpointsPx.ultrawide) return "ultrawide";
    if (w >= breakpointsPx.desktop)   return "desktop";
    if (w >= breakpointsPx.laptopLG)  return "laptopLG";
    if (w >= breakpointsPx.laptop)    return "laptop";
    if (w >= breakpointsPx.tabletLG)  return "tabletLG";
    if (w >= breakpointsPx.tablet)    return "tablet";
    if (w >= breakpointsPx.mobileLG)  return "mobileLG";
    return "mobile";
  };

  const [bp, setBp] = useState<Breakpoint>(getBreakpoint);

  useEffect(() => {
    const handler = () => setBp(getBreakpoint());
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  return bp;
};

// ─── useMediaQuery ──────────────────────────────────────────────────────────
/**
 * Returns true when the given CSS media query matches.
 * Usage: const isMobile = useMediaQuery("(max-width: 640px)");
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
};

// ─── useIsMobile ────────────────────────────────────────────────────────────
export const useIsMobile = () => useMediaQuery(`(max-width: ${breakpointsPx.tablet - 1}px)`);
export const useIsTablet = () => useMediaQuery(`(min-width: ${breakpointsPx.tablet}px) and (max-width: ${breakpointsPx.laptop - 1}px)`);
export const useIsDesktop = () => useMediaQuery(`(min-width: ${breakpointsPx.laptop}px)`);

// ─── useReducedMotion ───────────────────────────────────────────────────────
/**
 * Returns true when the user prefers reduced motion.
 * Use to disable Framer Motion animations for accessibility.
 */
export const useReducedMotion = (): boolean =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

// ─── useClickOutside ────────────────────────────────────────────────────────
/**
 * Fires callback when a click occurs outside the ref element.
 * Used for dropdowns, modals, popovers.
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [callback]);

  return ref;
};

// ─── useKeyPress ────────────────────────────────────────────────────────────
/**
 * Fires callback on keydown for the given key.
 * Usage: useKeyPress("Escape", () => close());
 */
export const useKeyPress = (key: string, callback: (e: KeyboardEvent) => void, enabled = true) => {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) savedCallback.current(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, enabled]);
};

// ─── useLocalStorage ────────────────────────────────────────────────────────
/**
 * useState synced to localStorage.
 * Usage: const [val, setVal] = useLocalStorage("key", defaultValue);
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  }, [key]);

  return [storedValue, setValue];
};

// ─── useDebounce ────────────────────────────────────────────────────────────
/**
 * Debounces a value by the given delay.
 * Usage: const debounced = useDebounce(searchQuery, 300);
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// ─── useToggle ──────────────────────────────────────────────────────────────
/**
 * A simple boolean toggle hook.
 * Usage: const [isOpen, toggle, setIsOpen] = useToggle(false);
 */
export const useToggle = (
  initial = false
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState((s) => !s), []);
  return [state, toggle, setState];
};

// ─── useCopyToClipboard ─────────────────────────────────────────────────────
/**
 * Copies text to clipboard and returns copied state with auto-reset.
 * Usage: const [copied, copy] = useCopyToClipboard(2000);
 */
export const useCopyToClipboard = (resetAfterMs = 2000): [boolean, (text: string) => void] => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetAfterMs);
    } catch {
      setCopied(false);
    }
  }, [resetAfterMs]);

  return [copied, copy];
};
