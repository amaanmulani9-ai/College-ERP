import React, { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { CourseItem } from "./types";
import { MOCK_COURSES } from "./mockInstitutionData";

export const CourseConfigurationPage: React.FC = () => {
  const [courses] = useState<CourseItem[]>(MOCK_COURSES);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Course Syllabus & Credit Configuration</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Course Code</th>
              <th className="p-3">Title</th>
              <th className="p-3">Department</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Theory/Lab Split</th>
              <th className="p-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-slate-850">
                <td className="p-3 font-bold text-indigo-400">{c.code}</td>
                <td className="p-3 font-sans font-bold text-slate-100">{c.name}</td>
                <td className="p-3 text-slate-400 font-sans">{c.department}</td>
                <td className="p-3 text-slate-200">{c.credits} Credits</td>
                <td className="p-3 text-slate-400">{c.theoryLabSplit}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold uppercase">
                    {c.type}
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
