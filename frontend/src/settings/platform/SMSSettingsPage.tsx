import React, { useState } from "react";
import { MessageSquare, Save, CheckCircle2 } from "lucide-react";

export const SMSSettingsPage: React.FC = () => {
  const [twilio, setTwilio] = useState({
    accountSid: "AC_live_998877665544332211",
    authToken: "••••••••••••••••••••••••",
    senderNumber: "+1 (800) 555-NITS",
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
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Twilio & MSG91 SMS Gateway Credentials</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Gateway Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Gateway</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Twilio Account SID</label>
          <input
            type="text"
            value={twilio.accountSid}
            onChange={(e) => setTwilio({ ...twilio, accountSid: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Sender Phone / ID</label>
          <input
            type="text"
            value={twilio.senderNumber}
            onChange={(e) => setTwilio({ ...twilio, senderNumber: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
};
