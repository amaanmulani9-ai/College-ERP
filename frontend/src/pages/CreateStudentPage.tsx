import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { studentService } from "../services/studentService";
import { academicService, ProgramItem, DepartmentItem, SemesterItem, SessionItem } from "../services/academicService";

export const CreateStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [semesters, setSemesters] = useState<SemesterItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    enrollment_number: "",
    roll_number: "",
    department: "",
    program: "",
    current_semester: "",
    academic_session: "",
    admission_date: new Date().toISOString().split("T")[0],
    category: "General",
    father_name: "",
    guardian_name: "",
    guardian_phone: "",
    emergency_contact: "",
  });

  useEffect(() => {
    fetchAcademics();
  }, []);

  const fetchAcademics = async () => {
    try {
      const [dData, pData, semData, sesData] = await Promise.all([
        academicService.getDepartments(),
        academicService.getPrograms(),
        academicService.getSemesters(),
        academicService.getSessions(),
      ]);
      setDepartments(dData.results || dData);
      setPrograms(pData.results || pData);
      setSemesters(semData.results || semData);
      setSessions(sesData.results || sesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await studentService.createStudent(formData);
      navigate("/students");
    } catch (err: any) {
      alert(err.response?.data?.email?.[0] || "Failed to create student.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/students" className="inline-flex items-center text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Student Directory
      </Link>

      <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <h1 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Onboard New Student</h1>

        {/* Identity Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Student Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Enrollment Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Enrollment Number</label>
            <input
              type="text"
              required
              value={formData.enrollment_number}
              onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
              placeholder="ENR2026001"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number</label>
            <input
              type="text"
              value={formData.roll_number}
              onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
              placeholder="26IT101"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Academic Mapping */}
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 pt-2">Academic Mapping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
            <select
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Program</label>
            <select
              required
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="">-- Select Program --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Current Semester</label>
            <select
              required
              value={formData.current_semester}
              onChange={(e) => setFormData({ ...formData, current_semester: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="">-- Select Semester --</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>{s.program_name} - {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Academic Session</label>
            <select
              required
              value={formData.academic_session}
              onChange={(e) => setFormData({ ...formData, academic_session: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="">-- Select Session --</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Onboarding..." : "Onboard Student"}
          </button>
        </div>
      </form>
    </div>
  );
};
