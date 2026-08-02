import React, { useState } from "react";
import {
  X, ChevronDown, ChevronRight, LayoutDashboard, Sliders, BarChart3,
  Settings, Shield, Users, GraduationCap, Building2, BookOpen, Sparkles, Star, LogOut,
} from "lucide-react";

interface CategoryGroup {
  id: string;
  title: string;
  items: { id: string; title: string; icon: React.ElementType; badge?: string }[];
}

const MODULE_GROUPS: CategoryGroup[] = [
  {
    id: "core",
    title: "Core Platform",
    items: [
      { id: "dash",     title: "Dashboard",       icon: LayoutDashboard },
      { id: "work",     title: "Workspace Hub",   icon: Sliders, badge: "UI-005" },
      { id: "reports",  title: "Reports & Chart", icon: BarChart3, badge: "UI-006" },
    ],
  },
  {
    id: "academics",
    title: "Academics & Campus",
    items: [
      { id: "students", title: "Students",        icon: Users },
      { id: "academics",title: "Academic Sessions",icon: GraduationCap },
      { id: "library",  title: "Library Catalog", icon: BookOpen },
      { id: "hostel",   title: "Hostel & Transport",icon: Building2 },
    ],
  },
  {
    id: "admin",
    title: "System & Administration",
    items: [
      { id: "security", title: "Security & IAM",   icon: Shield },
      { id: "settings", title: "Settings Hub",     icon: Settings, badge: "UI-007" },
      { id: "ai",       title: "AI Copilot Hub",   icon: Sparkles },
    ],
  },
];

export const MobileWorkspaceDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [expanded, setExpanded] = useState<string[]>(["core", "academics", "admin"]);

  if (!isOpen) return null;

  const toggleGroup = (groupId: string) => {
    setExpanded((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Workspace Module Drawer"
      className="fixed inset-0 z-50 flex animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Slide-out Drawer */}
      <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between z-10 shadow-2xl overflow-y-auto text-xs font-sans">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-mono text-sm">
              W
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Workspace Drawer</h3>
              <p className="text-[10px] text-slate-500 font-mono">Mobile Module Catalog</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsible Module Category Groups */}
        <div className="flex-1 p-3 space-y-3">
          {MODULE_GROUPS.map((group) => {
            const isExp = expanded.includes(group.id);
            return (
              <div key={group.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-3 bg-slate-950 font-bold text-slate-300 text-[11px]"
                >
                  <span>{group.title}</span>
                  {isExp ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {isExp && (
                  <div className="p-1 space-y-0.5 border-t border-slate-800/60">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={onClose}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="font-medium text-[11px]">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Logged in: Super Admin</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
