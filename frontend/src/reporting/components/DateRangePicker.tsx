import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "../types";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: "Today", days: 0 },
    { label: "Yesterday", days: 1 },
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "This Month", type: "month" },
  ];

  const handlePreset = (preset: { label: string; days?: number; type?: string }) => {
    const end = new Date();
    let start = new Date();

    if (preset.days === 0) {
      start = end;
    } else if (preset.days) {
      start.setDate(end.getDate() - preset.days);
    } else if (preset.type === "month") {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    }

    onChange({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700/80 hover:border-indigo-500/80 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        aria-label="Select Date Range"
        aria-expanded={isOpen}
      >
        <CalendarIcon className="w-4 h-4 text-indigo-400" />
        <span>
          {value.startDate} to {value.endDate}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Date Range Selector"
          className="absolute right-0 mt-2 w-72 z-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 backdrop-blur-md"
        >
          <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Quick Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                className="px-2.5 py-1.5 text-left text-xs bg-slate-800/80 hover:bg-indigo-600/30 hover:text-indigo-200 text-slate-300 rounded border border-slate-700/60 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Custom Range
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={value.startDate}
                  onChange={(e) =>
                    onChange({ ...value, startDate: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={value.endDate}
                  onChange={(e) =>
                    onChange({ ...value, endDate: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-colors"
            >
              Apply Custom Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
