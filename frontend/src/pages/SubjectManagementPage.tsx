import React, { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { academicService, SubjectItem } from "../services/academicService";

export const SubjectManagementPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await academicService.getSubjects();
      setSubjects(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" />
          Course Subjects Catalog
        </h1>
        <p className="text-xs text-slate-400">Curriculum subjects, credit allocation & marks distribution.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading subjects...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Subject Name</th>
                <th className="p-3.5">Semester</th>
                <th className="p-3.5">Credits</th>
                <th className="p-3.5">Theory / Practical</th>
                <th className="p-3.5">Marks (Int / Ext)</th>
                <th className="p-3.5">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-indigo-400 font-bold">{sub.code}</td>
                  <td className="p-3.5 font-semibold text-slate-200">{sub.name}</td>
                  <td className="p-3.5">{sub.semester_name} ({sub.program_name})</td>
                  <td className="p-3.5">{sub.credits} CR</td>
                  <td className="p-3.5">{sub.theory_hours}h / {sub.practical_hours}h</td>
                  <td className="p-3.5">{sub.internal_marks} / {sub.external_marks} (Min: {sub.passing_marks})</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${sub.is_elective ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      {sub.is_elective ? "Elective" : "Core"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
