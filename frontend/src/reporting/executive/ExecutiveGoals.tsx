import React from "react";
import { Target, Award, TrendingUp } from "lucide-react";
import { ExecutiveGoalItem } from "./types";
import { MOCK_EXECUTIVE_GOALS } from "./mockExecutiveData";

interface ExecutiveGoalsProps {
  goals?: ExecutiveGoalItem[];
}

export const ExecutiveGoals: React.FC<ExecutiveGoalsProps> = ({
  goals = MOCK_EXECUTIVE_GOALS,
}) => {
  return (
    <div
      role="region"
      aria-label="Executive Strategic Goals & Targets"
      className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Institutional Goals & Target Achievement
          </h3>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 font-bold">
          2026 Strategy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                  {goal.department}
                </span>
                <h4 className="font-bold text-slate-200">{goal.title}</h4>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {goal.completionPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, goal.completionPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Actual: {goal.actualValue}</span>
              <span>Target: {goal.targetValue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
