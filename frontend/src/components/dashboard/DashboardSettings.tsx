import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Monitor, Sun, Moon, LayoutGrid, Rows } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  density: "comfortable" | "compact";
  onDensityChange: (d: "comfortable" | "compact") => void;
}

export const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  isOpen,
  onClose,
  density,
  onDensityChange,
}) => {
  const { theme, setTheme } = useTheme();

  const THEME_OPTIONS = [
    { value: "light", label: "Light Mode", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark Mode", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System Default", icon: <Monitor className="w-4 h-4" /> },
  ] as const;

  const DENSITY_OPTIONS = [
    { value: "comfortable", label: "Comfortable", desc: "More whitespace, easier to read", icon: <LayoutGrid className="w-4 h-4" /> },
    { value: "compact", label: "Compact", desc: "Denser layout, more data visible", icon: <Rows className="w-4 h-4" /> },
  ] as const;

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
                <Palette className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">Dashboard Settings</span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* Theme */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Appearance Theme</h3>
                <div className="space-y-2">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                        theme === opt.value
                          ? "bg-indigo-950/60 border-indigo-500/60 text-white shadow-inner"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                      {theme === opt.value && (
                        <span className="ml-auto text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Density */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Layout Density</h3>
                <div className="space-y-2">
                  {DENSITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onDensityChange(opt.value)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                        density === opt.value
                          ? "bg-indigo-950/60 border-indigo-500/60 text-white shadow-inner"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {opt.icon}
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-[11px] text-slate-500">{opt.desc}</p>
                      </div>
                      {density === opt.value && (
                        <span className="ml-auto text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Language */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Language & Region</h3>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="text-xs font-semibold text-white">English (India)</p>
                  <p className="text-[11px] text-slate-500">Multi-language support (Hindi, Tamil, Telugu) coming soon</p>
                </div>
              </section>

              {/* Timezone */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Timezone</h3>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="text-xs font-semibold text-white">Asia / Kolkata (IST UTC+5:30)</p>
                  <p className="text-[11px] text-slate-500">Timezone auto-detected from browser settings</p>
                </div>
              </section>

              {/* Notifications */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Notification Preferences</h3>
                {["Academic Alerts", "Fee Reminders", "Attendance Warnings", "Library Notices", "System Updates"].map((pref) => (
                  <div key={pref} className="flex items-center justify-between px-1">
                    <span className="text-xs text-slate-300">{pref}</span>
                    <div className="w-9 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
