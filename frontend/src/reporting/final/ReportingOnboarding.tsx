import React, { useState } from "react";
import { ReportingTour } from "./ReportingTour";
import { Rocket, Play } from "lucide-react";

export const ReportingOnboarding: React.FC = () => {
  const [showTour, setShowTour] = useState(false);

  return (
    <div className="space-y-4">
      {!showTour ? (
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950 border border-indigo-800 rounded-xl text-indigo-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Welcome to Enterprise Reporting & Analytics v0.33.0
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Take a 2-minute interactive guided walkthrough of the Catalog, Analytics, Builder & Distribution.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTour(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Guided Tour</span>
          </button>
        </div>
      ) : (
        <ReportingTour onClose={() => setShowTour(false)} />
      )}
    </div>
  );
};
