import React from "react";
import {
  Sparkles,
  Users,
  BookOpen,
  DollarSign,
  Shield,
  Building,
  Bus,
  Award,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
  Pin,
  Star,
} from "lucide-react";
import { useWorkspace, WorkspaceModuleShortcut } from "./WorkspaceContext";
import { useTabs } from "./TabContext";

export const WorkspaceHomePage: React.FC = () => {
  const { pinnedModules, favoriteModules, recentModules } = useWorkspace();
  const { openTab } = useTabs();

  const handleLaunch = (mod: WorkspaceModuleShortcut) => {
    openTab({
      title: mod.name,
      route: mod.route,
      iconName: mod.iconName,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Multi-Workspace Framework Active
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome to Springfield Academic Console
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Multi-workspace operational interface with instant command search, multi-tab state persistence, integrated AI assistant, and real-time security telemetry.
          </p>
        </div>
      </div>

      {/* Grid: Continue Working & Pinned Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Continue Working Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            Continue Working
          </h3>
          <div className="space-y-2">
            {recentModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleLaunch(mod)}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between text-left transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {mod.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{mod.category}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Shortcuts */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Pin className="w-4 h-4 text-indigo-400" />
            Pinned Shortcuts
          </h3>
          <div className="space-y-2">
            {pinnedModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleLaunch(mod)}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between text-left transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {mod.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{mod.category}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Workspaces */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" />
            Favorite Workspaces
          </h3>
          <div className="space-y-2">
            {favoriteModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleLaunch(mod)}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between text-left transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {mod.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{mod.category}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
