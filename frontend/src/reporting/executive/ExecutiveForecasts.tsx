import React from "react";
import { AreaChart } from "../charts/AreaChart";

export const ExecutiveForecasts: React.FC = () => {
  return (
    <AreaChart
      title="Predictive AI Enrollment & Revenue Forecast (Q4 2026 - Q2 2027)"
      subtitle="Monte-Carlo predictive modeling based on historical 5-year ERP trends"
      height={260}
    />
  );
};
