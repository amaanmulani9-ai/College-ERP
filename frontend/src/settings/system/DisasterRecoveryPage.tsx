import React, { useState } from "react";
import { ShieldAlert, Phone, Mail, CheckCircle2 } from "lucide-react";
import { MOCK_RECOVERY_CONTACTS, MOCK_RECOVERY_CHECKLIST } from "./mockSystemData";

export const DisasterRecoveryPage: React.FC = () => {
  const [checklist, setChecklist] = useState(MOCK_RECOVERY_CHECKLIST);

  const toggleStep = (id: string) =>
    setChecklist(checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));

  const completed = checklist.filter((c) => c.done).length;
  const total     = checklist.length;

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-800 rounded-xl">
        <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
        <div>
          <h2 className="text-sm font-bold text-rose-300">Disaster Recovery Plan</h2>
          <p className="text-[11px] text-rose-400/80 mt-0.5">
            Follow this runbook in sequence during a major incident. All steps must be completed and signed off.
          </p>
        </div>
        <div className="ml-auto text-right font-mono">
          <p className="text-xl font-bold text-rose-300">{completed}/{total}</p>
          <p className="text-[10px] text-rose-500">steps complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-rose-600 rounded-full transition-all duration-500"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>

      {/* Recovery Status */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "RTO Target",     value: "< 4 Hours",  color: "text-amber-400" },
          { label: "RPO Target",     value: "< 1 Hour",   color: "text-amber-400" },
          { label: "Last DR Test",   value: "2026-06-15", color: "text-slate-300" },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className={`text-base font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recovery Checklist */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase mb-3">Incident Recovery Checklist</h3>
        {checklist.map((step, idx) => (
          <label
            key={step.id}
            className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
              step.done ? "bg-emerald-950/30 border-emerald-800/60" : "bg-slate-950 border-slate-800 hover:border-slate-700"
            }`}
          >
            <input
              type="checkbox"
              checked={step.done}
              onChange={() => toggleStep(step.id)}
              className="mt-0.5 text-emerald-600 rounded"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-600">{String(idx + 1).padStart(2, "0")}</span>
                <span className={`text-[11px] font-bold ${step.done ? "text-emerald-300 line-through opacity-70" : "text-slate-100"}`}>
                  {step.step}
                </span>
                {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Recovery Contacts */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Emergency Recovery Contacts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MOCK_RECOVERY_CONTACTS.map((c) => (
            <div key={c.email} className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-slate-100 text-[11px]">{c.name}</p>
                <p className="text-[10px] text-slate-500">{c.role}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 transition-colors">
                    <Phone className="w-3 h-3" />{c.phone}
                  </a>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-200 transition-colors">
                    <Mail className="w-3 h-3" />{c.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
