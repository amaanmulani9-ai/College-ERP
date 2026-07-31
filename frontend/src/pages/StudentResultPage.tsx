import React, { useEffect, useState } from "react";
import { FileText, Search, Trophy, Award } from "lucide-react";
import { resultService, TranscriptPreviewData } from "../services/resultService";
import { studentService, StudentItem } from "../services/studentService";

export const StudentResultPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [transcript, setTranscript] = useState<TranscriptPreviewData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.listStudents();
        const fetched = res.data.results ?? (res.data as unknown as StudentItem[]);
        setStudents(fetched);
        if (fetched.length) {
          setSelectedStudent(fetched[0].id);
          fetchTranscript(fetched[0].id);
        }
      } catch (err) {
        console.error("Failed to load students for result page", err);
      }
    };
    fetchStudents();
  }, []);

  const fetchTranscript = async (stId: string) => {
    setLoading(true);
    try {
      const res = await resultService.getTranscriptPreview(stId);
      setTranscript(res.data);
    } catch (err) {
      console.error("Failed to load transcript preview", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (stId: string) => {
    setSelectedStudent(stId);
    fetchTranscript(stId);
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-400" />
              Student Transcript & Marksheet Preview
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Comprehensive academic transcript preview with subject grades, credit points & CGPA.
            </p>
          </div>

          <div className="w-full md:w-72">
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.student_id} — {st.profile?.first_name} {st.profile?.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : transcript ? (
        <div className="space-y-6">
          {/* CGPA Summary Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/20 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Cumulative Grade Point Average (CGPA)</span>
              <div className="text-4xl font-extrabold text-amber-400 mt-1">{transcript.cgpa.toFixed(2)}</div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Total Subjects Graded</span>
              <div className="text-3xl font-bold text-white mt-1">{transcript.subject_results.length}</div>
            </div>
          </div>

          {/* Subject Grade Breakdown Table */}
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white">Subject Grade Breakdown</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Subject Code</th>
                    <th className="p-3">Subject Name</th>
                    <th className="p-3">Internal</th>
                    <th className="p-3">External</th>
                    <th className="p-3">Total Marks</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Grade Point</th>
                    <th className="p-3">Credit Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transcript.subject_results.map((subRes) => (
                    <tr key={subRes.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-indigo-300">
                        {subRes.subject_detail?.code || subRes.subject}
                      </td>
                      <td className="p-3 font-bold text-white">{subRes.subject_detail?.name}</td>
                      <td className="p-3 text-slate-300">{subRes.internal_marks}</td>
                      <td className="p-3 text-slate-300">{subRes.external_marks}</td>
                      <td className="p-3 font-bold text-white">{subRes.total_marks}</td>
                      <td className="p-3 font-extrabold text-amber-400">{subRes.grade}</td>
                      <td className="p-3 font-mono text-emerald-400">{subRes.grade_point.toFixed(1)}</td>
                      <td className="p-3 font-mono text-purple-300">{subRes.credit_point.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
