import React from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../../components/auth/AuthCard";
import { SEOHead } from "../../components/public/SEOHead";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export const AccessDeniedPage: React.FC = () => {
  return (
    <AuthCard>
      <SEOHead title="403 - Access Denied" description="You do not have permission to view this resource." />

      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto shadow-xl">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
            HTTP 403 FORBIDDEN
          </span>
          <h2 className="text-2xl font-extrabold text-white pt-2">Access Denied</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your current RBAC user role does not possess permission to access this module or viewset.
          </p>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Insufficient Role Clearance
          </div>
          <p className="text-[11px]">Contact your Institutional Administrator or Registrar to request upgraded permissions.</p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            to="/dashboard"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Return to Authorized Dashboard
          </Link>
          <Link
            to="/login"
            className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Re-authenticate Account
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};
