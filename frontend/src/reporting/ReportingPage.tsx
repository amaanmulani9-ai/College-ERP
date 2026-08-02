import React from "react";
import { ReportingProvider } from "./ReportingProvider";
import { ReportingLayout } from "./ReportingLayout";

export const ReportingPage: React.FC = () => {
  return (
    <ReportingProvider>
      <ReportingLayout />
    </ReportingProvider>
  );
};

export default ReportingPage;
