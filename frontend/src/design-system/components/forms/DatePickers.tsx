import React, { forwardRef } from "react";
import { FormField } from "./FormField";
import { TextInput } from "./Inputs";
import { Select, SelectOption } from "./Selects";
import { Calendar, Clock } from "lucide-react";

export interface DatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

// ─── DatePicker ────────────────────────────────────────────────────────────
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helpText, className = "", ...rest }, ref) => (
    <TextInput
      ref={ref}
      type="date"
      label={label}
      error={error}
      helpText={helpText}
      prefixIcon={<Calendar className="w-4 h-4 text-indigo-400" />}
      className={className}
      {...rest}
    />
  )
);
DatePicker.displayName = "DatePicker";

// ─── TimePicker ────────────────────────────────────────────────────────────
export const TimePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helpText, className = "", ...rest }, ref) => (
    <TextInput
      ref={ref}
      type="time"
      label={label}
      error={error}
      helpText={helpText}
      prefixIcon={<Clock className="w-4 h-4 text-indigo-400" />}
      className={className}
      {...rest}
    />
  )
);
TimePicker.displayName = "TimePicker";

// ─── DateTimePicker ────────────────────────────────────────────────────────
export const DateTimePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helpText, className = "", ...rest }, ref) => (
    <TextInput
      ref={ref}
      type="datetime-local"
      label={label}
      error={error}
      helpText={helpText}
      prefixIcon={<Calendar className="w-4 h-4 text-indigo-400" />}
      className={className}
      {...rest}
    />
  )
);
DateTimePicker.displayName = "DateTimePicker";

// ─── DateRangePicker ───────────────────────────────────────────────────────
export interface DateRangePickerProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  onStartChange?: (date: string) => void;
  onEndChange?: (date: string) => void;
  error?: string;
  helpText?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  error,
  helpText,
}) => {
  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="flex items-center gap-2">
        <DatePicker
          value={startDate}
          onChange={(e) => onStartChange?.(e.target.value)}
          placeholder="Start Date"
        />
        <span className="text-slate-500 text-xs font-semibold">to</span>
        <DatePicker
          value={endDate}
          onChange={(e) => onEndChange?.(e.target.value)}
          placeholder="End Date"
        />
      </div>
    </FormField>
  );
};

// ─── AcademicYearPicker ────────────────────────────────────────────────────
export interface AcademicYearPickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
}

const ACADEMIC_YEARS: SelectOption[] = [
  { label: "AY 2024-2025", value: "2024-2025" },
  { label: "AY 2025-2026", value: "2025-2026" },
  { label: "AY 2026-2027 (Current)", value: "2026-2027" },
  { label: "AY 2027-2028", value: "2027-2028" },
];

export const AcademicYearPicker: React.FC<AcademicYearPickerProps> = ({
  label = "Academic Session",
  value = "2026-2027",
  onChange,
  error,
  helpText,
}) => (
  <Select
    label={label}
    options={ACADEMIC_YEARS}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    error={error}
    helpText={helpText}
  />
);

// ─── SemesterPicker ────────────────────────────────────────────────────────
export interface SemesterPickerProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  helpText?: string;
}

const SEMESTERS: SelectOption[] = [
  { label: "Semester I (Fall)", value: 1 },
  { label: "Semester II (Spring)", value: 2 },
  { label: "Semester III (Fall)", value: 3 },
  { label: "Semester IV (Spring)", value: 4 },
  { label: "Semester V (Fall)", value: 5 },
  { label: "Semester VI (Spring)", value: 6 },
  { label: "Semester VII (Fall)", value: 7 },
  { label: "Semester VIII (Spring)", value: 8 },
];

export const SemesterPicker: React.FC<SemesterPickerProps> = ({
  label = "Semester",
  value,
  onChange,
  error,
  helpText,
}) => (
  <Select
    label={label}
    options={SEMESTERS}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    error={error}
    helpText={helpText}
    placeholder="Select Semester..."
  />
);
