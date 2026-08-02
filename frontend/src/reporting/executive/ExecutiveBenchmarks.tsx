import React from "react";
import { RadarChart } from "../charts/RadarChart";

export const ExecutiveBenchmarks: React.FC = () => {
  return (
    <RadarChart
      title="National Accreditation & Peer Benchmark Index"
      subtitle="Evaluating institutional scores against NIRF & NAAC A++ standards"
      height={260}
    />
  );
};
