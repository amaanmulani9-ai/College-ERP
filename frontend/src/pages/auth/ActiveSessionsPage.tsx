import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "../../components/public/SEOHead";
import { Monitor, Smartphone, Globe, LogOut, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const ActiveSessionsPage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([
    { id: "1", device: "Chrome on Windows 11", ip: "192.168.1.100", isCurrent: true, lastActive: "Just now" },
    { id: "2", device: "Safari on iPhone 15 Pro", ip: "10.0.0.45", isCurrent: false, lastActive: "2 hours ago" },
    { id: "3", device: "Firefox on macOS Sonoma", ip: "172.16.0.12", isCurrent: false, lastActive: " Yesterday at 18:20" },
  ]);

  const terminateOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-100 font-sans">
      <SEOHead title="Active User Sessions" description="Manage active browser and mobile device sessions." />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Monitor className="w-8 h-8 text-purple-400" /> Active Session Monitor
          </h1>
          <p className="text-xs text-slate-400">
            View all browser devices currently authenticated under your institutional account ({user?.email})
          </p>
        </div>

        <button
          onClick={terminateOtherSessions}
          className="py-2.5 px-4 bg-red-950/80 border border-red-800 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Terminate All Other Sessions
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              s.isCurrent ? "bg-indigo-950/40 border-indigo-500/40" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.isCurrent ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "bg-slate-800 text-slate-400"}`}>
                {s.device.includes("iPhone") ? <Smartphone className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{s.device}</h4>
                  {s.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> CURRENT DEVICE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  IP: <span className="font-mono">{s.ip}</span> • Last active {s.lastActive}
                </p>
              </div>
            </div>

            {!s.isCurrent && (
              <button
                onClick={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Revoke Session
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Link
          to="/profile/security"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Security Settings
        </Link>
      </div>
    </div>
  );
};
