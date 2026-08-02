import React, { useState } from "react";
import { FormField } from "./FormField";
import { X, Star, Bold, Italic, List, Link as LinkIcon } from "lucide-react";

// ─── TagInput / ChipInput ──────────────────────────────────────────────────
export interface TagInputProps {
  label?: string;
  tags?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags = [],
  onChange,
  placeholder = "Add a tag and press Enter...",
  error,
  helpText,
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange?.([...tags, trimmed]);
        setInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange?.(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="min-h-9.5 p-2 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center gap-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-indigo-950/90 border border-indigo-800 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-lg"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-[120px]"
        />
      </div>
    </FormField>
  );
};

export const ChipInput = TagInput;

// ─── ColorPicker ───────────────────────────────────────────────────────────
export interface ColorPickerProps {
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  error?: string;
  helpText?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value = "#6366f1",
  onChange,
  error,
  helpText,
}) => {
  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-28 h-9.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
    </FormField>
  );
};

// ─── Rating ────────────────────────────────────────────────────────────────
export interface RatingProps {
  label?: string;
  max?: number;
  value?: number;
  onChange?: (rating: number) => void;
  error?: string;
  helpText?: string;
}

export const Rating: React.FC<RatingProps> = ({
  label,
  max = 5,
  value = 0,
  onChange,
  error,
  helpText,
}) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, idx) => {
          const starVal = idx + 1;
          const isFilled = (hover ?? value) >= starVal;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHover(starVal)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange?.(starVal)}
              className="p-1 text-amber-400 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-5 h-5 ${isFilled ? "fill-amber-400" : "text-slate-700"}`}
              />
            </button>
          );
        })}
      </div>
    </FormField>
  );
};

// ─── Slider ────────────────────────────────────────────────────────────────
export interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  error?: string;
  helpText?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  onChange,
  error,
  helpText,
}) => {
  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="flex items-center gap-3 w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
        />
        <span className="text-xs font-mono font-bold text-indigo-400 w-10 text-right shrink-0">
          {value}
        </span>
      </div>
    </FormField>
  );
};

// ─── RichTextEditor (Placeholder) ──────────────────────────────────────────
export interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (html: string) => void;
  error?: string;
  helpText?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value = "",
  onChange,
  error,
  helpText,
  placeholder = "Write content here...",
}) => {
  return (
    <FormField label={label} error={error} helpText={helpText}>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-2 border-b border-slate-800 bg-slate-950 flex items-center gap-1 text-slate-400">
          <button type="button" className="p-1.5 hover:text-white rounded hover:bg-slate-900">
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 hover:text-white rounded hover:bg-slate-900">
            <Italic className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 hover:text-white rounded hover:bg-slate-900">
            <List className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 hover:text-white rounded hover:bg-slate-900">
            <LinkIcon className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-600 font-mono ml-auto">Rich Text Editor v1</span>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full p-3 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-y"
        />
      </div>
    </FormField>
  );
};
