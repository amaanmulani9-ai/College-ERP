import React, { useState } from "react";
import { Webhook, Plus } from "lucide-react";
import { WebhookEndpointItem } from "./types";
import { MOCK_WEBHOOKS } from "./mockPlatformData";

export const WebhookManagementPage: React.FC = () => {
  const [webhooks] = useState<WebhookEndpointItem[]>(MOCK_WEBHOOKS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Webhook className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Incoming & Outgoing Webhook Endpoint Registry</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors">
          <Plus className="w-4 h-4" />
          <span>Register Webhook</span>
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {webhooks.map((wh) => (
          <div key={wh.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                  wh.direction === "Incoming"
                    ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                    : "bg-cyan-950 text-cyan-300 border-cyan-800"
                }`}
              >
                {wh.direction} Webhook
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                  wh.status === "Active"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : "bg-rose-950 text-rose-300 border-rose-800"
                }`}
              >
                {wh.status}
              </span>
            </div>
            <p className="text-indigo-400 font-bold text-[11px] truncate">{wh.url}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {wh.events.map((evt) => (
                <span key={evt} className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {evt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
