import React from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../../components/auth/AuthCard";
import { SEOHead } from "../../components/public/SEOHead";
import { Building, ArrowLeft, Send } from "lucide-react";

export const RegisterPage: React.FC = () => {
  return (
    <AuthCard>
      <SEOHead title="Register Tenant Institution" description="Provision a new institutional tenant schema on College ERP." />

      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center mx-auto text-indigo-400">
          <Building className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Register Institution</h2>
        <p className="text-xs text-slate-400">Provision a new schema-isolated tenant for your college or university</p>
      </div>

      <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-indigo-200 text-xs mb-4">
        <span>To request an automated tenant provisioning demo, please submit your college details or schedule a guided setup session.</span>
      </div>

      <div className="space-y-3">
        <Link
          to="/demo"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Request Institutional Tenant Sandbox
        </Link>

        <Link
          to="/login"
          className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </AuthCard>
  );
};
