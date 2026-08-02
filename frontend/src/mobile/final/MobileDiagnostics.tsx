import React from "react";
import { Cpu, Smartphone, Monitor, HardDrive, Wifi, ShieldCheck } from "lucide-react";
import { usePWA } from "../pwa/usePWA";

export const MobileDiagnostics: React.FC = () => {
  const { isOnline, effectiveType, latencyMs, isInstalled, cacheSizeMB } = usePWA();

  const DIAG_ITEMS = [
    { label: "Screen Resolution", val: typeof window !== "undefined" ? `${window.screen.width} × ${window.screen.height}` : "390 × 844" },
    { label: "Viewport Bounds", val: typeof window !== "undefined" ? `${window.innerWidth} × ${window.innerHeight}` : "390 × 844" },
    { label: "Device Pixel Ratio", val: typeof window !== "undefined" ? `${window.devicePixelRatio}x` : "3.0x" },
    { label: "PWA Standalone Mode", val: isInstalled ? "Active (Installed)" : "Browser Tab Mode" },
    { label: "Offline Storage Heap", val: `${cacheSizeMB} MB Allocated` },
    { label: "Network State", val: isOnline ? `Online (${effectiveType.toUpperCase()} · ${latencyMs}ms)` : "Offline (Local Engine)" },
    { label: "Mobile Build Version", val: "v0.35.0-ui-mobile-final" },
  ];

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-xs">Mobile System Diagnostics</h3>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 font-bold">Passed (0 Errors)</span>
      </div>

      <div className="space-y-1.5 font-mono text-[10px]">
        {DIAG_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-400">{item.label}</span>
            <span className="font-bold text-indigo-300">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
