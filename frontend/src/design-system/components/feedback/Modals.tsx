import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Trash2, Archive, RotateCcw, Lock, LogOut, FileText } from "lucide-react";
import { Button, DangerButton, PrimaryButton, SecondaryButton } from "../Button";

// ─── Base Modal ────────────────────────────────────────────────────────────
export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "fullscreen";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const modalSizeClasses: Record<ModalSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  fullscreen: "w-screen h-screen max-w-none rounded-none m-0",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") onClose();
    },
    [closeOnEsc, onClose]
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col my-auto ${modalSizeClasses[size]} ${className}`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {title && (
              <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight">{title}</h3>
                  {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-300">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Confirmation & Alert Modals ───────────────────────────────────────────
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="sm"
    title={title}
    footer={
      <>
        <SecondaryButton onClick={onClose} isDisabled={isLoading} size="sm">
          {cancelLabel}
        </SecondaryButton>
        {variant === "danger" ? (
          <DangerButton onClick={onConfirm} isLoading={isLoading} size="sm">
            {confirmLabel}
          </DangerButton>
        ) : (
          <PrimaryButton onClick={onConfirm} isLoading={isLoading} size="sm">
            {confirmLabel}
          </PrimaryButton>
        )}
      </>
    }
  >
    <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
  </Modal>
);

export const AlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, title, message }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="sm"
    title={title}
    footer={<PrimaryButton onClick={onClose} size="sm">OK</PrimaryButton>}
  >
    <p className="text-xs text-slate-300">{message}</p>
  </Modal>
);

// ─── Specialized Modals ───────────────────────────────────────────────────
export const FullscreenModal: React.FC<ModalProps> = (props) => (
  <Modal size="fullscreen" {...props} />
);

export interface WizardModalProps extends ModalProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
}

export const WizardModal: React.FC<WizardModalProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  footer,
  ...props
}) => (
  <Modal
    {...props}
    subtitle={`Step ${currentStep} of ${totalSteps}`}
    footer={
      footer || (
        <>
          {onBack && (
            <SecondaryButton onClick={onBack} isDisabled={currentStep === 1} size="sm">
              Back
            </SecondaryButton>
          )}
          {onNext && (
            <PrimaryButton onClick={onNext} size="sm">
              {currentStep === totalSteps ? "Finish" : "Next Step"}
            </PrimaryButton>
          )}
        </>
      )
    }
  />
);

export const ImagePreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}> = ({ isOpen, onClose, src, alt = "Preview" }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <div className="flex items-center justify-center p-2">
      <img src={src} alt={alt} className="max-h-[80vh] rounded-2xl object-contain" />
    </div>
  </Modal>
);

export const PDFPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}> = ({ isOpen, onClose, url, title = "Document Viewer" }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl" title={title}>
    <div className="w-full h-[70vh]">
      <iframe src={url} title={title} className="w-full h-full rounded-2xl border border-slate-800" />
    </div>
  </Modal>
);

// ─── Specialized Dialogs ──────────────────────────────────────────────────
export const DeleteConfirmationDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName?: string;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onDelete, itemName = "item", isLoading }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onDelete}
    variant="danger"
    title="Delete Confirmation"
    message={`Are you sure you want to permanently delete "${itemName}"? This action cannot be undone.`}
    confirmLabel="Delete Permanently"
    isLoading={isLoading}
  />
);

export const ArchiveConfirmationDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onArchive: () => void;
  itemName?: string;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onArchive, itemName = "item", isLoading }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onArchive}
    variant="warning"
    title="Archive Confirmation"
    message={`Archive "${itemName}"? Archived items can be restored from system settings later.`}
    confirmLabel="Archive Item"
    isLoading={isLoading}
  />
);

export const RestoreConfirmationDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
  itemName?: string;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onRestore, itemName = "item", isLoading }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onRestore}
    variant="primary"
    title="Restore Item"
    message={`Restore "${itemName}" back to active status?`}
    confirmLabel="Restore"
    isLoading={isLoading}
  />
);

export const UnsavedChangesDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
}> = ({ isOpen, onClose, onDiscard }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onDiscard}
    variant="danger"
    title="Unsaved Changes"
    message="You have unsaved changes that will be lost if you leave. Are you sure you want to discard changes?"
    confirmLabel="Discard Changes"
    cancelLabel="Keep Editing"
  />
);

export const LogoutConfirmationDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}> = ({ isOpen, onClose, onLogout }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onLogout}
    variant="danger"
    title="Sign Out"
    message="Are you sure you want to sign out of your account session?"
    confirmLabel="Sign Out"
  />
);

export const SessionExpiredDialog: React.FC<{
  isOpen: boolean;
  onLogin: () => void;
}> = ({ isOpen, onLogin }) => (
  <Modal isOpen={isOpen} onClose={onLogin} size="sm" title="Session Expired">
    <div className="text-center py-4 space-y-3">
      <Lock className="w-8 h-8 text-amber-400 mx-auto" />
      <p className="text-xs text-slate-300">Your session has expired due to inactivity. Please sign in again to continue.</p>
      <PrimaryButton onClick={onLogin} fullWidth size="sm">Sign In Again</PrimaryButton>
    </div>
  </Modal>
);

export const PermissionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  permissionRequired?: string;
}> = ({ isOpen, onClose, permissionRequired = "Administrative Authority" }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm" title="Permission Required">
    <div className="text-center py-4 space-y-3">
      <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
      <p className="text-xs text-slate-300">You need <strong>{permissionRequired}</strong> to perform this operation.</p>
      <SecondaryButton onClick={onClose} fullWidth size="sm">Close</SecondaryButton>
    </div>
  </Modal>
);
