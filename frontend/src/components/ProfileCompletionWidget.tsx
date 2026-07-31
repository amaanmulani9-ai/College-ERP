import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface CompletionProps {
  completion?: {
    completion_percentage: number;
    is_complete: boolean;
    completed_count: number;
    total_fields: number;
    missing_fields: string[];
  };
}

export const ProfileCompletionWidget: React.FC<CompletionProps> = ({ completion }) => {
  if (!completion) return null;

  const { completion_percentage, is_complete, missing_fields } = completion;

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Profile Strength</h3>
        <span className="text-xs font-mono font-bold text-indigo-400">{completion_percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-500 ${
            is_complete ? "bg-emerald-500" : completion_percentage > 50 ? "bg-indigo-500" : "bg-amber-500"
          }`}
          style={{ width: `${completion_percentage}%` }}
        />
      </div>

      {is_complete ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>All required identity details are complete!</span>
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Missing required fields ({missing_fields.length}):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missing_fields.map((field) => (
              <span key={field} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                {field}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
