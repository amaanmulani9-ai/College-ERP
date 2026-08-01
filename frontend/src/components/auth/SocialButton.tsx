import React from "react";

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "Google" | "Microsoft";
  icon: React.ReactNode;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, icon, className = "", ...props }) => {
  return (
    <button
      type="button"
      className={`w-full py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-1 focus:ring-slate-700 ${className}`}
      {...props}
    >
      {icon}
      <span>Continue with {provider}</span>
    </button>
  );
};
