import React from "react";
import { Label, Caption } from "../Typography";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  success?: string;
  warning?: string;
  helpText?: string;
  maxLength?: number;
  currentLength?: number;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  success,
  warning,
  helpText,
  maxLength,
  currentLength,
  className = "",
  children,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* Header: Label + Character Count */}
      {(label || maxLength !== undefined) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <Label htmlFor={htmlFor} required={required}>
              {label}
            </Label>
          )}
          {maxLength !== undefined && currentLength !== undefined && (
            <span
              className={`text-[10px] font-mono font-medium ${
                currentLength >= maxLength ? "text-red-400 font-bold" : "text-slate-500"
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Input Control Container */}
      {children}

      {/* Footer: Error / Success / Warning / HelpText */}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && success && (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {!error && !success && warning && (
        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mt-0.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {!error && !success && !warning && helpText && (
        <Caption className="mt-0.5">{helpText}</Caption>
      )}
    </div>
  );
};
