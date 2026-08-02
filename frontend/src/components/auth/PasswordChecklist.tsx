import React from "react";
import { Check, X } from "lucide-react";

export interface PasswordChecklistProps {
  password: string;
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const rules = [
    { label: "At least 8 characters long", valid: password.length >= 8 },
    { label: "Contains uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter (a-z)", valid: /[a-z]/.test(password) },
    { label: "Contains at least one number (0-9)", valid: /[0-9]/.test(password) },
    { label: "Contains special character (!@#$%^&*)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px]">
      <p className="text-slate-400 font-semibold mb-1">Security Requirements:</p>
      {rules.map((rule, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {rule.valid ? (
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          )}
          <span className={rule.valid ? "text-emerald-300 font-medium" : "text-slate-500"}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
};
