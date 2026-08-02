import React from "react";

export interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label = "or continue with email" }) => {
  return (
    <div className="relative my-5 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-800" />
      </div>
      <div className="relative bg-slate-900/90 px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};
