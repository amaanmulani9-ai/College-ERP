import React, { useState } from "react";
import { Palette, Save, CheckCircle2 } from "lucide-react";
import { MOCK_BRANDING_CONFIG } from "./mockPlatformData";

export const BrandingPage: React.FC = () => {
  const [branding, setBranding] = useState(MOCK_BRANDING_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">Institutional Branding & Logo Assets</h2>
            <p className="text-slate-400 text-[11px]">Primary logos, favicons, custom CSS, and brand palette tokens.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Branding Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Branding</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Primary Color (Hex)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer"
            />
            <input
              type="text"
              value={branding.primaryColor}
              onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Secondary Color (Hex)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.secondaryColor}
              onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer"
            />
            <input
              type="text"
              value={branding.secondaryColor}
              onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Accent Color (Hex)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.accentColor}
              onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer"
            />
            <input
              type="text"
              value={branding.accentColor}
              onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono font-bold"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Custom CSS Overrides</label>
        <textarea
          rows={4}
          value={branding.customCSS}
          onChange={(e) => setBranding({ ...branding, customCSS: e.target.value })}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs font-mono"
        />
      </div>
    </div>
  );
};
