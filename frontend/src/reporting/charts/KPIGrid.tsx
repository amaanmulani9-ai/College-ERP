import React from "react";
import { KPIMetric } from "./types";
import { KPITrendCard } from "./KPITrendCard";
import { MOCK_EXECUTIVE_KPIS } from "./mockAnalyticsData";

interface KPIGridProps {
  metrics?: KPIMetric[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics = MOCK_EXECUTIVE_KPIS }) => {
  return (
    <div
      role="region"
      aria-label="Executive KPI Grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
    >
      {metrics.map((metric) => (
        <KPITrendCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};
