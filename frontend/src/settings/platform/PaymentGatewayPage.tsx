import React, { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { PaymentGatewayConfig } from "./types";
import { MOCK_PAYMENT_GATEWAYS } from "./mockPlatformData";

export const PaymentGatewayPage: React.FC = () => {
  const [gateways] = useState<PaymentGatewayConfig[]>(MOCK_PAYMENT_GATEWAYS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Payment Gateway Integrations (Razorpay / Stripe)</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Gateway</span>
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {gateways.map((gw) => (
          <div key={gw.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    gw.mode === "Production"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {gw.mode} Mode
                </span>
                <h3 className="font-bold text-slate-100 text-sm font-sans">{gw.name}</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">API Key: {gw.apiKey}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 uppercase">
                {gw.webhookStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
