import React, { useState } from "react";
import { ChevronDown, ChevronRight, LayoutGrid, CheckCircle2, Clock, FileText } from "lucide-react";

interface WidgetItem {
  id: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

export const MobileWidgetGrid: React.FC = () => {
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const WIDGETS: WidgetItem[] = [
    {
      id: "tasks",
      title: "My Pending Approval Tasks",
      badge: "3 Due Today",
      content: (
        <div className="space-y-1.5 pt-2">
          {[
            { title: "Approve Faculty Leave Request #841", status: "High Priority", color: "text-rose-400" },
            { title: "Verify Scholarship Documents #402", status: "Medium Priority", color: "text-amber-400" },
            { title: "Publish Semester Results (CS-Sem6)", status: "Normal", color: "text-emerald-400" },
          ].map((t, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl">
              <div>
                <p className="font-bold text-slate-200 text-[11px]">{t.title}</p>
                <span className={`text-[9px] font-mono font-bold ${t.color}`}>{t.status}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-slate-600 hover:text-emerald-400 cursor-pointer transition-colors shrink-0" />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "schedule",
      title: "Today's Schedule & Slots",
      badge: "4 Slots Remaining",
      content: (
        <div className="space-y-1.5 pt-2">
          {[
            { time: "10:00 - 11:30 AM", event: "Data Structures & Algos (CS-A)", room: "Lab 3" },
            { time: "01:30 - 03:00 PM", event: "Academic Council Board Meeting", room: "Conf Room 2" },
            { time: "03:30 - 05:00 PM", event: "Office Hours & Student Counseling", room: "Office 104" },
          ].map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl">
              <div>
                <p className="font-bold text-slate-200 text-[11px]">{s.event}</p>
                <p className="text-[9px] font-mono text-slate-400">{s.time} · <span className="text-indigo-400">{s.room}</span></p>
              </div>
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3 font-sans text-xs select-none">
      {WIDGETS.map((w) => {
        const isCol = collapsed.includes(w.id);
        return (
          <div key={w.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div
              onClick={() => toggleCollapse(w.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-xs">{w.title}</h3>
                {w.badge && (
                  <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded">
                    {w.badge}
                  </span>
                )}
              </div>
              {isCol ? <ChevronRight className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </div>

            {!isCol && w.content}
          </div>
        );
      })}
    </div>
  );
};
