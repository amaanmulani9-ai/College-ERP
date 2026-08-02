import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";

export interface GaugeChartProps extends Omit<ChartContainerProps, "children"> {
  value?: number; // 0 to 100
  label?: string;
  min?: number;
  max?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 84,
  label = "Target Achievement",
  min = 0,
  max = 100,
  ...containerProps
}) => {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const angle = percentage * 180 - 90; // -90 to +90 deg

  return (
    <ChartContainer {...containerProps}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#6366f1"
              strokeWidth="10"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 * (1 - percentage)}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* Needle */}
            <line
              x1="50"
              y1="50"
              x2={50 + 35 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 35 * Math.sin((angle * Math.PI) / 180)}
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="4" fill="#06b6d4" />
          </svg>
        </div>

        <div className="text-center mt-2">
          <span className="text-2xl font-bold font-mono text-slate-100">{value}%</span>
          <p className="text-xs text-slate-400 font-medium">{label}</p>
        </div>
      </div>
    </ChartContainer>
  );
};
