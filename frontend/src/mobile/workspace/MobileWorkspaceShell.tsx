import React, { useState } from "react";
import { MobileWorkspaceHeader } from "./MobileWorkspaceHeader";
import { MobileWorkspaceTabs } from "./MobileWorkspaceTabs";
import { MobileWorkspaceHome } from "./MobileWorkspaceHome";
import { MobileWorkspaceDrawer } from "./MobileWorkspaceDrawer";
import { MobileWorkspaceSearch } from "./MobileWorkspaceSearch";
import { MobileWorkspaceNotifications } from "./MobileWorkspaceNotifications";
import { MobileWorkspaceProfile } from "./MobileWorkspaceProfile";
import { MobileWorkspaceAI } from "./MobileWorkspaceAI";

export const MobileWorkspaceShell: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Sticky Mobile Workspace Header */}
      <MobileWorkspaceHeader
        onOpenDrawer={() => setShowDrawer(true)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenAI={() => setShowAI(true)}
        onOpenQuickCreate={() => setShowAI(true)}
        onOpenNotifications={() => setShowNotifs(true)}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Workspace Tabs */}
      <MobileWorkspaceTabs />

      {/* Main Workspace Body */}
      <main className="flex-1 p-3 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {showNotifs ? (
          <MobileWorkspaceNotifications onClose={() => setShowNotifs(false)} />
        ) : showProfile ? (
          <MobileWorkspaceProfile onClose={() => setShowProfile(false)} />
        ) : showAI ? (
          <MobileWorkspaceAI />
        ) : (
          <MobileWorkspaceHome />
        )}
      </main>

      {/* Modals & Overlays */}
      <MobileWorkspaceDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
      {showSearch && <MobileWorkspaceSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
};

export default MobileWorkspaceShell;
