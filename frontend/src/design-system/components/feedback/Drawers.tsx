import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Info } from "lucide-react";
import { Button, SecondaryButton, PrimaryButton } from "../Button";

export type DrawerPosition = "right" | "left" | "bottom";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  position?: DrawerPosition;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const positionVariants = {
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
};

const drawerSizeClasses = {
  right: {
    sm: "max-w-xs h-full right-0 top-0",
    md: "max-w-md h-full right-0 top-0",
    lg: "max-w-lg h-full right-0 top-0",
    xl: "max-w-2xl h-full right-0 top-0",
  },
  left: {
    sm: "max-w-xs h-full left-0 top-0",
    md: "max-w-md h-full left-0 top-0",
    lg: "max-w-lg h-full left-0 top-0",
    xl: "max-w-2xl h-full left-0 top-0",
  },
  bottom: {
    sm: "h-64 bottom-0 left-0 right-0",
    md: "h-96 bottom-0 left-0 right-0",
    lg: "h-[60vh] bottom-0 left-0 right-0",
    xl: "h-[80vh] bottom-0 left-0 right-0",
  },
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = "right",
  children,
  footer,
  size = "md",
  className = "",
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  const anim = positionVariants[position];
  const sizeClass = drawerSizeClasses[position][size];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={anim.initial}
            animate={anim.animate}
            exit={anim.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed z-50 w-full bg-slate-950 border-slate-800 shadow-2xl flex flex-col ${
              position === "right"
                ? "border-l"
                : position === "left"
                ? "border-r"
                : "border-t rounded-t-3xl"
            } ${sizeClass} ${className}`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {title && (
              <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">{title}</h3>
                  {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export const RightDrawer: React.FC<Omit<DrawerProps, "position">> = (props) => (
  <Drawer position="right" {...props} />
);
export const LeftDrawer: React.FC<Omit<DrawerProps, "position">> = (props) => (
  <Drawer position="left" {...props} />
);
export const BottomDrawer: React.FC<Omit<DrawerProps, "position">> = (props) => (
  <Drawer position="bottom" {...props} />
);

export const FilterDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, onApply, onReset, children }) => (
  <RightDrawer
    isOpen={isOpen}
    onClose={onClose}
    title={
      <span className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-indigo-400" /> Filter Criteria
      </span>
    }
    footer={
      <>
        <SecondaryButton onClick={onReset} size="sm">Reset Filters</SecondaryButton>
        <PrimaryButton onClick={onApply} size="sm">Apply Filters</PrimaryButton>
      </>
    }
  >
    {children}
  </RightDrawer>
);

export const DetailsDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => (
  <RightDrawer
    isOpen={isOpen}
    onClose={onClose}
    size="lg"
    title={
      <span className="flex items-center gap-2">
        <Info className="w-4 h-4 text-indigo-400" /> {title}
      </span>
    }
  >
    {children}
  </RightDrawer>
);
