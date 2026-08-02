import React from "react";
import { Clock, Shield, CheckCircle, AlertTriangle, User } from "lucide-react";
import { StatusBadge, StatusVariant } from "./Status";

// ─── StatList ──────────────────────────────────────────────────────────────
export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface StatListProps {
  stats: StatItem[];
  className?: string;
}

export const StatList: React.FC<StatListProps> = ({ stats, className = "" }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-1"
        >
          <span className="text-[11px] font-semibold text-slate-400">{item.label}</span>
          <span className="text-xl font-extrabold text-white tracking-tight">{item.value}</span>
          {item.change && (
            <span
              className={`text-[10px] font-bold ${
                item.isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.change}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── InfoList & KeyValueGrid ───────────────────────────────────────────────
export interface KeyValuePair {
  key: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export interface KeyValueGridProps {
  items: KeyValuePair[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const KeyValueGrid: React.FC<KeyValueGridProps> = ({
  items,
  columns = 2,
  className = "",
}) => {
  const colClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${colClass} gap-4 ${className}`}>
      {items.map((item, idx) => (
        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            {item.icon}
            <span>{item.key}</span>
          </div>
          <div className="text-sm font-bold text-slate-100">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export const InfoList = KeyValueGrid;

// ─── Timeline / AuditTimeline / StatusTimeline ────────────────────────────
export interface TimelineEvent {
  title: string;
  timestamp: string;
  description?: string;
  actor?: string;
  status?: StatusVariant;
  icon?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = "" }) => {
  return (
    <div className={`space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800 ${className}`}>
      {events.map((event, idx) => (
        <div key={idx} className="relative flex items-start gap-4 pl-8">
          <div className="absolute left-1 top-1 w-5 h-5 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-indigo-400">
            {event.icon || <Clock className="w-3 h-3" />}
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white">{event.title}</span>
              <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
            </div>
            {event.description && (
              <p className="text-xs text-slate-400">{event.description}</p>
            )}
            {event.actor && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>{event.actor}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const AuditTimeline = Timeline;
export const StatusTimeline = Timeline;

// ─── ActivityTable ─────────────────────────────────────────────────────────
export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status: StatusVariant;
}

export interface ActivityTableProps {
  activities: ActivityItem[];
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
          <tr>
            <th className="p-3 font-semibold">User</th>
            <th className="p-3 font-semibold">Action</th>
            <th className="p-3 font-semibold">Target</th>
            <th className="p-3 font-semibold">Timestamp</th>
            <th className="p-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900 text-slate-200">
          {activities.map((act) => (
            <tr key={act.id} className="hover:bg-slate-900/50">
              <td className="p-3 font-semibold text-white">{act.user}</td>
              <td className="p-3">{act.action}</td>
              <td className="p-3 font-mono text-indigo-400">{act.target}</td>
              <td className="p-3 font-mono text-slate-400">{act.timestamp}</td>
              <td className="p-3">
                <StatusBadge label={act.status.toUpperCase()} variant={act.status} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
