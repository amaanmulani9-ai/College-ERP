import React, { useEffect, useState } from "react";
import { UserCheck, Plus, Search, Filter, Eye, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { staffService, EmployeeItem } from "../services/staffService";

export const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [statusFilter]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await staffService.getEmployees({
        search: search || undefined,
        employment_status: statusFilter || undefined,
      });
      setEmployees(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            Staff & Employee Directory
          </h1>
          <p className="text-xs text-slate-400">Institutional faculty & administrative personnel roster.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/staff/designations"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-4 h-4" /> Designations
          </Link>
          <Link
            to="/staff/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Onboard Staff
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
            placeholder="Search by ID, Name, Work Email..."
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
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
            <option value="resigned">Resigned</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading staff directory...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Employee ID</th>
                <th className="p-3.5">Name / Email</th>
                <th className="p-3.5">Designation & Dept</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-indigo-400 font-bold">{emp.employee_id}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-100">{emp.profile?.full_name || "N/A"}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{emp.work_email || emp.profile?.email}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-200">{emp.designation_name}</p>
                    <p className="text-[10px] text-slate-500">{emp.department_name}</p>
                  </td>
                  <td className="p-3.5 capitalize font-medium">{emp.employment_type.replace("_", " ")}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        emp.employment_status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : emp.employment_status === "suspended"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {emp.employment_status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to={`/staff/${emp.id}`}
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
