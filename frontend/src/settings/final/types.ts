// ── Settings Final — Shared Types ─────────────────────────────────────────────

export type SettingsDensity = "compact" | "comfortable" | "spacious";
export type AnimationLevel  = "none" | "reduced" | "full";
export type ThemeMode       = "dark" | "light" | "system";
export type ConnectionState = "online" | "offline" | "reconnecting";

export interface SettingsPreferencesData {
  rememberLastPage:   boolean;
  rememberSearch:     boolean;
  rememberFilters:    boolean;
  defaultLanding:     string;
  density:            SettingsDensity;
  animationLevel:     AnimationLevel;
  language:           string;
  timezone:           string;
  favoriteCategories: string[];
  pinnedCategories:   string[];
}

export interface AppearanceConfig {
  theme:            ThemeMode;
  density:          SettingsDensity;
  animationLevel:   AnimationLevel;
  sidebarBehavior:  "fixed" | "collapsible" | "floating";
  accentColor:      string;
}

export interface AccessibilityConfig {
  reducedMotion:    boolean;
  highContrast:     boolean;
  fontScale:        number;  // 0.85 | 1 | 1.15 | 1.30
  keyboardFocus:    boolean;
  screenReaderHints: boolean;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  unit: string;
  status: "good" | "warn" | "poor";
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;   // CSS selector or section name
  emoji: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  tag: "new" | "improved" | "fixed" | "upcoming";
  items: string[];
}

export interface ExportBundle {
  version:     string;
  exportedAt:  string;
  preferences: SettingsPreferencesData;
  appearance:  AppearanceConfig;
  accessibility: AccessibilityConfig;
  favorites:   string[];
  pinned:      string[];
}
