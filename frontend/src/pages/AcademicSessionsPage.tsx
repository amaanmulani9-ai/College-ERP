import React, { useEffect, useState } from "react";
import { Calendar, Plus, CheckCircle } from "lucide-react";
import { academicService, SessionItem } from "../services/academicService";

export const AcademicSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", start_date: "", end_date: "", is_current: false });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await academicService.getSessions();
      setSessions(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.createSession(formData);
      setShowModal(false);
      fetchSessions();
    } catch (err) {
      alert("Failed to create academic session.");
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      await academicService.setCurrentSession(id);
      fetchSessions();
    } catch (err) {
      alert("Failed to set current session.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Academic Sessions & Years
          </h1>
          <p className="text-xs text-slate-400">Institutional academic calendar years.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Session
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading academic sessions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <div key={s.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">{s.name}</h3>
                {s.is_current ? (
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Current
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetCurrent(s.id)}
                    className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded transition-colors"
                  >
                    Set Active Current
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <p>Start Date: {s.start_date}</p>
                <p>End Date: {s.end_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100">Add Academic Session</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Session Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="2025–2026"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                />
              </div>
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
                Create Session
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
