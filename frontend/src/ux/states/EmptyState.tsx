import React, { ReactNode } from "react";
import { FolderOpen, Search, BellOff, FileSpreadsheet, Database, WifiOff, ShieldOff, Star, Clock, Activity } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => (
  <div className={`p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 font-sans select-none ${className}`}>
    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
      <Icon className="w-6 h-6" />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
      {description && <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition-all active:scale-95 shadow-md"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const NoSearchResults: React.FC<{ query?: string; onClear?: () => void }> = ({ query, onClear }) => (
  <EmptyState
    icon={Search}
    title="No Matching Results Found"
    description={query ? `No records matched "${query}". Check spelling or try resetting search filters.` : "Try typing a different keyword to search modules, students, or reports."}
    actionLabel={onClear ? "Clear Filters" : undefined}
    onAction={onClear}
  />
);

export const NoNotifications: React.FC = () => (
  <EmptyState
    icon={BellOff}
    title="No Unread Notifications"
    description="You're all caught up! High priority administrative notifications will appear here."
  />
);

export const NoReports: React.FC = () => (
  <EmptyState
    icon={FileSpreadsheet}
    title="No Reports Generated"
    description="Select a report template from the catalog to build and export institutional summaries."
  />
);

export const NoData: React.FC = () => (
  <EmptyState
    icon={Database}
    title="No Data Available"
    description="There are currently no records to display in this table view."
  />
);

export const NoInternet: React.FC = () => (
  <EmptyState
    icon={WifiOff}
    title="No Internet Connection"
    description="Working in offline PWA mode. Queued changes will auto-sync upon reconnection."
  />
);

export const NoPermissions: React.FC = () => (
  <EmptyState
    icon={ShieldOff}
    title="Access Restricted"
    description="Your account role does not have permission to view or manage this component."
  />
);

export const NoFavorites: React.FC = () => (
  <EmptyState
    icon={Star}
    title="No Pinned Favorites"
    description="Star your frequently used ERP modules to pin them here for fast 1-tap access."
  />
);

export const NoRecents: React.FC = () => (
  <EmptyState
    icon={Clock}
    title="No Recent Activity"
    description="Modules and workspaces you recently opened will appear here for continue-working shortcuts."
  />
);

export const NoActivity: React.FC = () => (
  <EmptyState
    icon={Activity}
    title="No Activity Logs"
    description="Real-time institutional log streams are currently quiet."
  />
);
