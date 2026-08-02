import React from "react";
import { AlertOctagon, ServerOff, ShieldAlert, FileQuestion, LogOut, WifiOff, AlertCircle } from "lucide-react";

export interface ErrorStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  code?: string | number;
  retryLabel?: string;
  onRetry?: () => void;
  reloadLabel?: string;
  onReload?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon: Icon = AlertOctagon,
  title,
  description,
  code,
  retryLabel = "Retry Action",
  onRetry,
  reloadLabel = "Reload Workspace",
  onReload,
  className = "",
}) => (
  <div className={`p-6 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-center space-y-3 font-sans select-none ${className}`}>
    <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 mx-auto">
      <Icon className="w-6 h-6" />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      {code && <span className="text-[9px] font-mono font-bold text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-800">Error {code}</span>}
      <h4 className="font-bold text-slate-100 text-sm mt-1">{title}</h4>
      {description && <p className="text-[11px] text-rose-200/80 leading-relaxed">{description}</p>}
    </div>
    <div className="flex items-center justify-center gap-2 pt-1">
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition-all active:scale-95 shadow-md"
        >
          {retryLabel}
        </button>
      )}
      {onReload && (
        <button
          onClick={onReload}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-all active:scale-95"
        >
          {reloadLabel}
        </button>
      )}
    </div>
  </div>
);

export const APIError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState code="503" icon={ServerOff} title="API Service Unavailable" description="Could not connect to ERP backend server. Check server health." onRetry={onRetry} />
);

export const PermissionDenied: React.FC = () => (
  <ErrorState code="403" icon={ShieldAlert} title="Permission Denied" description="You do not have administrative privilege to access this module." />
);

export const NotFound404: React.FC<{ onHome?: () => void }> = ({ onHome }) => (
  <ErrorState code="404" icon={FileQuestion} title="Resource Not Found" description="The requested route or record could not be found." retryLabel="Back to Home" onRetry={onHome} />
);

export const InternalServerError: React.FC<{ onReload?: () => void }> = ({ onReload }) => (
  <ErrorState code="500" icon={AlertOctagon} title="Internal Server Error" description="An unexpected error occurred during execution." onReload={onReload} />
);

export const SessionExpired: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => (
  <ErrorState code="401" icon={LogOut} title="Session Expired" description="Your security token expired. Please re-authenticate." retryLabel="Sign In" onRetry={onLogin} />
);

export const OfflineError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState icon={WifiOff} title="Network Connection Lost" description="Operation requires internet connectivity. Please reconnect." onRetry={onRetry} />
);

export const ValidationError: React.FC<{ details?: string }> = ({ details }) => (
  <ErrorState icon={AlertCircle} title="Validation Failed" description={details || "Form contains invalid input values. Check highlighted fields."} />
);
