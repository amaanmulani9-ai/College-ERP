import React, { forwardRef, useState, useId, useRef, useEffect } from "react";
import { FormField } from "./FormField";
import { ChevronDown, Check, X, Search } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  success?: string;
  warning?: string;
  helpText?: string;
  placeholder?: string;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

const selectSizeClasses = {
  sm: "h-8 text-xs px-2.5 rounded-lg",
  md: "h-9.5 text-xs px-3 rounded-xl",
  lg: "h-11 text-sm px-3.5 rounded-xl",
};

// ─── Select (Standard HTML Dropdown) ───────────────────────────────────────
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      success,
      warning,
      helpText,
      placeholder = "Select option...",
      isDisabled = false,
      size = "md",
      className = "",
      containerClassName = "",
      required,
      id: customId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        error={error}
        success={success}
        warning={warning}
        helpText={helpText}
        className={containerClassName}
      >
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={id}
            disabled={isDisabled}
            required={required}
            className={[
              "w-full font-medium transition-all focus:outline-none border appearance-none pr-9 bg-slate-900/80 border-slate-800/80 text-white placeholder-slate-500 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50",
              error ? "border-red-500" : "",
              isDisabled ? "opacity-50 cursor-not-allowed" : "",
              selectSizeClasses[size],
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled className="bg-slate-950 text-slate-500">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-slate-950 text-slate-100 py-1"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>
      </FormField>
    );
  }
);
Select.displayName = "Select";

// ─── SearchableSelect / Combobox / Autocomplete ──────────────────────────────
export interface SearchableSelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  isDisabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Search and select...",
  error,
  helpText,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div ref={dropdownRef} className="relative w-full">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-9.5 px-3 text-xs font-medium bg-slate-900/80 border rounded-xl flex items-center justify-between transition-all ${
            error ? "border-red-500" : "border-slate-800 hover:border-slate-700"
          } text-white disabled:opacity-50`}
        >
          <span className={selectedOpt ? "text-white font-semibold" : "text-slate-500"}>
            {selectedOpt ? selectedOpt.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-2 max-h-60 overflow-y-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div className="space-y-0.5">
              {filteredOptions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">No options found</p>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      onChange?.(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      opt.value === value
                        ? "bg-indigo-950 text-indigo-300 font-semibold"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span>{opt.label}</span>
                    {opt.value === value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
};

export const Autocomplete = SearchableSelect;
export const Combobox = SearchableSelect;

// ─── MultiSelect ───────────────────────────────────────────────────────────
export interface MultiSelectProps {
  label?: string;
  options: SelectOption[];
  value?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  error,
  helpText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleValue = (val: string | number) => {
    const exists = value.includes(val);
    const updated = exists ? value.filter((v) => v !== val) : [...value, val];
    onChange?.(updated);
  };

  const removeValue = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== val));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div ref={dropdownRef} className="relative w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-9.5 p-1.5 px-3 border rounded-xl bg-slate-900/80 border-slate-800 text-xs flex flex-wrap items-center gap-1.5 cursor-pointer ${
            error ? "border-red-500" : "hover:border-slate-700"
          }`}
        >
          {value.length === 0 && (
            <span className="text-slate-500 py-1">{placeholder}</span>
          )}
          {value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-[11px] font-semibold px-2 py-0.5 rounded-lg"
              >
                {opt?.label ?? val}
                <button
                  type="button"
                  onClick={(e) => removeValue(val, e)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 max-h-52 overflow-y-auto space-y-0.5">
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleValue(opt.value)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-indigo-950 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </FormField>
  );
};
