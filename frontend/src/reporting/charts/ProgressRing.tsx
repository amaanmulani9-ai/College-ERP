import React from "react";

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = "#6366f1",
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-bold font-mono text-slate-100">{value}%</span>
        {label && <span className="text-[9px] text-slate-400 font-medium">{label}</span>}
      </div>
    </div>
  );
};
