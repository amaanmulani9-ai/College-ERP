import React, { useState } from "react";
import { Plus, X, Sparkles, UserPlus, Receipt, CheckSquare, MessageSquare } from "lucide-react";

interface SpeedDialItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

export const MobileFloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ACTIONS: SpeedDialItem[] = [
    { id: "ai",       label: "Ask AI Copilot",       icon: Sparkles,    color: "bg-indigo-600 text-white", onClick: () => alert("AI Copilot Triggered") },
    { id: "student",  label: "Add Student",          icon: UserPlus,    color: "bg-cyan-600 text-white",   onClick: () => alert("Add Student Form") },
    { id: "fee",      label: "Collect Fee",          icon: Receipt,     color: "bg-emerald-600 text-white",onClick: () => alert("Collect Fee Modal") },
    { id: "att",      label: "Take Attendance",      icon: CheckSquare, color: "bg-amber-600 text-white",  onClick: () => alert("Take Attendance Flow") },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2.5 font-sans select-none">
      {/* Backdrop overlay when speed dial is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30"
        />
      )}

      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 z-40 animate-in slide-in-from-bottom-3 duration-200">
          {ACTIONS.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap">
                  {act.label}
                </span>
                <button
                  onClick={() => {
                    act.onClick();
                    setIsOpen(false);
                  }}
                  aria-label={act.label}
                  className={`w-11 h-11 rounded-2xl ${act.color} shadow-lg flex items-center justify-center active:scale-90 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Speed Dial Quick Actions"
        aria-expanded={isOpen}
        className={`relative z-40 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl flex items-center justify-center active:scale-90 transition-all ${
          isOpen ? "rotate-45 bg-rose-600 hover:bg-rose-500" : ""
        }`}
      >
        <Plus className="w-7 h-7 transition-transform" />
      </button>
    </div>
  );
};
