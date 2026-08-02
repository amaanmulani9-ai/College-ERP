import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_RADAR_DATA } from "./mockAnalyticsData";

export interface RadarChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data = MOCK_RADAR_DATA,
  ...containerProps
}) => {
  const numSides = data.length;
  const radius = 70;
  const center = 100;

  const getCoordinates = (index: number, valuePct: number) => {
    const angle = (Math.PI * 2 * index) / numSides - Math.PI / 2;
    const r = radius * (valuePct / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return [x, y];
  };

  const points = data
    .map((d, i) => getCoordinates(i, d.value).join(","))
    .join(" ");

  const targetPoints = data
    .map((d, i) => getCoordinates(i, d.target || 80).join(","))
    .join(" ");

  return (
    <ChartContainer {...containerProps}>
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-56 h-56 overflow-visible">
          {/* Concentric Grid Rings */}
          {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
            const gridPts = data
              .map((_, i) => getCoordinates(i, scale * 100).join(","))
              .join(" ");
            return (
              <polygon
                key={sIdx}
                points={gridPts}
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.5"
              />
            );
          })}

          {/* Axes Lines */}
          {data.map((d, i) => {
            const [x, y] = getCoordinates(i, 100);
            return (
              <g key={i}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y < center ? y - 6 : y + 10}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="7"
                  fontFamily="sans-serif"
                >
                  {d.label.substring(0, 10)}
                </text>
              </g>
            );
          })}

          {/* Target Polygon */}
          <polygon
            points={targetPoints}
            fill="#06b6d4"
            fillOpacity="0.15"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Actual Polygon */}
          <polygon
            points={points}
            fill="#6366f1"
            fillOpacity="0.35"
            stroke="#6366f1"
            strokeWidth="2"
          />
        </svg>
      </div>
    </ChartContainer>
  );
};
