import React, { useState } from "react";
import {
  UserCheck,
  Star,
  Pin,
  Dock,
  ExternalLink,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { ExecutiveRole } from "./types";

interface ExecutiveToolbarProps {
  activeRole: ExecutiveRole;
  onRoleChange: (role: ExecutiveRole) => void;
  onRefresh?: () => void;
  onOpenInWorkspace?: () => void;
}

const ROLES: ExecutiveRole[] = [
  "Super Admin",
  "Principal",
  "Vice Principal",
  "Registrar",
  "HOD",
  "Finance Officer",
  "HR Manager",
  "Library Admin",
  "Transport Manager",
  "Hostel Warden",
  "Placement Officer",
];

export const ExecutiveToolbar: React.FC<ExecutiveToolbarProps> = ({
  activeRole,
  onRoleChange,
  onRefresh,
  onOpenInWorkspace,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  return (
    <div
      role="toolbar"
      aria-label="Executive Toolbar Controls"
      className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl mb-6 text-xs shadow-md"
    >
      {/* Role Selection */}
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-slate-300">Executive Perspective:</span>
        <select
          value={activeRole}
          onChange={(e) => onRoleChange(e.target.value as ExecutiveRole)}
          className="bg-slate-950 border border-slate-700/80 text-indigo-300 font-bold rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r} View
            </option>
          ))}
        </select>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isFavorite
              ? "bg-amber-950/80 border-amber-700 text-amber-400"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title={isFavorite ? "Remove Favorite" : "Favorite Dashboard"}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isPinned
              ? "bg-indigo-950/80 border-indigo-700 text-indigo-400"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title={isPinned ? "Unpin Dashboard" : "Pin Dashboard"}
        >
          <Pin className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsDocked(!isDocked)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isDocked
              ? "bg-cyan-950/80 border-cyan-700 text-cyan-400"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="Dock Executive Console"
        >
          <Dock className="w-4 h-4" />
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {onOpenInWorkspace && (
          <button
            onClick={onOpenInWorkspace}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </button>
        )}
      </div>
    </div>
  );
};
