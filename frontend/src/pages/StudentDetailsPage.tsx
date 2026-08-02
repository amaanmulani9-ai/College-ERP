import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert, CheckCircle, GraduationCap, Clock, Phone, User, Trash2 } from "lucide-react";
import { studentService, StudentItem } from "../services/studentService";

export const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const data = await studentService.getStudent(id!);
      setStudent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;
    try {
      await studentService.suspendStudent(id!, reason);
      fetchStudent();
    } catch (err) {
      alert("Failed to suspend student.");
    }
  };

  const handleReinstate = async () => {
    if (!confirm("Reinstate this student to active status?")) return;
    try {
      await studentService.reinstateStudent(id!);
      fetchStudent();
    } catch (err) {
      alert("Failed to reinstate student.");
    }
  };

  const handleGraduate = async () => {
    if (!confirm("Mark this student as graduated?")) return;
    try {
      await studentService.graduateStudent(id!);
      fetchStudent();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading student details...</div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-xs text-slate-400">Student record not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Student Directory
      </Link>

      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-slate-100">{student.profile?.full_name}</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
              {student.student_id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {student.program_name} | {student.department_name} | {student.semester_name}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {student.status === "active" ? (
            <>
              <button
                onClick={handleSuspend}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold"
              >
                Suspend
              </button>
              <button
                onClick={handleGraduate}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Graduate
              </button>
            </>
          ) : student.status === "suspended" ? (
            <button
              onClick={handleReinstate}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold"
            >
              Reinstate Student
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Mapping */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Academic Enrollment</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Enrollment Number:</span>
              <span className="font-mono text-slate-200 font-semibold">{student.enrollment_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Roll Number:</span>
              <span className="font-mono text-slate-200">{student.roll_number || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Academic Session:</span>
              <span className="text-slate-200">{student.session_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Admission Date:</span>
              <span className="text-slate-200">{student.admission_date}</span>
            </div>
          </div>
        </div>

        {/* Guardian Details */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Guardian Contact Information</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Father's Name:</span>
              <span className="text-slate-200">{student.father_name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mother's Name:</span>
              <span className="text-slate-200">{student.mother_name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guardian Contact:</span>
              <span className="text-slate-200">{student.guardian_name} ({student.guardian_phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Emergency Phone:</span>
              <span className="font-mono text-rose-400 font-semibold">{student.emergency_contact || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status History Timeline */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Status Audit History</h2>
        <div className="space-y-3">
          {student.status_history?.map((h) => (
            <div key={h.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs flex justify-between">
              <div>
                <p className="font-semibold text-slate-200">
                  Status changed from <span className="text-slate-400">{h.previous_status}</span> → <span className="text-indigo-400">{h.new_status}</span>
                </p>
                {h.reason && <p className="text-[11px] text-slate-400 mt-1">Reason: {h.reason}</p>}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{new Date(h.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
