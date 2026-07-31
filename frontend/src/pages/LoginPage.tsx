import React from "react";
import { GraduationCap, Lock, Mail, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Enterprise College ERP</h2>
          <p className="text-xs text-slate-400">Login Placeholder (TASK-001)</p>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            This is a placeholder layout. Authentication logic and backend endpoints will be connected in subsequent tasks.
          </span>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                disabled
                placeholder="admin@college-erp.com"
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                disabled
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          <Link
            to="/"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
          >
            Return to Dashboard Placeholder
            <ArrowRight className="w-4 h-4" />
          </Link>
        </form>
      </div>
    </div>
  );
};
