import React, { useState } from "react";
import { useSettings } from "./SettingsContext";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsToolbar } from "./SettingsToolbar";
import { SettingsBreadcrumbs } from "./SettingsBreadcrumbs";
import { SettingsHome } from "./SettingsHome";
import { SettingsSearch } from "./SettingsSearch";
import { SettingPageItem } from "./types";
import { useTabs } from "../workspace/TabContext";
import { ArrowLeft, Save, Sliders, CheckCircle2 } from "lucide-react";

export const SettingsLayoutContent: React.FC = () => {
  const { selectedPage, setSelectedPage } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Workspace integration
  let openTabAction: ((tab: { title: string; route: string; iconName?: string }) => void) | null = null;
  try {
    const tabsCtx = useTabs();
    if (tabsCtx && tabsCtx.openTab) {
      openTabAction = tabsCtx.openTab;
    }
  } catch (_e) {
    openTabAction = null;
  }

  const handleSaveSetting = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Category Sidebar */}
      <SettingsSidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 overflow-y-auto">
        <SettingsBreadcrumbs />

        <SettingsToolbar
          onOpenSearchModal={() => setIsSearchOpen(true)}
          onOpenInWorkspace={
            openTabAction
              ? () =>
                  openTabAction!({
                    title: selectedPage ? selectedPage.title : "Settings Hub",
                    route: selectedPage ? selectedPage.route : "/settings",
                    iconName: "Sliders",
                  })
              : undefined
          }
        />

        {/* Dynamic View: Settings Home Dashboard vs Active Setting Item Configuration View */}
        {selectedPage ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPage(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  title="Back to Settings Home"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800 uppercase">
                      {selectedPage.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{selectedPage.code}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 mt-0.5">{selectedPage.title}</h2>
                  <p className="text-xs text-slate-400">{selectedPage.description}</p>
                </div>
              </div>

              <button
                onClick={handleSaveSetting}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Configuration Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </div>

            {/* Config Form Placeholder View */}
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4 text-xs font-sans">
              <h3 className="text-xs font-bold text-slate-200 uppercase font-mono border-b border-slate-800 pb-2">
                Active Configuration Form Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Configuration Status
                  </label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono">
                    <option value="enabled">Enabled (Active Production)</option>
                    <option value="disabled">Disabled (Maintenance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Admin Approval Requirement
                  </label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono">
                    <option value="strict">Strict Dual-Factor Approval</option>
                    <option value="standard">Standard Single Approval</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Configuration Log Notes & Audit Comments
                </label>
                <textarea
                  rows={3}
                  defaultValue={`Updated parameters for ${selectedPage.title} on ${new Date().toLocaleDateString()}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs font-sans"
                />
              </div>
            </div>
          </div>
        ) : (
          <SettingsHome onSelectSetting={setSelectedPage} />
        )}
      </div>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <SettingsSearch
          onClose={() => setIsSearchOpen(false)}
          onSelectSetting={setSelectedPage}
        />
      )}
    </div>
  );
};

export const SettingsLayout: React.FC = () => {
  return <SettingsLayoutContent />;
};
