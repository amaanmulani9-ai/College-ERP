import React, { useState, useEffect } from "react";
import { SettingsContext } from "./SettingsContext";
import { SettingPageItem, SettingCategory, ViewMode } from "./types";
import { MOCK_SETTINGS_PAGES } from "./mockData";

const LOCAL_STORAGE_KEY = "college_erp_settings_state_v1";

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [pages] = useState<SettingPageItem[]>(MOCK_SETTINGS_PAGES);
  const [activeCategory, setActiveCategory] = useState<
    SettingCategory | "All" | "Favorites" | "Recent" | "Pinned"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<SettingPageItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    MOCK_SETTINGS_PAGES.filter((p) => p.isFavorite).map((p) => p.id)
  );
  const [pinnedIds, setPinnedIds] = useState<string[]>(
    MOCK_SETTINGS_PAGES.filter((p) => p.isPinned).map((p) => p.id)
  );
  const [recentIds, setRecentIds] = useState<string[]>(["set-usr-01", "set-role-01", "set-ai-01"]);

  // Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.favoriteIds) setFavoriteIds(parsed.favoriteIds);
        if (parsed.pinnedIds) setPinnedIds(parsed.pinnedIds);
        if (parsed.recentIds) setRecentIds(parsed.recentIds);
      }
    } catch (e) {
      console.error("Failed to load settings state from LocalStorage", e);
    }
  }, []);

  // Save state to LocalStorage
  const saveToStorage = (favs: string[], pins: string[], recents: string[]) => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ favoriteIds: favs, pinnedIds: pins, recentIds: recents })
      );
    } catch (e) {
      console.error("Failed to save settings state to LocalStorage", e);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      saveToStorage(next, pinnedIds, recentIds);
      return next;
    });
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      saveToStorage(favoriteIds, next, recentIds);
      return next;
    });
  };

  const markAsRecent = (id: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((i) => i !== id);
      const next = [id, ...filtered].slice(0, 10);
      saveToStorage(favoriteIds, pinnedIds, next);
      return next;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        pages,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedPage,
        setSelectedPage,
        viewMode,
        setViewMode,
        favoriteIds,
        pinnedIds,
        recentIds,
        toggleFavorite,
        togglePin,
        markAsRecent,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
