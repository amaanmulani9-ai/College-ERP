import React, { createContext, useContext } from "react";
import { SettingPageItem, SettingCategory, ViewMode } from "./types";

export interface SettingsContextType {
  pages: SettingPageItem[];
  activeCategory: SettingCategory | "All" | "Favorites" | "Recent" | "Pinned";
  setActiveCategory: (cat: SettingCategory | "All" | "Favorites" | "Recent" | "Pinned") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPage: SettingPageItem | null;
  setSelectedPage: (page: SettingPageItem | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  favoriteIds: string[];
  pinnedIds: string[];
  recentIds: string[];
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  markAsRecent: (id: string) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
