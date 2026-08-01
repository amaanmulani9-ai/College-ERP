import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useTheme, Theme } from "../../context/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
    { value: "system", label: "System", icon: <Laptop className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const currentIcon =
    theme === "light" ? (
      <Sun className="w-4 h-4 text-amber-500" />
    ) : theme === "dark" ? (
      <Moon className="w-4 h-4 text-indigo-400" />
    ) : (
      <Laptop className="w-4 h-4 text-slate-400" />
    );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle theme mode"
        className="p-2 rounded-xl border border-slate-800 dark:border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {currentIcon}
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors ${
                theme === opt.value
                  ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
