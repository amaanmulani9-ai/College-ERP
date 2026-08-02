import React from "react";
import { Award, ArrowUpDown } from "lucide-react";
import { ScorecardItem } from "./types";
import { MOCK_SCORECARDS } from "./mockExecutiveData";

interface ExecutiveScorecardsProps {
  scorecards?: ScorecardItem[];
}

export const ExecutiveScorecards: React.FC<ExecutiveScorecardsProps> = ({
  scorecards = MOCK_SCORECARDS,
}) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Institutional Balanced Scorecard Matrix
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Department</th>
              <th className="p-3">Key Metric Indicator</th>
              <th className="p-3">Actual Achieved</th>
              <th className="p-3">Target Objective</th>
              <th className="p-3">Variance</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {scorecards.map((sc) => (
              <tr key={sc.id} className="hover:bg-slate-850">
                <td className="p-3 font-semibold text-slate-200">{sc.department}</td>
                <td className="p-3 font-sans">{sc.metricName}</td>
                <td className="p-3 font-bold text-slate-100">{sc.actual}</td>
                <td className="p-3 text-slate-400">{sc.target}</td>
                <td className={`p-3 font-bold ${sc.variance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {sc.variance >= 0 ? `+${sc.variance}%` : `${sc.variance}%`}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sc.status === "excellent"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : sc.status === "good"
                        ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                        : "bg-rose-950 text-rose-300 border border-rose-800"
                    }`}
                  >
                    {sc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
