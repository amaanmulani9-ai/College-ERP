import React, { useEffect, useState } from "react";
import { Layers, Plus } from "lucide-react";
import { academicService, SemesterItem, ProgramItem } from "../services/academicService";

export const SemesterManagementPage: React.FC = () => {
  const [semesters, setSemesters] = useState<SemesterItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sData, pData] = await Promise.all([
        academicService.getSemesters(),
        academicService.getPrograms(),
      ]);
      setSemesters(sData.results || sData);
      setPrograms(pData.results || pData);
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
          <Layers className="w-6 h-6 text-indigo-400" />
          Semester Structure Management
        </h1>
        <p className="text-xs text-slate-400">Sequential terms per academic program.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading semesters...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Semester Name</th>
                <th className="p-3.5">Program</th>
                <th className="p-3.5">Term Number</th>
                <th className="p-3.5">Credits</th>
                <th className="p-3.5">Subjects Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {semesters.map((sem) => (
                <tr key={sem.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-200">{sem.name}</td>
                  <td className="p-3.5 text-indigo-400">{sem.program_name}</td>
                  <td className="p-3.5 font-mono">Term #{sem.semester_number}</td>
                  <td className="p-3.5">{sem.credits} Credits</td>
                  <td className="p-3.5">{sem.subjects_count || 0} Subjects</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
