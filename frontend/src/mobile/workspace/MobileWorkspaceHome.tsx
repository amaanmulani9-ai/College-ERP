import React from "react";
import { MobileWorkspaceRecents } from "./MobileWorkspaceRecents";
import { MobileWorkspaceQuickLauncher } from "./MobileWorkspaceQuickLauncher";
import { MobileWorkspaceFavorites } from "./MobileWorkspaceFavorites";
import { MobileWorkspaceAI } from "./MobileWorkspaceAI";
import { MobileWorkspaceNotifications } from "./MobileWorkspaceNotifications";

export const MobileWorkspaceHome: React.FC = () => {
  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Quick Launcher Grid */}
      <MobileWorkspaceQuickLauncher />

      {/* Recents / Continue Working */}
      <MobileWorkspaceRecents />

      {/* Pinned & Favorites */}
      <MobileWorkspaceFavorites />

      {/* AI Assistant Widget */}
      <MobileWorkspaceAI />

      {/* Notifications Widget */}
      <MobileWorkspaceNotifications />
    </div>
  );
};
