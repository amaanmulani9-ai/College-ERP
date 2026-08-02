import React from "react";
import { History, CheckCircle2, AlertCircle, Clock, FileText } from "lucide-react";
import { DeliveryHistoryItem } from "./types";
import { MOCK_DELIVERY_HISTORY } from "./mockDistributionData";

interface DeliveryHistoryProps {
  history?: DeliveryHistoryItem[];
}

export const DeliveryHistory: React.FC<DeliveryHistoryProps> = ({
  history = MOCK_DELIVERY_HISTORY,
}) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Report Distribution & Delivery Audit Logs ({history.length})
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Report Title</th>
              <th className="p-3">Delivered At</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Format</th>
              <th className="p-3">Recipients</th>
              <th className="p-3">File Size</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-850">
                <td className="p-3 font-sans font-bold text-slate-200">{h.reportTitle}</td>
                <td className="p-3 text-slate-400">{h.deliveredAt}</td>
                <td className="p-3 capitalize text-indigo-400">{h.channel.replace("-", " ")}</td>
                <td className="p-3 uppercase text-amber-400">{h.format}</td>
                <td className="p-3 text-slate-300">{h.recipientCount} users</td>
                <td className="p-3 font-bold text-slate-300">{h.fileSize}</td>
                <td className="p-3">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                      h.status === "success"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-rose-950 text-rose-300 border border-rose-800"
                    }`}
                  >
                    {h.status === "success" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                    )}
                    <span>{h.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
