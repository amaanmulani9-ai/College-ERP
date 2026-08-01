import React from "react";

export interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateScore = () => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const score = calculateScore();

  const getLabel = () => {
    switch (score) {
      case 0:
        return { text: "Too Weak", color: "text-slate-500", bg: "bg-slate-800" };
      case 1:
      case 2:
        return { text: "Weak", color: "text-red-400", bg: "bg-red-500" };
      case 3:
        return { text: "Fair", color: "text-amber-400", bg: "bg-amber-500" };
      case 4:
        return { text: "Strong", color: "text-indigo-400", bg: "bg-indigo-500" };
      case 5:
        return { text: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500" };
      default:
        return { text: "", color: "", bg: "" };
    }
  };

  const label = getLabel();

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Password Strength</span>
        <span className={`font-bold ${label.color}`}>{label.text}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`rounded-full transition-all duration-300 ${
              score >= step ? label.bg : "bg-slate-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
