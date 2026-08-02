import React, { useState, useEffect } from "react";
import { Download, WifiOff, X, CheckCircle2, Smartphone } from "lucide-react";

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleOnline  = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
      setShowBanner(false);
    } else {
      alert("PWA Installation: To install, tap 'Add to Home Screen' in your browser menu.");
    }
  };

  return (
    <div className="space-y-2 text-xs font-sans">
      {/* Offline Alert Indicator */}
      {isOffline && (
        <div role="alert" aria-live="assertive" className="flex items-center gap-2.5 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300">
          <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="flex-1 text-[11px]">
            <span className="font-bold">You are offline.</span>
            <span className="text-rose-400/80 ml-1">Cached ERP data is available.</span>
          </div>
        </div>
      )}

      {/* PWA Install Banner */}
      {showBanner && !installed && (
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-800/80 rounded-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-mono text-xs">
              PWA
            </div>
            <div>
              <p className="font-bold text-slate-100 text-[11px]">Install NITS ERP App</p>
              <p className="text-[9px] text-indigo-300/80">Add to home screen for offline access</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={triggerInstall}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Install
            </button>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Dismiss banner"
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
