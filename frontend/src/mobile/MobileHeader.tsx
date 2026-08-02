import React, { useState } from "react";
import {
  Menu, Search, Bell, Sparkles, Plus, User, Building2, ChevronDown, Check,
} from "lucide-react";
import { useMobile } from "./useMobile";

interface MobileHeaderProps {
  tenantName?: string;
  unreadNotificationsCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  tenantName = "NITS Campus Main",
  unreadNotificationsCount = 3,
}) => {
  const { toggleDrawer, openSearch, openAICopilot, openQuickCreate } = useMobile();
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [activeTenant, setActiveTenant] = useState(tenantName);

  const TENANTS = ["NITS Campus Main", "NITS Engineering Wing", "NITS Management Inst."];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2 text-xs font-sans select-none">
      {/* Left: Drawer Toggle & Tenant Badge */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleDrawer}
          aria-label="Open Navigation Drawer"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all max-w-[140px] sm:max-w-[200px]"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-bold text-slate-200 text-[11px] truncate">{activeTenant}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
          </button>

          {showTenantMenu && (
            <div className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1 font-sans">
              <p className="px-3 py-1.5 text-[9px] font-bold text-slate-500 uppercase font-mono border-b border-slate-800">
                Switch Institution Tenant
              </p>
              {TENANTS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTenant(t);
                    setShowTenantMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-slate-200 hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="truncate">{t}</span>
                  {activeTenant === t && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions (Search, AI, Quick Create, Notifications, Profile) */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Global Search */}
        <button
          onClick={openSearch}
          aria-label="Open Global Search"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 hover:bg-slate-700 active:scale-95 transition-all text-slate-300"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Copilot Shortcut */}
        <button
          onClick={openAICopilot}
          aria-label="Open AI Copilot"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 hover:bg-indigo-900 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Quick Create */}
        <button
          onClick={openQuickCreate}
          aria-label="Quick Action"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all font-bold"
        >
          <Plus className="w-4.5 h-4.5" />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 hover:bg-slate-700 active:scale-95 transition-all text-slate-300"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold font-mono rounded-full flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-300" />
          </div>
        </div>
      </div>
    </header>
  );
};
