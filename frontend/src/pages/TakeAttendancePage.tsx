import React, { useEffect, useState } from "react";
import { CheckSquare, Save, Lock, UserCheck, Check, X, Clock, AlertCircle } from "lucide-react";
import { attendanceService, AttendanceSessionItem } from "../services/attendanceService";
import { studentService, StudentItem } from "../services/studentService";

export const TakeAttendancePage: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSessionItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedSession, setSelectedSession] = useState<AttendanceSessionItem | null>(null);

  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessRes, stdRes] = await Promise.all([
          attendanceService.listSessions(),
          studentService.listStudents(),
        ]);
        const fetchedSessions = sessRes.data.results ?? (sessRes.data as unknown as AttendanceSessionItem[]);
        const fetchedStudents = stdRes.data.results ?? (stdRes.data as unknown as StudentItem[]);

        setSessions(fetchedSessions);
        setStudents(fetchedStudents);

        if (fetchedSessions.length > 0) {
          setSelectedSessionId(fetchedSessions[0].id);
          setSelectedSession(fetchedSessions[0]);
        }

        // Default all students to "present"
        const initialMap: Record<string, { status: string; remarks: string }> = {};
        fetchedStudents.forEach((st) => {
          initialMap[st.id] = { status: "present", remarks: "" };
        });
        setAttendanceMap(initialMap);
      } catch (err) {
        console.error("Failed to load attendance marking data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSessionChange = (id: string) => {
    setSelectedSessionId(id);
    const found = sessions.find((s) => s.id === id) || null;
    setSelectedSession(found);
  };

  const setStudentStatus = (studentId: string, status: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSessionId || selectedSession?.is_locked) return;
    setSaving(true);
    setMessage(null);

    const records = Object.entries(attendanceMap).map(([studentId, data]) => ({
      student_id: studentId,
      status: data.status,
      remarks: data.remarks,
    }));

    try {
      await attendanceService.bulkMark(selectedSessionId, records);
      setMessage({ type: "success", text: "Attendance records saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to save attendance." });
    } finally {
      setSaving(false);
    }
  };

  const handleLockSession = async () => {
    if (!selectedSessionId) return;
    try {
      const res = await attendanceService.lockSession(selectedSessionId);
      setSelectedSession(res.data);
      setMessage({ type: "success", text: "Attendance session locked! Further edits are disabled." });
    } catch (err) {
      console.error("Failed to lock session", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      {/* Session Selection Panel */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
              Take Class Attendance
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Select session, review roster, mark Present/Absent/Late, and submit batch record.
            </p>
          </div>

          {selectedSession && !selectedSession.is_locked && (
            <button
              onClick={handleLockSession}
              className="flex items-center gap-2 px-3 py-2 bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all"
            >
              <Lock className="w-4 h-4" />
              Lock Session
            </button>
          )}
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

        <div>
          <label className="block text-slate-400 text-xs mb-1">Select Attendance Session *</label>
          <select
            value={selectedSessionId}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.date} — {s.subject_detail?.name || s.subject} ({s.start_time} - {s.end_time}) {s.is_locked ? "[LOCKED]" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Roster Marking Table */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Student Attendance Roster ({students.length})
          </h2>

          <button
            onClick={handleSaveAttendance}
            disabled={saving || selectedSession?.is_locked}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Roll / ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Program</th>
                <th className="p-3 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((st) => {
                const currentStatus = attendanceMap[st.id]?.status || "present";
                return (
                  <tr key={st.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-semibold text-indigo-300">{st.roll_number || st.student_id}</td>
                    <td className="p-3 font-bold text-white">
                      {st.profile?.first_name} {st.profile?.last_name}
                    </td>
                    <td className="p-3 text-slate-400">{st.program_detail?.code || "CS"}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStudentStatus(st.id, "present")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            currentStatus === "present"
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentStatus(st.id, "absent")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            currentStatus === "absent"
                              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentStatus(st.id, "late")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            currentStatus === "late"
                              ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
