import React, { forwardRef, useId } from "react";
import { Check } from "lucide-react";
import { FormField } from "./FormField";

// ─── Checkbox ──────────────────────────────────────────────────────────────
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  error?: string;
  helpText?: string;
  isDisabled?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helpText,
      isDisabled = false,
      checked,
      defaultChecked,
      className = "",
      id: customId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={id}
          className={`inline-flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none ${
            isDisabled ? "opacity-50 cursor-not-allowed text-slate-500" : "text-slate-200 hover:text-white"
          } ${className}`}
        >
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={isDisabled}
              className="peer sr-only"
              {...rest}
            />
            <div className="w-4.5 h-4.5 rounded-md bg-slate-900 border border-slate-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500/50 transition-all flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
            </div>
          </div>
          {label && <span>{label}</span>}
        </label>
        {error && <span className="text-red-400 text-xs font-semibold">{error}</span>}
        {!error && helpText && <span className="text-slate-500 text-[11px]">{helpText}</span>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ─── CheckboxGroup ─────────────────────────────────────────────────────────
export interface CheckboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  values?: string[];
  onChange?: (values: string[]) => void;
  error?: string;
  helpText?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  values = [],
  onChange,
  error,
  helpText,
}) => {
  const toggle = (val: string) => {
    const next = values.includes(val) ? values.filter((v) => v !== val) : [...values, val];
    onChange?.(next);
  };

  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="flex flex-col gap-2 pt-1">
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            checked={values.includes(opt.value)}
            isDisabled={opt.disabled}
            onChange={() => toggle(opt.value)}
          />
        ))}
      </div>
    </FormField>
  );
};

// ─── Radio ─────────────────────────────────────────────────────────────────
export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  isDisabled?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      isDisabled = false,
      checked,
      defaultChecked,
      className = "",
      id: customId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <label
        htmlFor={id}
        className={`inline-flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none ${
          isDisabled ? "opacity-50 cursor-not-allowed text-slate-500" : "text-slate-200 hover:text-white"
        } ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="radio"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={isDisabled}
            className="peer sr-only"
            {...rest}
          />
          <div className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-700 peer-checked:border-indigo-500 peer-focus:ring-2 peer-focus:ring-indigo-500/50 transition-all flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";

// ─── RadioGroup ────────────────────────────────────────────────────────────
export interface RadioGroupProps {
  label?: string;
  name: string;
  options: { label: string; value: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
  direction?: "horizontal" | "vertical";
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helpText,
  direction = "vertical",
}) => {
  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div
        className={`flex ${
          direction === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2"
        } pt-1`}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            label={opt.label}
            checked={value === opt.value}
            isDisabled={opt.disabled}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>
    </FormField>
  );
};

// ─── Switch ────────────────────────────────────────────────────────────────
export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  size?: "sm" | "md";
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked = false,
  onChange,
  isDisabled = false,
  size = "md",
}) => {
  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        isDisabled ? "opacity-50 cursor-not-allowed text-slate-500" : "text-slate-200"
      }`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={isDisabled}
        onClick={() => !isDisabled && onChange?.(!checked)}
        className={`relative inline-flex shrink-0 transition-colors duration-200 ease-in-out rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
          size === "sm" ? "w-8 h-4.5" : "w-10 h-6"
        } ${checked ? "bg-indigo-600" : "bg-slate-800"}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
            size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5"
          } ${checked ? (size === "sm" ? "translate-x-3.5" : "translate-x-4") : "translate-x-0"}`}
        />
      </button>
      {label && <span className="text-xs font-semibold">{label}</span>}
    </label>
  );
};

// ─── ToggleGroup ───────────────────────────────────────────────────────────
export interface ToggleOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isSelected
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
