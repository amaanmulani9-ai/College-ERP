import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  User,
  Building,
  Calendar,
  Grid,
  ChevronRight,
  Sparkles,
  LogOut,
  Settings,
} from "lucide-react";
import { useWorkspace } from "./WorkspaceContext";

export const WorkspaceHeader: React.FC = () => {
  const { setIsSearchOpen, setIsQuickLauncherOpen } = useWorkspace();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-30 relative">
      {/* Left: Breadcrumb & Workspace Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsQuickLauncherOpen(true)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50"
          title="Quick Launcher (Ctrl+J)"
        >
          <Grid className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-white tracking-wide">Enterprise ERP</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-indigo-400 font-semibold">Workspace Console</span>
        </div>

        {/* Tenant & Academic Session Badges */}
        <div className="hidden lg:flex items-center gap-2 ml-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-[11px] font-semibold text-indigo-300">
            <Building className="w-3 h-3 text-indigo-400" />
            Springfield University
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-semibold text-emerald-300">
            <Calendar className="w-3 h-3 text-emerald-400" />
            AY 2025–26
          </span>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between transition-all group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            Search modules, students, staff, assets, AI...
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions, Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* AI Shortcut Button */}
        <a
          href="/ai"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Hub
        </a>

        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50"
            title="Quick Create"
          >
            <Plus className="w-4 h-4" />
          </button>

          {isQuickCreateOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 text-xs z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Action
              </div>
              <a href="/students" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                New Student Registration
              </a>
              <a href="/visitor" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                Register Gate Visitor
              </a>
              <a href="/fees" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                Record Fee Payment
              </a>
              <a href="/ai" className="block px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                Ask AI Assistant
              </a>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700/50"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-600/30">
              AD
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">Admin User</div>
              <div className="text-[10px] text-slate-400">Super Administrator</div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 text-xs z-50">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <div className="font-semibold text-white">System Admin</div>
                <div className="text-[10px] text-slate-400">admin@springfield.edu</div>
              </div>
              <a href="/profile/security" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Settings className="w-4 h-4 text-slate-400" />
                Account Settings
              </a>
              <a href="/logout" className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-slate-800">
                <LogOut className="w-4 h-4" />
                Sign Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
