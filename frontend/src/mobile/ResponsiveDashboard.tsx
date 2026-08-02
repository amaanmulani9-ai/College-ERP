import React, { useState } from "react";
import { Users, GraduationCap, DollarSign, Activity, TrendingUp, ChevronRight, RefreshCw } from "lucide-react";
import { useResponsive } from "./ResponsiveContext";

interface KpiItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const KPIS: KpiItem[] = [
  { id: "students", title: "Active Students", value: "12,450", change: "+4.2%", isPositive: true,  icon: Users,        color: "text-blue-400" },
  { id: "faculty",  title: "Faculty Staff",   value: "842",    change: "+1.1%", isPositive: true,  icon: GraduationCap,color: "text-purple-400" },
  { id: "fees",     title: "Fee Collection",  value: "₹1.84 Cr",change: "+12.8%",isPositive: true, icon: DollarSign,   color: "text-emerald-400" },
  { id: "health",   title: "System Health",   value: "99.98%", change: "Stable",isPositive: true,  icon: Activity,     color: "text-cyan-400" },
];

export const ResponsiveDashboard: React.FC = () => {
  const { device } = useResponsive();
  const [activeKpiSlide, setActiveKpiSlide] = useState(0);

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Mobile KPI Swipe Carousel / Stacked Grid */}
      {device.isPhone ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Key Metrics Carousel</span>
            <span className="text-[10px] font-mono text-slate-500">{activeKpiSlide + 1} / {KPIS.length}</span>
          </div>

          {/* Single Featured Slide with Swipe Indicators */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">
            {(() => {
              const kpi = KPIS[activeKpiSlide];
              const Icon = kpi.icon;
              return (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{kpi.title}</p>
                    <p className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{kpi.change} vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              );
            })()}

            {/* Slide Dot Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {KPIS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveKpiSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeKpiSlide === idx ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-700"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Tablet & Desktop Adaptive Grid */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{kpi.title}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <p className={`text-xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">{kpi.change}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Action Cards Grid */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-xs">Mobile Touch Actions</h3>
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-200 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Take Attendance", sub: "Scan QR / Manual", icon: "📋", color: "bg-blue-950/60 border-blue-800 text-blue-300" },
            { label: "Fee Receipt",     sub: "Collect Payment",  icon: "💳", color: "bg-emerald-950/60 border-emerald-800 text-emerald-300" },
            { label: "Hall Tickets",    sub: "Generate PDFs",    icon: "🎟️", color: "bg-purple-950/60 border-purple-800 text-purple-300" },
            { label: "AI Diagnostic",   sub: "Run Copilot Audit",icon: "⚡", color: "bg-indigo-950/60 border-indigo-800 text-indigo-300" },
          ].map((act) => (
            <button
              key={act.label}
              className={`p-3 border rounded-xl flex flex-col justify-between text-left transition-all active:scale-95 min-h-[72px] ${act.color}`}
            >
              <span className="text-xl mb-1">{act.icon}</span>
              <div>
                <p className="font-bold text-[11px] truncate">{act.label}</p>
                <p className="text-[9px] opacity-70 truncate font-mono">{act.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Chart Placeholder Card */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-200 text-xs">Monthly Admission Trend</p>
          <span className="text-[10px] font-mono text-slate-500">2026 Season</span>
        </div>
        <div className="h-32 bg-slate-950 border border-slate-800/80 rounded-xl flex items-end justify-between p-3 gap-2">
          {[40, 65, 80, 55, 90, 100, 85].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                className="w-full bg-indigo-600/80 hover:bg-indigo-500 rounded-t-md transition-all"
                style={{ height: `${val}%` }}
              />
              <span className="text-[8px] font-mono text-slate-500">M{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
