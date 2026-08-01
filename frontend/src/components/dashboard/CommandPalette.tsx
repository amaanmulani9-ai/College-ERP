import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Clock,
  Pin,
  Users,
  BookOpen,
  CreditCard,
  BarChart2,
  Settings,
  GraduationCap,
  Building2,
  UserCheck,
  ChevronRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  route: string;
  icon: React.ReactNode;
  keywords: string[];
}

const ALL_COMMANDS: CommandItem[] = [
  { id: "students", label: "Student Directory", category: "Pages", route: "/students", icon: <Users className="w-4 h-4 text-indigo-400" />, keywords: ["students", "enrollment", "directory"] },
  { id: "students-create", label: "Enroll New Student", category: "Actions", route: "/students/create", icon: <Users className="w-4 h-4 text-emerald-400" />, keywords: ["enroll", "add student", "register"] },
  { id: "staff", label: "Faculty & Staff", category: "Pages", route: "/staff", icon: <UserCheck className="w-4 h-4 text-indigo-400" />, keywords: ["faculty", "staff", "teacher"] },
  { id: "departments", label: "Academic Departments", category: "Academics", route: "/academics/departments", icon: <Building2 className="w-4 h-4 text-purple-400" />, keywords: ["departments", "academics"] },
  { id: "timetable", label: "Class Timetables", category: "Academics", route: "/timetable", icon: <BookOpen className="w-4 h-4 text-indigo-400" />, keywords: ["timetable", "schedule", "classes"] },
  { id: "results", label: "Grades & Results", category: "Academics", route: "/results", icon: <GraduationCap className="w-4 h-4 text-amber-400" />, keywords: ["results", "grades", "marks"] },
  { id: "fees", label: "Fee Structures", category: "Finance", route: "/fees", icon: <CreditCard className="w-4 h-4 text-emerald-400" />, keywords: ["fees", "finance", "tuition"] },
  { id: "payments", label: "Fee Collections", category: "Finance", route: "/payments", icon: <CreditCard className="w-4 h-4 text-emerald-400" />, keywords: ["payments", "collections", "receipts"] },
  { id: "library", label: "Digital Library", category: "Campus", route: "/library", icon: <BookOpen className="w-4 h-4 text-amber-400" />, keywords: ["library", "books", "catalog"] },
  { id: "hostel", label: "Hostel & Beds", category: "Campus", route: "/hostel", icon: <Building2 className="w-4 h-4 text-purple-400" />, keywords: ["hostel", "beds", "rooms"] },
  { id: "reports", label: "Analytics & Reports", category: "Reports", route: "/reports/naac-nirf", icon: <BarChart2 className="w-4 h-4 text-indigo-400" />, keywords: ["reports", "analytics", "naac", "nirf"] },
  { id: "settings", label: "System Settings", category: "Settings", route: "/profile/security", icon: <Settings className="w-4 h-4 text-slate-400" />, keywords: ["settings", "security", "profile"] },
  { id: "dashboard-super-admin", label: "Super Admin Dashboard", category: "Dashboards", route: "/dashboard/super-admin", icon: <BarChart2 className="w-4 h-4 text-indigo-400" />, keywords: ["dashboard", "super admin"] },
  { id: "dashboard-principal", label: "Principal Dashboard", category: "Dashboards", route: "/dashboard/principal", icon: <BarChart2 className="w-4 h-4 text-indigo-400" />, keywords: ["dashboard", "principal"] },
];

const PINNED_SHORTCUTS = [
  { label: "Enroll Student", route: "/students/create", icon: <Users className="w-3.5 h-3.5 text-emerald-400" /> },
  { label: "Collect Fee", route: "/payments/collect", icon: <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> },
  { label: "View Reports", route: "/reports/naac-nirf", icon: <BarChart2 className="w-3.5 h-3.5 text-purple-400" /> },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(["students", "fee collection", "timetable"]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? ALL_COMMANDS.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : ALL_COMMANDS.slice(0, 6);

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (cmd: CommandItem) => {
      setRecentSearches((prev) => [cmd.label, ...prev.filter((s) => s !== cmd.label)].slice(0, 5));
      onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, students, reports, actions..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="text-[10px] font-mono text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800/60">
              {/* Pinned Shortcuts (when no query) */}
              {!query && (
                <div className="p-3 space-y-1">
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 mb-2 flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned Shortcuts
                  </p>
                  {PINNED_SHORTCUTS.map((s, i) => (
                    <Link
                      key={i}
                      to={s.route}
                      onClick={onClose}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {s.icon}
                      <span>{s.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-600" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Recent Searches (when no query) */}
              {!query && recentSearches.length > 0 && (
                <div className="p-3 space-y-1">
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Recent Searches
                  </p>
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(s)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-white text-left transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="p-3 space-y-1">
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 mb-2">{category}</p>
                  {items.map((cmd) => (
                    <Link
                      key={cmd.id}
                      to={cmd.route}
                      onClick={() => handleSelect(cmd)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {cmd.icon}
                      <span className="flex-1">{cmd.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    </Link>
                  ))}
                </div>
              ))}

              {query && filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-400">No results for <strong className="text-white">"{query}"</strong></p>
                </div>
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span>↑↓ Navigate • Enter Select • ESC Close</span>
              <span>⌘K Global Search</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
