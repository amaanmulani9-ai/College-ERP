import React, { useState } from "react";
import {
  CheckSquare, StickyNote, Bookmark, Calendar, Bell,
  Activity, Star, Zap, LayoutTemplate, Clipboard,
  ChevronRight, X, Sparkles,
} from "lucide-react";
import { WorkspaceTasks } from "./WorkspaceTasks";
import { WorkspaceNotes } from "./WorkspaceNotes";
import { WorkspaceBookmarks } from "./WorkspaceBookmarks";
import { WorkspaceCalendar } from "./WorkspaceCalendar";
import { WorkspaceReminders } from "./WorkspaceReminders";
import { WorkspaceActivityFeed } from "./WorkspaceActivityFeed";
import { WorkspaceNotifications } from "./WorkspaceNotifications";
import { WorkspaceFavorites, WorkspaceShortcuts, WorkspaceClipboard, WorkspaceTemplates } from "./WorkspaceWidgets";

type HubTab =
  | "tasks" | "notes" | "bookmarks" | "calendar"
  | "reminders" | "activity" | "notifications" | "favorites"
  | "shortcuts" | "templates";

interface TabDefinition {
  id: HubTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

const TABS: TabDefinition[] = [
  { id: "tasks",         label: "Tasks",         icon: CheckSquare },
  { id: "notes",         label: "Notes",         icon: StickyNote  },
  { id: "notifications", label: "Alerts",         icon: Bell,   badge: 4 },
  { id: "calendar",      label: "Calendar",      icon: Calendar    },
  { id: "reminders",     label: "Reminders",     icon: Bell        },
  { id: "bookmarks",     label: "Bookmarks",     icon: Bookmark    },
  { id: "activity",      label: "Activity",      icon: Activity    },
  { id: "favorites",     label: "Favorites",     icon: Star        },
  { id: "shortcuts",     label: "Shortcuts",     icon: Zap         },
  { id: "templates",     label: "Templates",     icon: LayoutTemplate },
];

const TAB_CONTENT: Record<HubTab, React.FC> = {
  tasks:         WorkspaceTasks,
  notes:         WorkspaceNotes,
  bookmarks:     WorkspaceBookmarks,
  calendar:      WorkspaceCalendar,
  reminders:     WorkspaceReminders,
  activity:      WorkspaceActivityFeed,
  notifications: WorkspaceNotifications,
  favorites:     WorkspaceFavorites,
  shortcuts:     WorkspaceShortcuts,
  templates:     WorkspaceTemplates,
};

interface WorkspaceProductivityHubProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const WorkspaceProductivityHub: React.FC<WorkspaceProductivityHubProps> = ({
  isOpen = true,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>("tasks");

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex flex-col items-center gap-2 py-3 px-2 bg-slate-900 border-l border-slate-800 text-slate-400 hover:text-white transition-colors"
        title="Open Productivity Hub"
        aria-label="Open Productivity Hub"
      >
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Hub
        </span>
      </button>
    );
  }

  const ActiveComponent = TAB_CONTENT[activeTab];

  return (
    <div
      className="flex flex-col bg-slate-900 border-l border-slate-800 overflow-hidden"
      style={{ width: 320, flexShrink: 0 }}
      role="complementary"
      aria-label="Productivity Hub"
    >
      {/* Hub Header */}
      <div className="h-10 flex-shrink-0 flex items-center justify-between px-3 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Productivity Hub</span>
        </div>
        {onToggle && (
          <button onClick={onToggle}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Productivity Hub">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab Strip — scrollable icon bar */}
      <div className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-800 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={tab.label}
              aria-label={tab.label}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-bold leading-none">{tab.label.slice(0, 5)}</span>
              {tab.badge && !isActive && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 overflow-hidden p-3">
        <ActiveComponent />
      </div>
    </div>
  );
};
