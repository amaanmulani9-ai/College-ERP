import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, UserCheck, ShieldAlert, CheckCircle, Mail, Phone, MapPin, Award } from "lucide-react";
import { staffService, EmployeeItem } from "../services/staffService";

export const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<EmployeeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await staffService.getEmployee(id!);
      setEmployee(data);
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
      await staffService.suspendEmployee(id!, reason);
      fetchEmployee();
    } catch (err) {
      alert("Failed to suspend employee.");
    }
  };

  const handleReinstate = async () => {
    if (!confirm("Reinstate this employee to active duty?")) return;
    try {
      await staffService.reinstateEmployee(id!);
      fetchEmployee();
    } catch (err) {
      alert("Failed to reinstate employee.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading employee details...</div>;
  }

  if (!employee) {
    return <div className="p-8 text-center text-xs text-slate-400">Employee record not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/staff" className="inline-flex items-center text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Staff Directory
      </Link>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-slate-100">{employee.profile?.full_name}</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
              {employee.employee_id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {employee.designation_name} ({employee.designation_category}) | {employee.department_name}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {employee.employment_status === "active" ? (
            <button
              onClick={handleSuspend}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold"
            >
              Suspend Employee
            </button>
          ) : (
            <button
              onClick={handleReinstate}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold"
            >
              Reinstate to Active
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Employment Details</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Employee Number:</span>
              <span className="font-mono text-slate-200 font-semibold">{employee.employee_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employment Type:</span>
              <span className="capitalize text-slate-200">{employee.employment_type.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Joining Date:</span>
              <span className="text-slate-200">{employee.joining_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Qualification:</span>
              <span className="text-slate-200">{employee.qualification || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Experience:</span>
              <span className="text-slate-200">{employee.experience_years} Years</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Workplace Contact Information</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Work Email:</span>
              <span className="font-mono text-indigo-400">{employee.work_email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Office Location:</span>
              <span className="text-slate-200">{employee.office_location || "Main Campus"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Extension Number:</span>
              <span className="font-mono text-slate-200">{employee.extension_number || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reporting Manager:</span>
              <span className="text-slate-200">{employee.reporting_manager_name || "Head of Department"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
