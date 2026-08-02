export type SettingCategory =
  | "General"
  | "Institution"
  | "Academic"
  | "Users"
  | "Roles & Permissions"
  | "Authentication"
  | "Security"
  | "Notifications"
  | "Finance"
  | "Fees"
  | "Payroll"
  | "Library"
  | "Hostel"
  | "Transport"
  | "Inventory"
  | "Procurement"
  | "Assets"
  | "HR"
  | "Placement"
  | "Alumni"
  | "Visitor"
  | "AI"
  | "Branding"
  | "Integrations"
  | "System"
  | "Audit Logs"
  | "Backups";

export interface SettingPageItem {
  id: string;
  code: string;
  title: string;
  category: SettingCategory;
  description: string;
  iconName: string;
  route: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  lastModified?: string;
  tags?: string[];
}

export type ViewMode = "grid" | "list";

export interface SettingsState {
  pages: SettingPageItem[];
  activeCategory: SettingCategory | "All" | "Favorites" | "Recent" | "Pinned";
  searchQuery: string;
  selectedPage: SettingPageItem | null;
  viewMode: ViewMode;
  favoriteIds: string[];
  pinnedIds: string[];
  recentIds: string[];
}
