import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
  accentColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <div className="p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-400 shadow-inner">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      {change && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
          {isPositive ? (
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> {change}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-red-400 font-bold">
              <TrendingDown className="w-3.5 h-3.5" /> {change}
            </span>
          )}
          <span className="text-slate-500">vs last term</span>
        </div>
      )}
    </motion.div>
  );
};
