import React, { useRef, useEffect, ReactNode } from "react";
import { ACCESSIBILITY_TOKENS } from "./accessibilityTokens";

export const FocusTrap: React.FC<{ children: ReactNode; active?: boolean }> = ({
  children,
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusables = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];

    firstEl.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ACCESSIBILITY_TOKENS.keys.TAB) return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
};

export const FocusManager: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const KeyboardManager: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
