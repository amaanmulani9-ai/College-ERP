import React, { ReactNode } from "react";
import { getGPUStyle } from "./motionHelpers";
import { MOTION_VARIANTS } from "./motionVariants";

export interface ModalTransitionProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({ children, isOpen, onClose, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={getGPUStyle()}
        className={`fixed inset-0 ${MOTION_VARIANTS.modal.backdrop}`}
      />
      {/* Panel */}
      <div
        style={getGPUStyle()}
        className={`relative z-10 w-full max-w-lg ${MOTION_VARIANTS.modal.panel} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export const DrawerTransition: React.FC<ModalTransitionProps> = ({ children, isOpen, onClose, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={getGPUStyle()}
        className={`fixed inset-0 ${MOTION_VARIANTS.drawer.backdrop}`}
      />
      {/* Drawer Panel */}
      <div
        style={getGPUStyle()}
        className={`relative z-10 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl ${MOTION_VARIANTS.drawer.panel} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
