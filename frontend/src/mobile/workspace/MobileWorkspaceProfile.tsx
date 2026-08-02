import React, { useState } from "react";
import { User, Shield, Key, Moon, Sun, Monitor, LogOut, Check, ChevronRight, Laptop } from "lucide-react";

export const MobileWorkspaceProfile: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [tenant, setTenant] = useState("NITS Campus Main");

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 font-sans text-xs select-none">
      {/* User Header */}
      <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shrink-0 shadow-lg">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-indigo-300 text-sm">
            AK
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-100 text-sm truncate">Amaan Khan</h3>
          <p className="text-[10px] text-slate-400 truncate">amaan.k@nits.edu</p>
          <span className="inline-block text-[9px] font-bold font-mono text-indigo-400 bg-indigo-950 px-2 py-0.2 rounded border border-indigo-800 uppercase mt-1">
            Super Administrator
          </span>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold font-mono text-slate-400 uppercase">Theme Preference</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "dark",   label: "Dark",   icon: Moon },
            { id: "light",  label: "Light",  icon: Sun },
            { id: "system", label: "System", icon: Monitor },
          ].map((t) => {
            const Icon = t.icon;
            const isAct = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                  isAct
                    ? "bg-indigo-600 text-white border-indigo-500 font-bold"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Sessions */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold font-mono text-slate-400 uppercase">Security & Active Sessions</p>
        <div className="space-y-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
          <div className="flex items-center justify-between p-2.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="font-medium text-[11px] text-slate-200">Change Password & MFA</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </div>

          <div className="flex items-center justify-between p-2.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-medium text-[11px] text-slate-200">Active Mobile Session</p>
                <p className="text-[9px] text-slate-500 font-mono">Chrome Mobile · 192.168.1.45</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-400 font-mono">Active Now</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={() => alert("Logged out successfully.")}
        className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-[11px]"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of Workspace</span>
      </button>
    </div>
  );
};
