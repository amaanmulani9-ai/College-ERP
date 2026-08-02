import React from "react";
import { ShieldCheck, TrendingUp, AlertTriangle, Target, Zap, DollarSign, Users, Award } from "lucide-react";

export const MobileExecutiveDashboard: React.FC = () => {
  return (
    <div className="space-y-4 font-sans text-xs select-none">
      {/* Executive Header Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-800/80 rounded-2xl space-y-1">
        <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Executive Governance Command Center</span>
        </div>
        <p className="text-[10px] text-purple-200/70">
          Cross-institutional metrics, strategic goals, risk indicators, and financial forecasts.
        </p>
      </div>

      {/* Cross-Module Executive Summary Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { title: "Annual Fee Collection", val: "₹18.4 Cr", sub: "92% of target", icon: DollarSign, color: "text-emerald-400" },
          { title: "Placement Conversion", val: "94.8%",    sub: "142 Drives",   icon: Award,      color: "text-purple-400" },
          { title: "Admissions Filled",     val: "98.2%",    sub: "Seat Matrix",  icon: Users,      color: "text-blue-400" },
          { title: "Research Output",       val: "148 Papers",sub: "Scopus Ranked",icon: Target,     color: "text-amber-400" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">{item.title}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className={`text-xl font-bold font-mono ${item.color}`}>{item.val}</p>
              <p className="text-[9px] text-slate-400 font-mono">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Strategic Goals Progress */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="font-bold text-slate-100 text-xs">Institutional Strategic Goals 2026</h3>
        <div className="space-y-2">
          {[
            { goal: "NBA Accreditation Readiness", progress: 92, color: "bg-emerald-500" },
            { goal: "Campus Digitalization & PWA", progress: 100, color: "bg-indigo-500" },
            { goal: "Faculty PhD Ratio Targets",    progress: 84, color: "bg-purple-500" },
          ].map((g) => (
            <div key={g.goal} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="font-medium text-slate-200">{g.goal}</span>
                <span className="font-bold font-mono text-indigo-400">{g.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${g.color} rounded-full`} style={{ width: `${g.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Risk Indicators */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-100 text-xs">Risk & Compliance Alerts</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-[10px] space-y-1">
          <p className="font-bold">Low Risk Warning</p>
          <p className="text-amber-200/80">3 Departments require updated syllabus approvals before next semester kickoff.</p>
        </div>
      </div>
    </div>
  );
};
