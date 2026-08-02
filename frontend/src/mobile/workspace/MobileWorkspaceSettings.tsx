import React, { useState } from "react";
import { Sliders, Smartphone, Eye, BellRing, ShieldCheck } from "lucide-react";

export const MobileWorkspaceSettings: React.FC = () => {
  const [compactCards, setCompactCards] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Sliders className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Mobile Touch Preferences</h3>
      </div>

      <div className="space-y-2">
        {[
          { label: "Compact Module Cards", sub: "Show smaller card rows on phones", val: compactCards, set: setCompactCards },
          { label: "Haptic Touch Feedback", sub: "Vibrate on button press (where supported)", val: hapticFeedback, set: setHapticFeedback },
          { label: "Auto Sync Offline Data", sub: "Sync workspace data when online", val: autoSync, set: setAutoSync },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <p className="font-bold text-slate-200 text-[11px]">{item.label}</p>
              <p className="text-[9px] text-slate-500">{item.sub}</p>
            </div>
            <button
              role="switch"
              aria-checked={item.val}
              onClick={() => item.set(!item.val)}
              className={`relative w-10 h-5 rounded-full transition-colors ${item.val ? "bg-indigo-600" : "bg-slate-700"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.val ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
