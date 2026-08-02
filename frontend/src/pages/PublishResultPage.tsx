import React, { useEffect, useState } from "react";
import { CheckCircle2, Trophy, AlertCircle, Send } from "lucide-react";
import { resultService, SemesterResultItem } from "../services/resultService";
import { academicService, SemesterItem } from "../services/academicService";

export const PublishResultPage: React.FC = () => {
  const [semesters, setSemesters] = useState<SemesterItem[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semResults, setSemResults] = useState<SemesterResultItem[]>([]);

  const [publishing, setPublishing] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await academicService.listSemesters();
        const fetchedSems = res.data.results ?? (res.data as unknown as SemesterItem[]);
        setSemesters(fetchedSems);
        if (fetchedSems.length) {
          setSelectedSemester(fetchedSems[0].id);
          fetchSummary(fetchedSems[0].id);
        }
      } catch (err) {
        console.error("Failed to load semesters for publish page", err);
      }
    };
    fetchSemesters();
  }, []);

  const fetchSummary = async (semId: string) => {
    try {
      const res = await resultService.getSemesterSummary(semId);
      setSemResults(res.data);
    } catch (err) {
      console.error("Failed to load semester summary", err);
    }
  };

  const handleSemesterChange = (semId: string) => {
    setSelectedSemester(semId);
    fetchSummary(semId);
  };

  const handleGenerateRanks = async () => {
    if (!selectedSemester) return;
    setRanking(true);
    setMessage(null);

    try {
      const res = await resultService.generateRanks(selectedSemester);
      setSemResults(res.data);
      setMessage({ type: "success", text: `Merit ranks generated for ${res.data.length} students!` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to generate ranks." });
    } finally {
      setRanking(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedSemester) return;
    setPublishing(true);
    setMessage(null);

    try {
      const res = await resultService.publishSemester(selectedSemester);
      setMessage({ type: "success", text: res.data.message });
      fetchSummary(selectedSemester);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to publish results." });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-400" />
            Result Publishing & Rank Generation Console
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Batch publish validated semester results and assign merit ranks to students.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/60 border border-rose-500/30 text-rose-300"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="w-full md:w-1/2">
            <label className="block text-slate-400 mb-1">Select Target Semester *</label>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name} — {sem.program_detail?.code || "BSCS"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0">
            <button
              onClick={handleGenerateRanks}
              disabled={ranking}
              className="flex-1 md:flex-none px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              <Trophy className="w-4 h-4" />
              {ranking ? "Ranking..." : "Generate Ranks"}
            </button>

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              {publishing ? "Publishing..." : "Publish Semester Results"}
            </button>
          </div>
        </div>
      </div>

      {/* Semester Results Summary Roster */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">Semester Summary ({semResults.length} records)</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Student ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">SGPA</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Credits Earned</th>
                <th className="p-3">Status</th>
                <th className="p-3">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {semResults.map((sr) => (
                <tr key={sr.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-amber-400">#{sr.rank || "-"}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-300">
                    {sr.student_detail?.student_id || sr.student}
                  </td>
                  <td className="p-3 font-bold text-white">
                    {sr.student_detail?.profile?.first_name} {sr.student_detail?.profile?.last_name}
                  </td>
                  <td className="p-3 font-mono font-extrabold text-emerald-400">{sr.sgpa.toFixed(2)}</td>
                  <td className="p-3 font-mono font-extrabold text-amber-300">{sr.cgpa.toFixed(2)}</td>
                  <td className="p-3 text-slate-300">{sr.credits_earned} / {sr.total_credits}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-bold text-[10px] uppercase">
                      {sr.result_status_display}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">
                    {sr.is_published ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-slate-500">Draft</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
