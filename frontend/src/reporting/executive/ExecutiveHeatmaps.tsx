import React from "react";
import { HeatMapChart } from "../charts/HeatMapChart";

export const ExecutiveHeatmaps: React.FC = () => {
  return (
    <HeatMapChart
      title="Institutional Activity & Attendance Heatmap"
      subtitle="Weekly class attendance & resource utilization density (%)"
      height={260}
    />
  );
};
