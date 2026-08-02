import React, { useState } from "react";
import { Mail, Save, CheckCircle2 } from "lucide-react";

export const CommunicationSettingsPage: React.FC = () => {
  const [smtp, setSmtp] = useState({
    host: "smtp.sendgrid.net",
    port: 587,
    senderEmail: "notifications@nits.edu",
    senderName: "NITS Academic ERP System",
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
          <Mail className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">SMTP Server & Communication Dispatch Settings</h2>
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
              <span>Save SMTP Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1 font-sans">SMTP Hostname</label>
          <input
            type="text"
            value={smtp.host}
            onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1 font-sans">Sender Email Address</label>
          <input
            type="text"
            value={smtp.senderEmail}
            onChange={(e) => setSmtp({ ...smtp, senderEmail: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
