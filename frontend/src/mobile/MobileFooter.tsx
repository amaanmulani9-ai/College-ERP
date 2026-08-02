import React from "react";
import { Shield, Smartphone, Heart } from "lucide-react";

export const MobileFooter: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 px-4 py-4 text-center text-slate-500 text-[10px] font-sans space-y-2 select-none">
      <div className="flex items-center justify-center gap-4 text-slate-400 font-semibold text-[11px]">
        <span className="hover:text-slate-200 cursor-pointer transition-colors">Privacy</span>
        <span>·</span>
        <span className="hover:text-slate-200 cursor-pointer transition-colors">Terms</span>
        <span>·</span>
        <span className="hover:text-slate-200 cursor-pointer transition-colors">Support</span>
        <span>·</span>
        <span className="hover:text-slate-200 cursor-pointer transition-colors">Status</span>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-slate-600">
        <Smartphone className="w-3.5 h-3.5" />
        <span>NITS Mobile Engine v0.35.0</span>
        <span>·</span>
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>256-Bit Encrypted</span>
      </div>

      <p className="text-slate-600 font-mono">
        © 2026 National Institute of Technology & Science · All rights reserved
      </p>
    </footer>
  );
};
