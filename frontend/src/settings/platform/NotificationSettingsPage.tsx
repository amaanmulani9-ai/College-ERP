import React, { useState } from "react";
import { Bell, Save, CheckCircle2 } from "lucide-react";

export const NotificationSettingsPage: React.FC = () => {
  const [notif, setNotif] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    aiDigest: true,
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
          <Bell className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Multi-Channel Notification Dispatch Center</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Channels</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <h4 className="font-bold text-slate-100 font-sans">Automated Email Alerts</h4>
            <p className="text-slate-400 text-[11px] font-sans">Dispatch fee receipts, grades, & schedule changes via SMTP.</p>
          </div>
          <input
            type="checkbox"
            checked={notif.emailAlerts}
            onChange={(e) => setNotif({ ...notif, emailAlerts: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
