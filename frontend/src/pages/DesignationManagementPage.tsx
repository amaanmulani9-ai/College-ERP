import React, { useEffect, useState } from "react";
import { Award, Plus } from "lucide-react";
import { staffService, DesignationItem } from "../services/staffService";
import { academicService, DepartmentItem } from "../services/academicService";

export const DesignationManagementPage: React.FC = () => {
  const [designations, setDesignations] = useState<DesignationItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", department: "", category: "teaching" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [desData, dData] = await Promise.all([
        staffService.getDesignations(),
        academicService.getDepartments(),
      ]);
      setDesignations(desData.results || desData);
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
      await staffService.createDesignation(formData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create designation.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" />
            Institutional Designations
          </h1>
          <p className="text-xs text-slate-400">Staff roles, ranks & employment categories.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Designation
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading designations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designations.map((d) => (
            <div key={d.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">{d.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded">
                  {d.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">Category: <span className="capitalize text-slate-200">{d.category.replace("_", " ")}</span></p>
              {d.department_name && <p className="text-[11px] text-slate-500">Dept: {d.department_name}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100">Add Designation</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Associate Professor"
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
                placeholder="ASSOC_PROF"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              >
                <option value="teaching">Teaching Staff</option>
                <option value="non_teaching">Non-Teaching Staff</option>
                <option value="administration">Administration</option>
                <option value="finance">Finance</option>
                <option value="library">Library</option>
                <option value="it_support">IT Support</option>
              </select>
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
                Create Designation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
