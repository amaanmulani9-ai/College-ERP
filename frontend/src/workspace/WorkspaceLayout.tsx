import React from "react";
import { WorkspaceProvider } from "./WorkspaceContext";
import { TabProvider } from "./TabContext";
import { WorkspaceShell } from "./WorkspaceShell";

interface WorkspaceLayoutProps {
  children?: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ children }) => {
  return (
    <WorkspaceProvider>
      <TabProvider>
        <WorkspaceShell>{children}</WorkspaceShell>
      </TabProvider>
    </WorkspaceProvider>
  );
};
