import React, { ReactNode } from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNavigation } from "./MobileBottomNavigation";
import { MobileDrawer } from "./MobileDrawer";
import { MobileSidebar } from "./MobileSidebar";
import { MobileFooter } from "./MobileFooter";
import { MobileFloatingActionButton } from "./MobileFloatingActionButton";
import { PWAInstallBanner } from "./PWAInstallBanner";
import { useResponsive } from "./ResponsiveContext";

interface MobileLayoutProps {
  children?: ReactNode;
  title?: string;
  showFAB?: boolean;
}

export const MobileLayoutContent: React.FC<MobileLayoutProps> = ({
  children,
  showFAB = true,
}) => {
  const { device } = useResponsive();

  return (
    <div className="flex h-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Rail (Tablet & Desktop landscape) */}
      <MobileSidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-0">
        {/* Sticky Mobile Header */}
        <MobileHeader />

        {/* PWA Banner & Network Status */}
        <div className="p-2 sm:p-4">
          <PWAInstallBanner />
        </div>

        {/* Dynamic Main Viewport */}
        <main className="flex-1 p-3 sm:p-6 space-y-4 max-w-5xl mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <MobileFooter />
      </div>

      {/* Drawer Overlay */}
      <MobileDrawer />

      {/* Speed Dial FAB */}
      {showFAB && <MobileFloatingActionButton />}

      {/* Fixed Bottom Navigation (Phone / Mobile viewports) */}
      <MobileBottomNavigation />
    </div>
  );
};

export const MobileLayout: React.FC<MobileLayoutProps> = (props) => {
  return <MobileLayoutContent {...props} />;
};
