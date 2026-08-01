import React from "react";
import { SEOHead } from "../../components/public/SEOHead";
import { WifiOff, RefreshCw } from "lucide-react";

export const OfflinePage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 max-w-2xl mx-auto space-y-6">
      <SEOHead title="You Are Offline" description="No internet connection detected." />

      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
        <WifiOff className="w-10 h-10 text-slate-400" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
          OFFLINE MODE ACTIVE
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          No Internet Connection
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Please check your network settings. Previously cached College ERP pages will remain accessible offline.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Connection
      </button>
    </div>
  );
};
