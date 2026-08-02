import React, { useState } from "react";
import { Lock, Save, CheckCircle2 } from "lucide-react";

export const AuthenticationSettingsPage: React.FC = () => {
  const [sso, setSso] = useState({
    samlEnabled: true,
    googleOAuth: true,
    microsoftEntra: true,
    passwordResetMail: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Single Sign-On (SSO) & Authentication Providers</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <h4 className="font-bold text-slate-100 font-sans">SAML 2.0 Enterprise SSO Provider</h4>
            <p className="text-slate-400 text-[11px] font-sans">Shibboleth / Okta identity provider integration.</p>
          </div>
          <input
            type="checkbox"
            checked={sso.samlEnabled}
            onChange={(e) => setSso({ ...sso, samlEnabled: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <h4 className="font-bold text-slate-100 font-sans">Google Workspace OAuth 2.0 Login</h4>
            <p className="text-slate-400 text-[11px] font-sans">Allow login via @nits.edu institutional Google accounts.</p>
          </div>
          <input
            type="checkbox"
            checked={sso.googleOAuth}
            onChange={(e) => setSso({ ...sso, googleOAuth: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
