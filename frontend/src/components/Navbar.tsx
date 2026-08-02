import React from "react";
import { Bell, ShieldCheck, User } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Workspace Foundation Active
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          aria-label="System Notifications"
          className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-slate-200">System Admin</div>
            <div className="text-[10px] text-slate-400">Enterprise ERP</div>
          </div>
        </div>
      </div>
    </header>
  );
};
