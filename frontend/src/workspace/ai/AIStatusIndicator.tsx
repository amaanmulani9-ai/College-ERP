import React from "react";
import { Wifi, WifiOff, Database, RefreshCw, Sparkles } from "lucide-react";

interface AIStatusIndicatorProps {
  provider?: string;
  isOnline?: boolean;
  lastSync?: string;
  compact?: boolean;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  provider = "Placeholder (OpenAI-compatible)",
  isOnline = true,
  lastSync = "Just now",
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${
          isOnline
            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
            : "bg-slate-800 text-slate-400 border border-slate-700"
        }`}
        title={isOnline ? `AI Connected — ${provider}` : "AI Offline (placeholder mode)"}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
          }`}
        />
        {isOnline ? "AI Ready" : "Offline"}
      </div>
    );
  }

  return (
    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
      {/* Provider row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-white">AI Provider</span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isOnline
              ? "bg-emerald-600/20 text-emerald-300"
              : "bg-rose-600/20 text-rose-300"
          }`}
        >
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {isOnline ? "Connected" : "Offline"}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Provider</span>
          <span className="text-slate-300 font-mono text-[10px] truncate max-w-[160px]">{provider}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 flex items-center gap-1"><Database className="w-3 h-3" /> Knowledge Base</span>
          <span className="text-emerald-400 font-semibold text-[10px]">Synced</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Last Sync</span>
          <span className="text-slate-400 font-mono text-[10px]">{lastSync}</span>
        </div>
      </div>

      <div className="text-[10px] text-slate-600 border-t border-slate-800 pt-2">
        Plug in OpenAI, Gemini, Azure OpenAI or Ollama credentials in AI Provider settings.
      </div>
    </div>
  );
};
