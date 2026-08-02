import React from "react";
import { FinalQAProvider } from "./FinalQAProvider";
import { ReleaseReadiness } from "./ReleaseReadiness";
import { ConsistencyInspector } from "./ConsistencyInspector";
import { DesignAuditPanel } from "./DesignAuditPanel";
import { ProductionChecklist } from "./ProductionChecklist";
import { ReleaseNotes, VersionInfo, BuildInformation, DependencyStatus, QualityMetrics, DocumentationCenter } from "./ReleaseNotes";

export const FinalCenter: React.FC = () => {
  return (
    <FinalQAProvider>
      <div className="space-y-4 max-w-6xl mx-auto w-full p-4 sm:p-6 font-sans text-xs select-none">
        <ReleaseReadiness />
        <ConsistencyInspector />
        <DesignAuditPanel />
        <ProductionChecklist />
        <QualityMetrics />
        <ReleaseNotes />
        <DocumentationCenter />
      </div>
    </FinalQAProvider>
  );
};
