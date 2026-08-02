import React from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { RiskMatrixItem } from "./types";
import { MOCK_RISK_MATRIX } from "./mockExecutiveData";

interface ExecutiveRiskMatrixProps {
  items?: RiskMatrixItem[];
}

export const ExecutiveRiskMatrix: React.FC<ExecutiveRiskMatrixProps> = ({
  items = MOCK_RISK_MATRIX,
}) => {
  return (
    <div
      role="region"
      aria-label="Institutional Risk & Impact Matrix"
      className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Institutional Risk & Impact Heat Matrix
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-slate-950/90 border border-slate-800 rounded-xl"
          >
            <div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                {item.category}
              </span>
              <h4 className="font-bold text-slate-200">{item.title}</h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>Impact: {item.impact}</span>
                <span>•</span>
                <span>Probability: {item.probability}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-900">
                Risk Score: {item.riskScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
