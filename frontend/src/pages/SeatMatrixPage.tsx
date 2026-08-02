import React, { useEffect, useState } from "react";
import { Layers, Plus, Trash2, Edit3, RefreshCw } from "lucide-react";
import { admissionService, SeatMatrixItem } from "../services/admissionService";
import { academicService, AcademicSessionItem, ProgramItem } from "../services/academicService";

export const SeatMatrixPage: React.FC = () => {
  const [matrices, setMatrices] = useState<SeatMatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Modal form states
  const [program, setProgram] = useState("");
  const [session, setSession] = useState("");
  const [category, setCategory] = useState("General");
  const [totalSeats, setTotalSeats] = useState(60);

  // Dropdown options
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [sessions, setSessions] = useState<AcademicSessionItem[]>([]);

  const fetchMatrices = async () => {
    setLoading(true);
    try {
      const res = await admissionService.listSeatMatrices();
      setMatrices(res.data.results ?? (res.data as unknown as SeatMatrixItem[]));
    } catch (err) {
      console.error("Failed to load seat matrices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrices();

    const fetchOptions = async () => {
      try {
        const [progRes, sessRes] = await Promise.all([
          academicService.listPrograms(),
          academicService.listSessions(),
        ]);
        setPrograms(progRes.data.results ?? (progRes.data as unknown as ProgramItem[]));
        setSessions(sessRes.data.results ?? (sessRes.data as unknown as AcademicSessionItem[]));
        if (progRes.data.results?.length) setProgram(progRes.data.results[0].id);
        if (sessRes.data.results?.length) setSession(sessRes.data.results[0].id);
      } catch (err) {
        console.error("Failed to fetch academic options for seat matrix", err);
      }
    };
    fetchOptions();
  }, []);

  const handleCreateMatrix = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await admissionService.createSeatMatrix({
        program,
        academic_session: session,
        category,
        total_seats: totalSeats,
      });
      setShowModal(false);
      fetchMatrices();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create seat matrix. Duplicate entry for Program + Session + Category?");
    }
  };

  const handleDeleteMatrix = async (id: string) => {
    if (!window.confirm("Delete this seat matrix allocation entry?")) return;
    try {
      await admissionService.deleteSeatMatrix(id);
      fetchMatrices();
    } catch (err) {
      console.error("Failed to delete seat matrix", err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Program Seat Matrix & Capacity Allocation
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Configure available seats per program, session & category to enforce seat quota limits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Capacity Quota
          </button>
          <button
            onClick={fetchMatrices}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seat Matrix Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Program</th>
                <th className="p-3">Academic Session</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Total Capacity</th>
                <th className="p-3 text-center">Occupied</th>
                <th className="p-3 text-center">Available</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {matrices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No seat matrices configured yet.
                  </td>
                </tr>
              ) : (
                matrices.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      {m.program_name} <span className="text-[10px] text-indigo-400 font-mono">({m.program_code})</span>
                    </td>
                    <td className="p-3 text-slate-300">{m.session_name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full text-[10px] border border-slate-700">
                        {m.category}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-white font-mono">{m.total_seats}</td>
                    <td className="p-3 text-center font-bold text-amber-400 font-mono">{m.occupied_seats}</td>
                    <td className="p-3 text-center font-bold text-emerald-400 font-mono">{m.available_seats}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteMatrix(m.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for creating Seat Matrix */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Configure Program Seat Quota
            </h2>

            <form onSubmit={handleCreateMatrix} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Program</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Academic Session</label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Total Seat Quota Capacity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Save Quota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
