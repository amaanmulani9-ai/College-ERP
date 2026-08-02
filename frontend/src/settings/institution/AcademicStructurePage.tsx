import React from "react";
import { GitFork, ChevronRight, Layers } from "lucide-react";

export const AcademicStructurePage: React.FC = () => {
  const levels = [
    "Faculty of Engineering & Technology",
    "School of Computer Science & AI",
    "Department of Artificial Intelligence",
    "Program: B.Tech Computer Science & AI",
    "Batch: 2024-2028 Admission Cohort",
    "Semester: 3rd Semester (Odd)",
    "Section: Section A & Section B",
  ];

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <GitFork className="w-5 h-5 text-indigo-400" />
        <div>
          <h2 className="text-base font-bold text-slate-100">Institutional Academic Structure & Hierarchy</h2>
          <p className="text-slate-400 text-[11px]">Visual organizational hierarchy tree mapping schools, departments, programs, and cohorts.</p>
        </div>
      </div>

      <div className="space-y-2 max-w-xl mx-auto py-4">
        {levels.map((lvl, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200"
            style={{ marginLeft: `${idx * 16}px` }}
          >
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-bold font-sans text-xs">{lvl}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
