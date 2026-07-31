import React, { useEffect, useState } from "react";
import { Ticket, Search, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { examService, ExamItem, HallTicketItem } from "../services/examService";
import { studentService, StudentItem } from "../services/studentService";

export const HallTicketPage: React.FC = () => {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [hallTickets, setHallTickets] = useState<HallTicketItem[]>([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await examService.listHallTickets();
      setHallTickets(res.data.results ?? (res.data as unknown as HallTicketItem[]));
    } catch (err) {
      console.error("Failed to load hall tickets", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exRes, stRes, htRes] = await Promise.all([
          examService.listExams(),
          studentService.listStudents(),
          examService.listHallTickets(),
        ]);
        const fetchedExams = exRes.data.results ?? (exRes.data as unknown as ExamItem[]);
        const fetchedStudents = stRes.data.results ?? (stRes.data as unknown as StudentItem[]);

        setExams(fetchedExams);
        setStudents(fetchedStudents);
        setHallTickets(htRes.data.results ?? (htRes.data as unknown as HallTicketItem[]));

        if (fetchedExams.length) setSelectedExam(fetchedExams[0].id);
        if (fetchedStudents.length) setSelectedStudent(fetchedStudents[0].id);
      } catch (err) {
        console.error("Failed to load data for hall ticket generator", err);
      }
    };
    fetchData();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedExam) return;
    setGenerating(true);
    setMessage(null);

    try {
      const res = await examService.generateHallTicket(selectedStudent, selectedExam);
      setMessage({ type: "success", text: `Hall Ticket ${res.data.hall_ticket_number} generated successfully!` });
      fetchTickets();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to generate Hall Ticket." });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      {/* Generator Form Panel */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-purple-400" />
            Admit Pass / Hall Ticket Generator
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Issue verified hall tickets required for students to sit in examination halls.
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

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Select Examination *</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.subject_detail?.code} — {ex.subject_detail?.name} ({ex.exam_type_detail?.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Select Student *</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.student_id} — {st.profile?.first_name} {st.profile?.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              <Ticket className="w-4 h-4" />
              {generating ? "Generating..." : "Generate Hall Ticket"}
            </button>
          </div>
        </form>
      </div>

      {/* Hall Ticket Roster */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-purple-400" />
            Issued Hall Tickets Roster ({hallTickets.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Hall Ticket Number</th>
                <th className="p-3">Student ID</th>
                <th className="p-3">Exam Subject</th>
                <th className="p-3">Status</th>
                <th className="p-3">Issued Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {hallTickets.map((ht) => (
                <tr key={ht.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-purple-300">{ht.hall_ticket_number}</td>
                  <td className="p-3 font-mono text-slate-300">{ht.student_detail?.student_id || ht.student}</td>
                  <td className="p-3 text-white">{ht.exam_detail?.subject_detail?.name || ht.exam}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px] uppercase">
                      {ht.status_display}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{new Date(ht.generated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
