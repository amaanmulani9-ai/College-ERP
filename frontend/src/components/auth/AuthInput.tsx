import React from "react";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  error,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || `auth-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-3 text-xs bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-red-400 font-medium pt-0.5">{error}</p>}
    </div>
  );
};
