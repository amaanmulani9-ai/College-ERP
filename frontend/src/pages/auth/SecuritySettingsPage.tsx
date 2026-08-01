import React from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "../../components/public/SEOHead";
import { Shield, KeyRound, Monitor, Lock, Smartphone, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-100 font-sans">
      <SEOHead title="Security Settings" description="Manage your institutional account security, active sessions, and password policies." />

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Shield className="w-8 h-8 text-emerald-400" /> Account Security Center
        </h1>
        <p className="text-xs text-slate-400">
          Configure multi-factor authentication, view active browser sessions, and inspect your login activity audit log.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device & Current Session Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Current Active Session</h3>
              <p className="text-[11px] text-slate-400">Windows Desktop — Chrome Browser</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">IP Address:</span>
              <span className="font-mono text-white">192.168.1.100 (Internal)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Last Authentication:</span>
              <span className="font-mono text-emerald-400">Just Now</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">JWT Token Expiry:</span>
              <span className="font-mono text-indigo-400">Auto Refresh Active</span>
            </div>
          </div>

          <Link
            to="/sessions"
            className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Manage Active Sessions
          </Link>
        </div>

        {/* Password & Security Actions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Password & Authentication</h3>
              <p className="text-[11px] text-slate-400">Manage password and security credentials</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Password Status:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Compliant
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Account Role:</span>
              <span className="font-mono text-indigo-300">{user?.role || "College Admin"}</span>
            </div>
          </div>

          <Link
            to="/change-password"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            Change Account Password
          </Link>
        </div>
      </div>

      {/* Login History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" /> Recent Authentication Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Event</th>
                <th className="pb-3 font-semibold">Device / OS</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 font-mono text-slate-400">2026-08-01 16:10:00</td>
                <td className="py-3 font-semibold text-white">Login Successful</td>
                <td className="py-3">Chrome / Windows 11</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">SUCCESS</span></td>
              </tr>
              <tr>
                <td className="py-3 font-mono text-slate-400">2026-08-01 10:15:22</td>
                <td className="py-3 font-semibold text-white">Silent Token Refresh</td>
                <td className="py-3">Chrome / Windows 11</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-mono font-bold">RENEWED</span></td>
              </tr>
              <tr>
                <td className="py-3 font-mono text-slate-400">2026-07-31 18:42:00</td>
                <td className="py-3 font-semibold text-white">Login Successful</td>
                <td className="py-3">Safari / iOS 17</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">SUCCESS</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
