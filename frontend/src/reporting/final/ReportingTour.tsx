import React, { useState } from "react";
import { Sparkles, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, X } from "lucide-react";
import { TOUR_STEPS } from "./mockFinalData";

interface ReportingTourProps {
  onClose?: () => void;
}

export const ReportingTour: React.FC<ReportingTourProps> = ({ onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const step = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="p-5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-700/60 rounded-xl shadow-2xl text-xs font-sans relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Interactive Platform Guided Tour ({currentStepIndex + 1}/{TOUR_STEPS.length})
          </h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCompleted ? (
        <div className="p-6 bg-slate-950/90 border border-emerald-800/60 rounded-xl text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-950 border border-emerald-700 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-100">Guided Tour Completed!</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You are ready to explore the 30-Module Report Catalog, Visual Analytics Dashboards, No-Code Builder, and Distribution Center.
          </p>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg mx-auto shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Walkthrough</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <h4 className="text-sm font-extrabold text-slate-100 mb-1">{step.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold ${
                currentStepIndex === 0
                  ? "bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentStepIndex ? "bg-indigo-400 w-4" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
