import React, { useState } from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { SeriesData } from "./types";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import { MOCK_LINE_SERIES } from "./mockAnalyticsData";

export interface LineChartProps extends Omit<ChartContainerProps, "children"> {
  series?: SeriesData[];
}

export const LineChart: React.FC<LineChartProps> = ({
  series = MOCK_LINE_SERIES,
  ...containerProps
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesName: string;
    label: string;
    value: number;
    color: string;
  } | null>(null);

  const [activeSeries, setActiveSeries] = useState<string[]>(
    series.map((s) => s.id)
  );

  const toggleSeries = (id: string) => {
    setActiveSeries((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const visibleSeries = series.filter((s) => activeSeries.includes(s.id));
  const allPoints = visibleSeries.flatMap((s) => s.data);
  const maxValue = Math.max(...allPoints.map((p) => p.value), 100);
  const labels = series[0]?.data.map((d) => d.label) || [];

  const width = 500;
  const height = 200;
  const padding = 30;

  return (
    <ChartContainer {...containerProps}>
      <div className="flex flex-col justify-between w-full h-full">
        {/* SVG Canvas */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => (
              <line
                key={idx}
                x1={padding}
                y1={padding + (height - padding * 2) * pct}
                x2={width - padding}
                y2={padding + (height - padding * 2) * pct}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.4"
              />
            ))}

            {/* Render Series Lines */}
            {visibleSeries.map((s) => {
              const pointsStr = s.data
                .map((d, i) => {
                  const x = padding + (i / (labels.length - 1)) * (width - padding * 2);
                  const y = height - padding - (d.value / maxValue) * (height - padding * 2);
                  return `${x},${y}`;
                })
                .join(" ");

              return (
                <g key={s.id}>
                  <polyline
                    fill="none"
                    stroke={s.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsStr}
                    className="transition-all duration-300"
                  />
                  {s.data.map((d, i) => {
                    const x = padding + (i / (labels.length - 1)) * (width - padding * 2);
                    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={s.color}
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            seriesName: s.name,
                            label: d.label,
                            value: d.value,
                            color: s.color,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* X Axis Labels */}
            {labels.map((lbl, i) => {
              const x = padding + (i / (labels.length - 1)) * (width - padding * 2);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {lbl}
                </text>
              );
            })}
          </svg>

          {hoveredPoint && (
            <ChartTooltip
              title={hoveredPoint.label}
              items={[
                {
                  label: hoveredPoint.seriesName,
                  value: hoveredPoint.value,
                  color: hoveredPoint.color,
                },
              ]}
            />
          )}
        </div>

        {/* Legend Footer */}
        <ChartLegend
          items={series.map((s) => ({
            id: s.id,
            name: s.name,
            color: s.color,
            hidden: !activeSeries.includes(s.id),
          }))}
          onToggleItem={toggleSeries}
          className="mt-2"
        />
      </div>
    </ChartContainer>
  );
};
