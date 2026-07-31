import React, { useEffect, useState } from "react";
import { Landmark, Plus, Search, Trash2 } from "lucide-react";
import { academicService, FacultyItem } from "../services/academicService";

export const FacultyManagementPage: React.FC = () => {
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const data = await academicService.getFaculties();
      setFaculties(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.createFaculty(formData);
      setShowModal(false);
      setFormData({ name: "", code: "", description: "" });
      fetchFaculties();
    } catch (err) {
      alert("Failed to create faculty.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await academicService.deleteFaculty(id);
      fetchFaculties();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to delete faculty.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-400" />
            Faculties & Schools
          </h1>
          <p className="text-xs text-slate-400">Top-level institutional divisions.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading faculties...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculties.map((f) => (
            <div key={f.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100">{f.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded">
                    {f.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{f.description || "No description provided."}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{f.departments_count || 0} Departments</span>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100">Add New Faculty</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Faculty of Engineering & Technology"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="FET"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Create Faculty
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
