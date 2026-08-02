import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export const ReportingOfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-amber-950 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs font-sans flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 font-semibold">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span>Offline Mode Active — Viewing Cached Local Reports & Builder Drafts</span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Try Reconnecting</span>
      </button>
    </div>
  );
};

export const ReportingConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px]">
      {isOnline ? (
        <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          <Wifi className="w-3 h-3" />
          <span>Online Sync</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
          <WifiOff className="w-3 h-3" />
          <span>Offline Cached</span>
        </span>
      )}
    </div>
  );
};
