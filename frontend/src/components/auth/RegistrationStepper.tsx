import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  number: number;
  label: string;
}

export interface RegistrationStepperProps {
  currentStep: number;
  steps?: StepItem[];
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  currentStep,
  steps = [
    { number: 1, label: "Personal" },
    { number: 2, label: "Institution" },
    { number: 3, label: "Security" },
    { number: 4, label: "Review" },
  ],
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting Background Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 90}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : isCurrent
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-600/20 shadow-lg shadow-indigo-600/30"
                    : "bg-slate-950 text-slate-500 border border-slate-800"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 transition-colors ${
                  isCurrent ? "text-indigo-400 font-bold" : isCompleted ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
