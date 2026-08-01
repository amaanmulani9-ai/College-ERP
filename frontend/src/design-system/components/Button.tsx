import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { springConfig } from "../tokens/animations";

// ─── Types ─────────────────────────────────────────────────────────────────
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "outline"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "size"> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Left-side icon */
  leftIcon?: React.ReactNode;
  /** Right-side icon */
  rightIcon?: React.ReactNode;
  /** Replace content with a spinner */
  isLoading?: boolean;
  /** Text shown next to spinner while loading */
  loadingText?: string;
  /** Disabled state */
  isDisabled?: boolean;
  /** Stretch to full container width */
  fullWidth?: boolean;
  /** Fully rounded pill shape */
  rounded?: boolean;
  /** Icon-only mode (square) */
  iconOnly?: boolean;
  /** Button label */
  children?: React.ReactNode;
  /** ARIA label (required when iconOnly=true) */
  "aria-label"?: string;
}

// ─── Tailwind Class Maps ────────────────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border border-indigo-600 hover:border-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-500/30",
  secondary:
    "bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border border-purple-600 hover:border-purple-500 shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-500/30",
  ghost:
    "bg-transparent hover:bg-slate-800 active:bg-slate-700 text-slate-300 hover:text-white border border-transparent hover:border-slate-700",
  danger:
    "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border border-red-600 hover:border-red-500 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-500/30",
  success:
    "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-600 hover:border-emerald-500 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-500/30",
  warning:
    "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 border border-amber-500 hover:border-amber-400 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-400/30",
  outline:
    "bg-transparent hover:bg-slate-900 active:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500",
  link:
    "bg-transparent text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline border-none p-0 h-auto shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1   text-[11px] font-bold   gap-1   h-7",
  sm: "px-3   py-1.5 text-xs     font-bold   gap-1.5 h-8",
  md: "px-4   py-2   text-xs     font-bold   gap-2   h-9",
  lg: "px-5   py-2.5 text-sm     font-bold   gap-2   h-11",
  xl: "px-6   py-3   text-sm     font-bold   gap-2.5 h-13",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  xs: "w-7  h-7  p-0",
  sm: "w-8  h-8  p-0",
  md: "w-9  h-9  p-0",
  lg: "w-11 h-11 p-0",
  xl: "w-13 h-13 p-0",
};

const spinnerSizes: Record<ButtonSize, string> = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-4 h-4",
  xl: "w-5 h-5",
};

// ─── Button Component ───────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      isDisabled = false,
      fullWidth = false,
      rounded = false,
      iconOnly = false,
      children,
      className = "",
      "aria-label": ariaLabel,
      onClick,
      ...rest
    },
    ref
  ) => {
    const disabled = isDisabled || isLoading;
    const isLink = variant === "link";

    const baseClasses = [
      "inline-flex items-center justify-center",
      "font-semibold leading-none",
      "transition-all duration-200",
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
      "select-none",
      "cursor-pointer",
      disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      fullWidth ? "w-full" : "",
      !isLink ? (rounded ? "rounded-full" : "rounded-xl") : "",
      variantClasses[variant],
      iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        whileHover={!disabled ? { y: -1 } : undefined}
        whileTap={!disabled ? { scale: 0.97 } : undefined}
        transition={springConfig.snappy}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        aria-disabled={disabled}
        onClick={!disabled ? onClick : undefined}
        type="button"
        {...rest}
      >
        {/* Spinner (left side) */}
        {isLoading && (
          <Loader2
            className={`${spinnerSizes[size]} animate-spin shrink-0`}
            aria-hidden="true"
          />
        )}

        {/* Left Icon (hidden during loading) */}
        {!isLoading && leftIcon && (
          <span className="shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Label */}
        {!iconOnly && (
          <span className={isLoading && loadingText ? "ml-1" : ""}>
            {isLoading && loadingText ? loadingText : children}
          </span>
        )}

        {/* Right Icon (hidden during loading) */}
        {!isLoading && rightIcon && !iconOnly && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

// ─── Variant Shorthand Components ──────────────────────────────────────────
export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
);
SecondaryButton.displayName = "SecondaryButton";

export const GhostButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
);
GhostButton.displayName = "GhostButton";

export const DangerButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="danger" {...props} />
);
DangerButton.displayName = "DangerButton";

export const SuccessButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="success" {...props} />
);
SuccessButton.displayName = "SuccessButton";

export const WarningButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="warning" {...props} />
);
WarningButton.displayName = "WarningButton";

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="outline" {...props} />
);
OutlineButton.displayName = "OutlineButton";

export const LinkButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="link" {...props} />
);
LinkButton.displayName = "LinkButton";

// ─── Loading Button (alias for isLoading=true pattern) ────────────────────
export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = true, ...props }, ref) => (
    <Button ref={ref} isLoading={isLoading} {...props} />
  )
);
LoadingButton.displayName = "LoadingButton";

// ─── Icon Button ────────────────────────────────────────────────────────────
export interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  "aria-label": string;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ...props }, ref) => (
    <Button ref={ref} iconOnly leftIcon={icon} {...props} />
  )
);
IconButton.displayName = "IconButton";
