import React, { useEffect, useState } from "react";
import { Users, Plus, Search, Filter, Eye, UserCheck, ShieldAlert, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { studentService, StudentItem } from "../services/studentService";

export const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [statusFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getStudents({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setStudents(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Student Directory
          </h1>
          <p className="text-xs text-slate-400">Institutional student roster & enrollment records.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/students/import-export"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Import/Export
          </Link>
          <Link
            to="/students/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Onboard Student
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Name, Roll No, Email..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="graduated">Graduated</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="applicant">Applicant</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading student roster...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Name / Email</th>
                <th className="p-3.5">Program & Dept</th>
                <th className="p-3.5">Semester</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-indigo-400 font-bold">{st.student_id}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-100">{st.profile?.full_name || "N/A"}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{st.profile?.email}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-200">{st.program_code}</p>
                    <p className="text-[10px] text-slate-500">{st.department_name}</p>
                  </td>
                  <td className="p-3.5 font-medium">{st.semester_name}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        st.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : st.status === "suspended"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : st.status === "graduated"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to={`/students/${st.id}`}
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
