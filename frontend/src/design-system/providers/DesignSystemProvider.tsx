import React, { createContext, useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../tokens/colors";

// ─── Design System Context ─────────────────────────────────────────────────
export interface DesignSystemContextValue {
  /** Current resolved theme */
  theme: "light" | "dark";
  /** Semantic color tokens for current theme */
  semanticColors: typeof colors.dark;
  /** Whether user prefers reduced motion */
  reducedMotion: boolean;
}

const DesignSystemContext = createContext<DesignSystemContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────
export interface DesignSystemProviderProps {
  children: React.ReactNode;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const semanticColors = resolvedTheme === "dark" ? colors.dark : colors.light;

  return (
    <DesignSystemContext.Provider
      value={{ theme: resolvedTheme, semanticColors, reducedMotion }}
    >
      {children}
    </DesignSystemContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────
export const useDesignSystem = (): DesignSystemContextValue => {
  const ctx = useContext(DesignSystemContext);
  if (!ctx) throw new Error("useDesignSystem must be used inside <DesignSystemProvider>");
  return ctx;
};
