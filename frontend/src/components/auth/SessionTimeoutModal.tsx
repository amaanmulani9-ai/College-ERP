import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export interface SessionTimeoutModalProps {
  warningSeconds?: number;
  inactivityMinutes?: number;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  warningSeconds = 60,
  inactivityMinutes = 15,
}) => {
  const { isAuthenticated, logout, refreshToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(warningSeconds);

  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownTimer);
      setShowModal(false);
      setCountdown(warningSeconds);

      // Trigger warning after inactivityMinutes - 1 min
      inactivityTimer = setTimeout(() => {
        setShowModal(true);
      }, (inactivityMinutes * 60 - warningSeconds) * 1000);
    };

    // User activity listeners
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownTimer);
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
    };
  }, [isAuthenticated, inactivityMinutes, warningSeconds]);

  // Countdown timer when warning modal is open
  useEffect(() => {
    if (!showModal) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showModal, logout]);

  // Cross-Tab Logout Synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue && isAuthenticated) {
        logout();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuthenticated, logout]);

  const handleStayLoggedIn = async () => {
    try {
      await refreshToken();
    } catch {
      // Fallback reset
    }
    setShowModal(false);
    setCountdown(warningSeconds);
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl shadow-black/80 space-y-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">Inactivity Session Timeout</h3>
            <p className="text-xs text-slate-400">
              Your institutional session will expire due to inactivity. You will be logged out automatically in:
            </p>
          </div>

          <div className="py-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-400 font-mono font-bold text-2xl">
              <Clock className="w-5 h-5 animate-pulse" />
              00:{countdown < 10 ? `0${countdown}` : countdown}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStayLoggedIn}
              className="py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Stay Logged In
            </button>

            <button
              onClick={logout}
              className="py-3 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
