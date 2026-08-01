import React, { forwardRef, useState, useId } from "react";
import { FormField } from "./FormField";
import {
  Eye,
  EyeOff,
  X,
  Copy,
  Check,
  Search,
  Mail,
  Lock,
  Phone,
  Globe,
  DollarSign,
  Loader2,
} from "lucide-react";

export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  helpText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  clearable?: boolean;
  copyable?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
  onClear?: () => void;
}

const inputSizeClasses = {
  sm: "h-8 text-xs px-2.5 rounded-lg",
  md: "h-9.5 text-xs px-3 rounded-xl",
  lg: "h-11 text-sm px-3.5 rounded-xl",
};

const inputStateClasses = (
  error?: string,
  success?: string,
  warning?: string,
  disabled?: boolean
) => {
  if (disabled)
    return "bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed";
  if (error)
    return "bg-slate-900/90 border-red-500/80 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500/50";
  if (success)
    return "bg-slate-900/90 border-emerald-500/80 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50";
  if (warning)
    return "bg-slate-900/90 border-amber-500/80 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50";
  return "bg-slate-900/80 border-slate-800/80 text-white placeholder-slate-500 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50";
};

// ─── TextInput ─────────────────────────────────────────────────────────────
export const TextInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      label,
      error,
      success,
      warning,
      helpText,
      prefixIcon,
      suffixIcon,
      clearable = false,
      copyable = false,
      isLoading = false,
      isDisabled = false,
      isReadOnly = false,
      size = "md",
      maxLength,
      value,
      defaultValue,
      onChange,
      onClear,
      className = "",
      containerClassName = "",
      required,
      id: customId,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    const [internalVal, setInternalVal] = useState<string>(
      (value !== undefined ? value : defaultValue ?? "") as string
    );
    const [copied, setCopied] = useState(false);

    const currentValue = value !== undefined ? (value as string) : internalVal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalVal(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) setInternalVal("");
      onClear?.();
    };

    const handleCopy = async () => {
      if (currentValue) {
        await navigator.clipboard.writeText(currentValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        error={error}
        success={success}
        warning={warning}
        helpText={helpText}
        maxLength={maxLength}
        currentLength={currentValue?.length ?? 0}
        className={containerClassName}
      >
        <div className="relative flex items-center w-full">
          {prefixIcon && (
            <div className="absolute left-3 text-slate-500 pointer-events-none flex items-center shrink-0">
              {prefixIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            value={currentValue}
            onChange={handleChange}
            disabled={isDisabled || isLoading}
            readOnly={isReadOnly}
            maxLength={maxLength}
            required={required}
            placeholder={placeholder}
            className={[
              "w-full font-medium transition-all focus:outline-none border",
              prefixIcon ? "pl-9" : "",
              suffixIcon || clearable || copyable || isLoading ? "pr-10" : "",
              inputSizeClasses[size],
              inputStateClasses(error, success, warning, isDisabled),
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          />

          <div className="absolute right-3 flex items-center gap-1.5 text-slate-500">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}

            {!isLoading && clearable && currentValue && !isDisabled && !isReadOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-slate-300 p-0.5 rounded"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {!isLoading && copyable && currentValue && (
              <button
                type="button"
                onClick={handleCopy}
                className="hover:text-slate-300 p-0.5 rounded"
                title={copied ? "Copied!" : "Copy value"}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {!isLoading && suffixIcon && (
              <div className="flex items-center shrink-0">{suffixIcon}</div>
            )}
          </div>
        </div>
      </FormField>
    );
  }
);
TextInput.displayName = "TextInput";

// ─── EmailInput ────────────────────────────────────────────────────────────
export const EmailInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => (
    <TextInput
      ref={ref}
      type="email"
      prefixIcon={<Mail className="w-4 h-4" />}
      placeholder="email@example.com"
      {...props}
    />
  )
);
EmailInput.displayName = "EmailInput";

// ─── PasswordInput ─────────────────────────────────────────────────────────
export interface PasswordInputProps extends BaseInputProps {
  showToggle?: boolean;
}
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <TextInput
        ref={ref}
        type={show ? "text" : "password"}
        prefixIcon={<Lock className="w-4 h-4" />}
        placeholder="••••••••"
        suffixIcon={
          showToggle ? (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// ─── NumberInput ───────────────────────────────────────────────────────────
export interface NumberInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
}
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step = 1, ...props }, ref) => (
    <TextInput
      ref={ref}
      type="number"
      min={min}
      max={max}
      step={step}
      {...props}
    />
  )
);
NumberInput.displayName = "NumberInput";

// ─── PhoneInput ────────────────────────────────────────────────────────────
export const PhoneInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => (
    <TextInput
      ref={ref}
      type="tel"
      prefixIcon={<Phone className="w-4 h-4" />}
      placeholder="+91 98765 43210"
      {...props}
    />
  )
);
PhoneInput.displayName = "PhoneInput";

// ─── SearchInput ───────────────────────────────────────────────────────────
export const SearchInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => (
    <TextInput
      ref={ref}
      type="search"
      prefixIcon={<Search className="w-4 h-4" />}
      placeholder="Search..."
      clearable
      {...props}
    />
  )
);
SearchInput.displayName = "SearchInput";

