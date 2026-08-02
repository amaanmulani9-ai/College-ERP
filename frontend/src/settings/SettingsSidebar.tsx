import React, { useState } from "react";
import { useSettings } from "./SettingsContext";
import { SettingCategory } from "./types";
import {
  Sliders,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Pin,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  Lock,
  ShieldAlert,
  Bell,
  DollarSign,
  CreditCard,
  FileSpreadsheet,
  BookOpen,
  Home,
  Bus,
  Boxes,
  ShoppingCart,
  QrCode,
  UserCheck,
  Briefcase,
  Heart,
  UserPlus,
  Sparkles,
  Palette,
  Plug,
  Server,
  History,
  Database,
  Grid,
} from "lucide-react";

export const SettingsSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { activeCategory, setActiveCategory, favoriteIds, pinnedIds, recentIds } = useSettings();

  const categoryGroups: { title: string; categories: { name: SettingCategory; icon: React.FC<{ className?: string }> }[] }[] = [
    {
      title: "Core Governance",
      categories: [
        { name: "General", icon: Sliders },
        { name: "Institution", icon: Building },
        { name: "Academic", icon: GraduationCap },
        { name: "Users", icon: Users },
        { name: "Roles & Permissions", icon: ShieldCheck },
        { name: "Authentication", icon: Lock },
        { name: "Security", icon: ShieldAlert },
        { name: "Notifications", icon: Bell },
      ],
    },
    {
      title: "Financial & HR",
      categories: [
        { name: "Finance", icon: DollarSign },
        { name: "Fees", icon: CreditCard },
        { name: "Payroll", icon: FileSpreadsheet },
        { name: "HR", icon: UserCheck },
        { name: "Procurement", icon: ShoppingCart },
        { name: "Assets", icon: QrCode },
        { name: "Inventory", icon: Boxes },
      ],
    },
    {
      title: "Campus Operations",
      categories: [
        { name: "Library", icon: BookOpen },
        { name: "Hostel", icon: Home },
        { name: "Transport", icon: Bus },
        { name: "Placement", icon: Briefcase },
        { name: "Alumni", icon: Heart },
        { name: "Visitor", icon: UserPlus },
      ],
    },
    {
      title: "Platform & Intelligence",
      categories: [
        { name: "AI", icon: Sparkles },
        { name: "Branding", icon: Palette },
        { name: "Integrations", icon: Plug },
        { name: "System", icon: Server },
        { name: "Audit Logs", icon: History },
        { name: "Backups", icon: Database },
      ],
    },
  ];

  return (
    <aside
      aria-label="Settings Category Sidebar"
      className={`relative flex flex-col bg-slate-900/90 border-r border-slate-800 transition-all duration-300 z-20 font-sans text-xs ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Settings Hub</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors mx-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Categories Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 font-medium">
        {/* Quick View Links */}
        <div className="space-y-0.5 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveCategory("All")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeCategory === "All"
                ? "bg-indigo-600 text-white font-bold shadow"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Grid className="w-4 h-4 shrink-0 text-indigo-400" />
              {!collapsed && <span>All Settings</span>}
            </div>
          </button>

          <button
            onClick={() => setActiveCategory("Favorites")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeCategory === "Favorites"
                ? "bg-amber-600 text-white font-bold shadow"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 shrink-0 text-amber-400" />
              {!collapsed && <span>Favorites</span>}
            </div>
            {!collapsed && favoriteIds.length > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded">
                {favoriteIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveCategory("Pinned")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeCategory === "Pinned"
                ? "bg-cyan-600 text-white font-bold shadow"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Pin className="w-4 h-4 shrink-0 text-cyan-400" />
              {!collapsed && <span>Pinned</span>}
            </div>
            {!collapsed && pinnedIds.length > 0 && (
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">
                {pinnedIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Grouped Categories */}
        {categoryGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.categories.map((cat) => {
                const IconComp = cat.icon;
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow"
                        : "text-slate-300 hover:bg-slate-800/80"
                    }`}
                    title={cat.name}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {!collapsed && <span className="truncate">{cat.name}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
