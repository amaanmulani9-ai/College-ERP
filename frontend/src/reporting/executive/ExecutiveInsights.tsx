import React from "react";
import { Sparkles, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";

interface ExecutiveInsightsProps {
  onRunReport?: () => void;
}

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ onRunReport }) => {
  return (
    <div className="p-5 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/60 rounded-xl shadow-xl mb-6 relative overflow-hidden text-xs font-sans">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>AI Copilot Executive Strategic Summary & Insights</span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Live Synthesis
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time cross-module anomaly detection and automated policy recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 font-medium">
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tuition Fee Recovery +10.9%</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Q3 fee collections surpassed target by $1.4M due to automated online payment gateway reminders.
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Civil Eng Attendance Spike (-12%)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            142 students in Civil Engineering Semester 4 fell below 75% threshold this week.
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scopus Publications Target 94.6%</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Faculty research output reached 142 papers, on track to achieve the annual 150 target.
          </p>
        </div>
      </div>

      {onRunReport && (
        <div className="flex justify-end pt-2 border-t border-slate-800/80">
          <button
            onClick={onRunReport}
            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white font-semibold transition-colors"
          >
            <span>Launch Deep Drill-Down Analytics Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
