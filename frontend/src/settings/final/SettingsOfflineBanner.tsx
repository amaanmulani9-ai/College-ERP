import React, { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";

interface SettingsOfflineBannerProps {
  forceShow?: boolean;
}

export const SettingsOfflineBanner: React.FC<SettingsOfflineBannerProps> = ({ forceShow }) => {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOffline   = () => { setOffline(true);  setDismissed(false); };
    const handleOnline    = () => { setOffline(false); setDismissed(false); };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online",  handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online",  handleOnline);
    };
  }, []);

  const show = (offline || forceShow) && !dismissed;
  if (!show) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-center gap-3 px-4 py-3 bg-amber-950/80 border border-amber-700 rounded-xl text-xs animate-in slide-in-from-top-2"
    >
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div className="flex-1">
        <span className="font-bold text-amber-300">You are offline.</span>
        <span className="text-amber-400/80 ml-2">
          Settings are loaded from cache. Changes will sync when you reconnect.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline banner"
        className="p-1 text-amber-400 hover:text-amber-200 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
