import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard, Eye, EyeOff, GripVertical, RotateCcw } from "lucide-react";

export interface WidgetConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "kpi-cards", label: "KPI Cards", visible: true, order: 0 },
  { id: "analytics-charts", label: "Analytics Charts", visible: true, order: 1 },
  { id: "activity-feed", label: "Activity Feed", visible: true, order: 2 },
  { id: "announcements", label: "Announcement Panel", visible: true, order: 3 },
  { id: "calendar", label: "Calendar Widget", visible: true, order: 4 },
  { id: "quick-notes", label: "Quick Notes", visible: true, order: 5 },
  { id: "pinned-shortcuts", label: "Pinned Shortcuts", visible: true, order: 6 },
  { id: "ai-insights", label: "AI Insights (Coming Soon)", visible: true, order: 7 },
];

export const useDashboardPersonalization = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem("dashboard_widget_config");
      return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });

  useEffect(() => {
    localStorage.setItem("dashboard_widget_config", JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, visible: !w.visible } : w));
  }, []);

  const resetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem("dashboard_widget_config");
  }, []);

  const isVisible = useCallback((id: string) => widgets.find((w) => w.id === id)?.visible ?? true, [widgets]);

  return { widgets, toggleWidget, resetWidgets, isVisible };
};

interface DashboardPersonalizationProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onToggle: (id: string) => void;
  onReset: () => void;
}

export const DashboardPersonalization: React.FC<DashboardPersonalizationProps> = ({
  isOpen,
  onClose,
  widgets,
  onToggle,
  onReset,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-950 border-l border-slate-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">Customize Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onReset}
                  className="text-[10px] text-slate-400 hover:text-white font-semibold flex items-center gap-1 border border-slate-800 rounded-lg px-2 py-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <p className="text-[11px] text-slate-500 pb-2">Toggle widgets visible or hidden. Drag-to-reorder coming in v2.</p>

              {widgets.sort((a, b) => a.order - b.order).map((widget) => (
                <div
                  key={widget.id}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    widget.visible
                      ? "bg-slate-900 border-slate-800 text-slate-200"
                      : "bg-slate-950 border-slate-900 text-slate-600"
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-slate-600 shrink-0 cursor-grab" />
                  <span className="flex-1 text-xs font-semibold">{widget.label}</span>
                  <button
                    onClick={() => onToggle(widget.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      widget.visible
                        ? "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950"
                        : "text-slate-600 hover:text-slate-400 hover:bg-slate-900"
                    }`}
                    aria-label={widget.visible ? `Hide ${widget.label}` : `Show ${widget.label}`}
                  >
                    {widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800">
              <p className="text-[10px] text-slate-600 text-center">Preferences saved automatically to browser storage</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
