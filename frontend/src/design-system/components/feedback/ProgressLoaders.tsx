import React from "react";
import { Loader2, GraduationCap, Check } from "lucide-react";

// ─── Progress Components ───────────────────────────────────────────────────
export interface ProgressProps {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  color?: "indigo" | "emerald" | "amber" | "red";
  className?: string;
}

const colorMap = {
  indigo: "bg-indigo-600",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

export const LinearProgress: React.FC<ProgressProps> = ({
  value,
  label,
  showPercent = true,
  color = "indigo",
  className = "",
}) => {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          {label && <span className="text-slate-300">{label}</span>}
          {showPercent && <span className="text-slate-400 font-mono text-[11px] ml-auto">{percent}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${colorMap[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export const UploadProgressBar = LinearProgress;
export const TaskProgress = LinearProgress;

export const CircularProgress: React.FC<{ value: number; size?: number }> = ({
  value,
  size = 48,
}) => {
  const percent = Math.min(100, Math.max(0, value));
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-indigo-500 transition-all duration-500 ease-out"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-bold text-white">{percent}%</span>
    </div>
  );
};

export interface StepperProgressProps {
  steps: string[];
  currentStep: number;
}

export const StepperProgress: React.FC<StepperProgressProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-900 border border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={`text-xs font-semibold hidden md:inline ${
                  isCurrent ? "text-white font-bold" : "text-slate-500"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 transition-all ${
                  stepNum < currentStep ? "bg-emerald-600" : "bg-slate-800"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Loading Components ───────────────────────────────────────────────────
export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return <Loader2 className={`${sizeMap[size]} text-indigo-400 animate-spin`} />;
};

export const ButtonLoader = () => <Loader2 className="w-4 h-4 text-white animate-spin" />;

export const SectionLoader: React.FC<{ text?: string }> = ({ text = "Loading module..." }) => (
  <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
    <Spinner size="lg" />
    <p className="text-xs font-mono text-slate-400">{text}</p>
  </div>
);

export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-2xl shadow-indigo-500/30 animate-bounce">
      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
        <GraduationCap className="w-6 h-6 text-indigo-400" />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
      <Spinner size="sm" />
      <span>Loading College ERP...</span>
    </div>
  </div>
);

export const OverlayLoader: React.FC<{ text?: string }> = ({ text = "Processing..." }) => (
  <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
    <Spinner size="lg" />
    <p className="text-xs font-semibold text-white">{text}</p>
  </div>
);

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = "h-4 w-full" }) => (
  <div className={`bg-slate-800/80 rounded-xl animate-pulse ${className}`} />
);
