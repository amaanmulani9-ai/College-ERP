import React, { useState } from "react";
import { LifeBuoy, Plus } from "lucide-react";
import { SupportTicket } from "./types";
import { MOCK_SUPPORT_TICKETS } from "./mockSystemData";

const priorityStyle: Record<SupportTicket["priority"], string> = {
  Critical: "bg-rose-950 text-rose-300 border-rose-800",
  High: "bg-amber-950 text-amber-300 border-amber-800",
  Medium: "bg-blue-950 text-blue-300 border-blue-800",
  Low: "bg-slate-800 text-slate-400 border-slate-700",
};

const statusStyle: Record<SupportTicket["status"], string> = {
  "Open": "bg-amber-950 text-amber-300 border-amber-800",
  "In Progress": "bg-indigo-950 text-indigo-300 border-indigo-800",
  "Resolved": "bg-emerald-950 text-emerald-300 border-emerald-800",
  "Closed": "bg-slate-800 text-slate-400 border-slate-700",
};

export const SupportCenterPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const filters = ["All", "Open", "In Progress", "Resolved", "Closed"];

  const filtered =
    activeFilter === "All"
      ? MOCK_SUPPORT_TICKETS
      : MOCK_SUPPORT_TICKETS.filter((t) => t.status === activeFilter);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Platform Support Center & Incident Ticket Tracker</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors">
          <Plus className="w-4 h-4" />
          <span>Raise Ticket</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Open", val: MOCK_SUPPORT_TICKETS.filter((t) => t.status === "Open").length, color: "text-amber-400" },
          { label: "In Progress", val: MOCK_SUPPORT_TICKETS.filter((t) => t.status === "In Progress").length, color: "text-indigo-400" },
          { label: "Resolved", val: MOCK_SUPPORT_TICKETS.filter((t) => t.status === "Resolved").length, color: "text-emerald-400" },
          { label: "Critical", val: MOCK_SUPPORT_TICKETS.filter((t) => t.priority === "Critical").length, color: "text-rose-400" },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
              activeFilter === f ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-2 font-mono">
        {filtered.map((ticket) => (
          <div key={ticket.id} className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors cursor-pointer">
            <code className="text-indigo-400 font-bold text-[10px] whitespace-nowrap">{ticket.id}</code>
            <p className="flex-1 text-slate-200 text-[11px] font-bold font-sans truncate">{ticket.title}</p>
            <span className="text-slate-500 text-[10px] whitespace-nowrap">{ticket.assignedTo}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${priorityStyle[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusStyle[ticket.status]}`}>
              {ticket.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
