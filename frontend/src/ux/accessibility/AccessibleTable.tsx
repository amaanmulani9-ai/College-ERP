import React, { ReactNode } from "react";
import { ACCESSIBILITY_TOKENS } from "./accessibilityTokens";

export const AccessibleTable: React.FC<{
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}> = ({ caption, headers, rows }) => (
  <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900 font-sans text-xs select-none">
    <table className="w-full text-left border-collapse">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-slate-800 bg-slate-950 font-mono text-[10px] text-slate-400">
          {headers.map((h, i) => (
            <th key={i} scope="col" className="p-3 font-bold uppercase">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60">
        {rows.map((row, rIdx) => (
          <tr key={rIdx} className="hover:bg-slate-950/60 transition-colors">
            {row.map((cell, cIdx) => (
              <td key={cIdx} className="p-3 text-[11px] text-slate-200">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const AccessibleForm: React.FC<{
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, id, type = "text", placeholder, error, value, onChange }) => (
  <div className="space-y-1 font-sans text-xs select-none">
    <label htmlFor={id} className="block font-bold text-slate-200 text-[11px]">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-[11px] text-slate-200 placeholder-slate-500 ${
        error ? "border-rose-500" : "border-slate-700"
      } ${ACCESSIBILITY_TOKENS.focusRing.standard}`}
    />
    {error && (
      <p id={`${id}-error`} className="text-[9px] font-mono text-rose-400 font-bold">
        {error}
      </p>
    )}
  </div>
);
