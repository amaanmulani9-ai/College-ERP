import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { FocusTrap } from "./FocusTrap";
import { ACCESSIBILITY_TOKENS } from "./accessibilityTokens";

export interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-desc" : undefined}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans select-none animate-in fade-in duration-150"
      >
        <div className={`bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl ${className}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 id="dialog-title" className="font-bold text-slate-100 text-sm">
                {title}
              </h2>
              {description && (
                <p id="dialog-desc" className="text-[10px] text-slate-400">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className={`p-1.5 text-slate-400 hover:text-slate-200 ${ACCESSIBILITY_TOKENS.focusRing.standard}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </FocusTrap>
  );
};

export const AccessibleDrawer: React.FC<AccessibleDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md font-sans select-none animate-in fade-in duration-150"
      >
        <div className={`h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-5 space-y-4 shadow-2xl ${className}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 id="drawer-title" className="font-bold text-slate-100 text-sm">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className={`p-1.5 text-slate-400 hover:text-slate-200 ${ACCESSIBILITY_TOKENS.focusRing.standard}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </FocusTrap>
  );
};
