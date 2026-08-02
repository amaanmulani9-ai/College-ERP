import React, { useEffect, useState } from "react";
import { FileText, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { resultService } from "../services/resultService";
import { academicService, SubjectItem } from "../services/academicService";
import { studentService, StudentItem } from "../services/studentService";

export const MarksEntryPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [internal, setInternal] = useState<number>(0);
  const [external, setExternal] = useState<number>(0);
  const [practical, setPractical] = useState<number>(0);
  const [viva, setViva] = useState<number>(0);
  const [assignment, setAssignment] = useState<number>(0);
  const [grace, setGrace] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [stRes, subRes] = await Promise.all([
          studentService.listStudents(),
          academicService.listSubjects(),
        ]);
        const fetchedStudents = stRes.data.results ?? (stRes.data as unknown as StudentItem[]);
        const fetchedSubjects = subRes.data.results ?? (subRes.data as unknown as SubjectItem[]);

        setStudents(fetchedStudents);
        setSubjects(fetchedSubjects);

        if (fetchedStudents.length) setSelectedStudent(fetchedStudents[0].id);
        if (fetchedSubjects.length) setSelectedSubject(fetchedSubjects[0].id);
      } catch (err) {
        console.error("Failed to load options for marks entry", err);
      }
    };
    fetchOptions();
  }, []);

  const totalMarks = internal + external + practical + viva + assignment + grace;

  // Grade Preview Logic
  const getGradePreview = (total: number) => {
    if (total >= 90) return { grade: "A+", gp: 10.0 };
    if (total >= 80) return { grade: "A", gp: 9.0 };
    if (total >= 70) return { grade: "B+", gp: 8.0 };
    if (total >= 60) return { grade: "B", gp: 7.0 };
    if (total >= 50) return { grade: "C", gp: 6.0 };
    if (total >= 40) return { grade: "D", gp: 5.0 };
    return { grade: "F", gp: 0.0 };
  };

  const preview = getGradePreview(totalMarks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedSubject) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await resultService.enterMarks({
        student: selectedStudent,
        subject: selectedSubject,
        internal_marks: internal,
        external_marks: external,
        practical_marks: practical,
        viva_marks: viva,
        assignment_marks: assignment,
        grace_marks: grace,
      });

      setMessage({
        type: "success",
        text: `Marks saved! Total: ${res.data.total_marks}, Grade: ${res.data.grade} (Grade Point: ${res.data.grade_point})`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to save marks." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-4xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Student Marks Entry Console
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Input subject marks for internal, external, practical, viva, and assignment components.
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-slate-400 mb-1">Select Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.name} ({sub.credits} Credits)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-slate-400 mb-1">Internal Marks (Max 40)</label>
              <input
                type="number"
                min="0"
                max="40"
                value={internal}
                onChange={(e) => setInternal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">External Marks (Max 60)</label>
              <input
                type="number"
                min="0"
                max="60"
                value={external}
                onChange={(e) => setExternal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Practical Marks</label>
              <input
                type="number"
                min="0"
                value={practical}
                onChange={(e) => setPractical(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Viva Marks</label>
              <input
                type="number"
                min="0"
                value={viva}
                onChange={(e) => setViva(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Assignment Marks</label>
              <input
                type="number"
                min="0"
                value={assignment}
                onChange={(e) => setAssignment(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Grace Marks</label>
              <input
                type="number"
                min="0"
                value={grace}
                onChange={(e) => setGrace(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Grade Computation Live Preview Card */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px]">Computed Total Marks:</span>
              <div className="text-2xl font-extrabold text-white">{totalMarks} / 100</div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 text-[11px]">Grade & Grade Point:</span>
              <div className="text-xl font-extrabold text-amber-400">
                {preview.grade} ({preview.gp.toFixed(1)} GP)
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Marks..." : "Save Student Marks"}
          </button>
        </form>
      </div>
    </div>
  );
};
