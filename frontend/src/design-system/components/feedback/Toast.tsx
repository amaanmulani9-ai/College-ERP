import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition = "top-right" | "bottom-right" | "bottom-left";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (title: string, message?: string) => string;
    error: (title: string, message?: string) => string;
    warning: (title: string, message?: string) => string;
    info: (title: string, message?: string) => string;
    loading: (title: string, message?: string) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  loading: <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />,
};

const toastBorderColors: Record<ToastType, string> = {
  success: "border-emerald-500/50",
  error: "border-red-500/50",
  warning: "border-amber-500/50",
  info: "border-sky-500/50",
  loading: "border-indigo-500/50",
};

export const ToastProvider: React.FC<{ children: React.ReactNode; position?: ToastPosition }> = ({
  children,
  position = "top-right",
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = toast.duration ?? (toast.type === "loading" ? 0 : 4000);

      const newItem: ToastItem = { ...toast, id, duration };

      setToasts((prev) => [newItem, ...prev].slice(0, 5)); // Keep max 5

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toastHelpers = {
    success: (title: string, message?: string) => addToast({ type: "success", title, message }),
    error: (title: string, message?: string) => addToast({ type: "error", title, message }),
    warning: (title: string, message?: string) => addToast({ type: "warning", title, message }),
    info: (title: string, message?: string) => addToast({ type: "info", title, message }),
    loading: (title: string, message?: string) => addToast({ type: "loading", title, message }),
  };

  const posClass =
    position === "top-right"
      ? "top-4 right-4"
      : position === "bottom-right"
      ? "bottom-4 right-4"
      : "bottom-4 left-4";

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toast: toastHelpers }}>
      {children}

      {/* Floating Toast Portal */}
      <div className={`fixed z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none ${posClass}`}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`pointer-events-auto p-4 bg-slate-950/95 border rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 ${toastBorderColors[t.type]}`}
            >
              {toastIcons[t.type]}
              <div className="flex-1 space-y-0.5 min-w-0">
                <h5 className="text-xs font-bold text-white tracking-tight">{t.title}</h5>
                {t.message && <p className="text-[11px] text-slate-400 leading-normal">{t.message}</p>}
                {t.actionLabel && t.onAction && (
                  <button
                    onClick={t.onAction}
                    className="mt-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    {t.actionLabel}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-500 hover:text-white p-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
