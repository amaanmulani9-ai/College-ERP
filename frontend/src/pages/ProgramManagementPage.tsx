import React, { useEffect, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { academicService, ProgramItem, DepartmentItem } from "../services/academicService";

export const ProgramManagementPage: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ department: "", name: "", code: "", degree_level: "UG", duration_years: 3, total_credits: 120 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pData, dData] = await Promise.all([
        academicService.getPrograms(),
        academicService.getDepartments(),
      ]);
      setPrograms(pData.results || pData);
      setDepartments(dData.results || dData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.createProgram(formData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create program.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Academic Programs (Degree Level)
          </h1>
          <p className="text-xs text-slate-400">Programs such as BSc IT, MSc IT, BCA, MCA, BCom, MBA.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded">
                  {p.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">Dept: {p.department_name}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                <span>{p.duration_years} Years ({p.degree_level})</span>
                <span>{p.total_credits} Credits</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100">Add New Program</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Program Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Bachelor of Science in Information Technology"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="BSc IT"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Create Program
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
