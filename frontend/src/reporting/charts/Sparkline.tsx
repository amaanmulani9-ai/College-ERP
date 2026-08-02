import React from "react";

export interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  isPositive?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [10, 15, 12, 18, 22, 28, 25, 32],
  color = "#6366f1",
  width = 100,
  height = 30,
  isPositive = true,
}) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const strokeColor = isPositive ? color : "#f43f5e";

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
