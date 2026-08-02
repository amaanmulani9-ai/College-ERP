import React, { useState } from "react";
import { Sliders, Wifi, Smartphone, HardDrive, Bell } from "lucide-react";
import { usePWA } from "./usePWA";

export const PWASettings: React.FC = () => {
  const { autoSyncEnabled, setAutoSyncEnabled, wifiOnlySync, setWifiOnlySync, cacheSizeMB } = usePWA();
  const [downloadOverMobileData, setDownloadOverMobileData] = useState(true);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Sliders className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">PWA & Offline Preferences</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <p className="font-bold text-slate-200 text-[11px]">Download Over Mobile Data</p>
            <p className="text-[9px] text-slate-500 font-mono">Allow report downloads on cellular connections</p>
          </div>
          <button
            role="switch"
            aria-checked={downloadOverMobileData}
            onClick={() => setDownloadOverMobileData(!downloadOverMobileData)}
            className={`relative w-10 h-5 rounded-full transition-colors ${downloadOverMobileData ? "bg-indigo-600" : "bg-slate-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${downloadOverMobileData ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <p className="font-bold text-slate-200 text-[11px]">Wi-Fi Only Sync Policy</p>
            <p className="text-[9px] text-slate-500 font-mono">Pause background sync when using mobile data</p>
          </div>
          <button
            role="switch"
            aria-checked={wifiOnlySync}
            onClick={() => setWifiOnlySync(!wifiOnlySync)}
            className={`relative w-10 h-5 rounded-full transition-colors ${wifiOnlySync ? "bg-indigo-600" : "bg-slate-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${wifiOnlySync ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
