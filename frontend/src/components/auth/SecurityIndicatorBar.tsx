import React from "react";
import { Lock, ShieldCheck, Key, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const SecurityIndicatorBar: React.FC = () => {
  const { user, tenant, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Lock className="w-3 h-3" /> Secure TLS 1.3
        </span>
        <span className="flex items-center gap-1.5 text-indigo-400">
          <Key className="w-3 h-3" /> JWT Session Active
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Tenant: <strong className="text-white">{tenant || "Default"}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Role: <strong className="text-white">{user?.role || "Admin"}</strong>
        </span>
        <span className="text-slate-500">Schema Isolated</span>
      </div>
    </div>
  );
};
