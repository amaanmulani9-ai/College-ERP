import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = "Password",
  error,
  id,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || "auth-password-input";

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          className={`w-full pl-10 pr-10 py-3 text-xs bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          } ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-400 font-medium pt-0.5">{error}</p>}
    </div>
  );
};
