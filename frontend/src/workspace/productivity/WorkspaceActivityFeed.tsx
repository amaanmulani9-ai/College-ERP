import React from "react";
import { Clock, Compass, Search, Layers, Pin, ArrowRight } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "module" | "command" | "search" | "tab";
  label: string;
  detail?: string;
  route?: string;
  timestamp: number;
}

const sampleFeed: ActivityItem[] = [
  { id: "a1", type: "module",  label: "AI Academic Assistant",   detail: "/ai",          route: "/ai",          timestamp: Date.now() - 300000  },
  { id: "a2", type: "tab",     label: "Visitor Gate Passes",     detail: "Tab opened",   route: "/visitor",     timestamp: Date.now() - 900000  },
  { id: "a3", type: "search",  label: "\"overdue fees\"",        detail: "Search query",                        timestamp: Date.now() - 1800000 },
  { id: "a4", type: "command", label: "Create Student Registration", detail: "Quick action",                   timestamp: Date.now() - 3600000 },
  { id: "a5", type: "module",  label: "Placement & Careers",     detail: "/placement",   route: "/placement",   timestamp: Date.now() - 7200000 },
  { id: "a6", type: "search",  label: "\"hostel allotment\"",    detail: "Search query",                        timestamp: Date.now() - 10800000 },
  { id: "a7", type: "tab",     label: "Alumni Directory",        detail: "Tab opened",   route: "/alumni",      timestamp: Date.now() - 14400000 },
  { id: "a8", type: "module",  label: "Fee Management",          detail: "/fees",        route: "/fees",        timestamp: Date.now() - 18000000 },
];

const TYPE_ICONS = {
  module:  { icon: Compass,  color: "text-indigo-400 bg-indigo-600/10" },
  command: { icon: Layers,   color: "text-purple-400 bg-purple-600/10" },
  search:  { icon: Search,   color: "text-sky-400    bg-sky-600/10"    },
  tab:     { icon: Layers,   color: "text-emerald-400 bg-emerald-600/10" },
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export const WorkspaceActivityFeed: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
        <Clock className="w-3 h-3 text-indigo-400" /> Recent ERP Activity
      </div>
      <div className="flex-1 overflow-y-auto space-y-1">
        {sampleFeed.map((item) => {
          const { icon: Icon, color } = TYPE_ICONS[item.type];
          return (
            <div key={item.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/60 group transition-all cursor-pointer">
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${color}`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{item.label}</p>
                <p className="text-[10px] text-slate-500 capitalize">{item.type} · {timeAgo(item.timestamp)}</p>
              </div>
              {item.route && (
                <a href={item.route}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-indigo-400 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
