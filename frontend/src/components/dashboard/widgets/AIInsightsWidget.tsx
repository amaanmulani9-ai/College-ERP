import React from "react";
import { Sparkles, Brain, TrendingDown, AlertTriangle, BarChart, Users, Lock } from "lucide-react";

const AI_CARDS = [
  {
    title: "AI Attendance Predictor",
    desc: "Machine learning model to predict students at risk of falling below 75% attendance based on historical patterns.",
    icon: <Users className="w-5 h-5 text-indigo-400" />,
    accent: "border-indigo-800/50 bg-indigo-950/30",
  },
  {
    title: "Fee Default Risk Scoring",
    desc: "Intelligent risk scoring to identify students likely to default on upcoming fee payments before due dates.",
    icon: <TrendingDown className="w-5 h-5 text-amber-400" />,
    accent: "border-amber-800/50 bg-amber-950/30",
  },
  {
    title: "Student Academic Risk Alerts",
    desc: "Early warning system for students showing declining performance trends across multiple subjects.",
    icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
    accent: "border-red-800/50 bg-red-950/30",
  },
  {
    title: "Institutional Trend Intelligence",
    desc: "AI-powered trend analysis across admissions, retention, and graduation metrics with predictive forecasting.",
    icon: <BarChart className="w-5 h-5 text-emerald-400" />,
    accent: "border-emerald-800/50 bg-emerald-950/30",
  },
];

export const AIInsightsWidget: React.FC = () => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" /> AI-Powered Institutional Intelligence
        </h3>
        <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Gemini AI Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AI_CARDS.map((card, i) => (
          <div key={i} className={`p-4 rounded-2xl border space-y-3 ${card.accent}`}>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                {card.icon}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-slate-400 text-[10px] font-mono font-bold flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Coming Soon
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-snug">{card.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 text-center border-t border-slate-800 pt-4">
        AI features require Gemini API integration • All analytics are privacy-compliant & FERPA-ready
      </p>
    </div>
  );
};
