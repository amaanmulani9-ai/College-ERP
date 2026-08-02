import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, KeyRound, Monitor, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const UserMenuDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { user, tenant, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all focus:outline-none"
        aria-label="User account dropdown"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-md">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs font-bold text-indigo-300">
            {user.first_name?.[0] || "U"}
          </div>
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-white leading-tight">
            {user.first_name} {user.last_name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{user.role || "User"}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Header User Card */}
            <div className="p-4 bg-slate-950 border-b border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-white block truncate">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {user.role || "College Admin"}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Tenant: {tenant || "default"}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-0.5 text-xs text-slate-300">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>My User Profile</span>
              </Link>

              <Link
                to="/profile/security"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Security Settings</span>
              </Link>

              <Link
                to="/change-password"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Change Password</span>
              </Link>

              <Link
                to="/sessions"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <Monitor className="w-4 h-4 text-purple-400" />
                <span>Active Sessions</span>
              </Link>

              <div className="my-1 border-t border-slate-800/80" />

              <Link
                to="/profile/preferences"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Preferences</span>
              </Link>

              <Link
                to="/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help & Support</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