// ─── URLInput ──────────────────────────────────────────────────────────────
export const URLInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => (
    <TextInput
      ref={ref}
      type="url"
      prefixIcon={<Globe className="w-4 h-4" />}
      placeholder="https://example.com"
      {...props}
    />
  )
);
URLInput.displayName = "URLInput";

// ─── CurrencyInput ─────────────────────────────────────────────────────────
export interface CurrencyInputProps extends BaseInputProps {
  currencySymbol?: string;
}
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ currencySymbol = "₹", ...props }, ref) => (
    <TextInput
      ref={ref}
      type="number"
      prefixIcon={<span className="text-xs font-bold text-indigo-400">{currencySymbol}</span>}
      placeholder="0.00"
      {...props}
    />
  )
);
CurrencyInput.displayName = "CurrencyInput";

// ─── OTPInput ──────────────────────────────────────────────────────────────
export interface OTPInputProps {
  length?: number;
  label?: string;
  error?: string;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  isDisabled?: boolean;
}
export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  label = "Verification Code",
  error,
  onChange,
  onComplete,
  isDisabled = false,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    const combined = newOtp.join("");
    onChange?.(combined);
    if (combined.length === length && !newOtp.includes("")) {
      onComplete?.(combined);
    }
    // Auto-focus next input
    if (val && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <FormField label={label} error={error}>
      <div className="flex items-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-input-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isDisabled}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-10 h-12 text-center text-lg font-bold font-mono bg-slate-900/90 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all disabled:opacity-50"
          />
        ))}
      </div>
    </FormField>
  );
};

// ─── Textarea ──────────────────────────────────────────────────────────────
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  helpText?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      warning,
      helpText,
      maxLength,
      value,
      defaultValue,
      onChange,
      isDisabled = false,
      isReadOnly = false,
      className = "",
      containerClassName = "",
      required,
      id: customId,
      placeholder,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    const [internalVal, setInternalVal] = useState<string>(
      (value !== undefined ? value : defaultValue ?? "") as string
    );
    const currentValue = value !== undefined ? (value as string) : internalVal;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setInternalVal(e.target.value);
      onChange?.(e);
    };

    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        error={error}
        success={success}
        warning={warning}
        helpText={helpText}
        maxLength={maxLength}
        currentLength={currentValue?.length ?? 0}
        className={containerClassName}
      >
        <textarea
          ref={ref}
          id={id}
          value={currentValue}
          onChange={handleChange}
          disabled={isDisabled}
          readOnly={isReadOnly}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={[
            "w-full p-3 font-medium text-xs text-white placeholder-slate-500 transition-all focus:outline-none border rounded-xl resize-y",
            inputStateClasses(error, success, warning, isDisabled),
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      </FormField>
    );
  }
);
Textarea.displayName = "Textarea";
