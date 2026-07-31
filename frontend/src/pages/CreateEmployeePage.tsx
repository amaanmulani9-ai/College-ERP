import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { staffService, DesignationItem } from "../services/staffService";
import { academicService, DepartmentItem } from "../services/academicService";

export const CreateEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [designations, setDesignations] = useState<DesignationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    employee_number: "",
    department: "",
    designation: "",
    employment_type: "full_time",
    joining_date: new Date().toISOString().split("T")[0],
    qualification: "",
    experience_years: 0,
    office_location: "",
    work_email: "",
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [dData, desData] = await Promise.all([
        academicService.getDepartments(),
        staffService.getDesignations(),
      ]);
      setDepartments(dData.results || dData);
      setDesignations(desData.results || desData);
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
      await staffService.createEmployee(formData);
      navigate("/staff");
    } catch (err: any) {
      alert(err.response?.data?.email?.[0] || "Failed to onboard employee.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading options...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/staff" className="inline-flex items-center text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Staff Directory
      </Link>

      <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <h1 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Onboard Staff Member</h1>

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
            <label className="block text-xs font-medium text-slate-300 mb-1">Primary Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Employment Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Employee Number</label>
            <input
              type="text"
              required
              value={formData.employee_number}
              onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
              placeholder="EMP-NUM-001"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Employment Type</label>
            <select
              value={formData.employment_type}
              onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="visiting">Visiting Faculty</option>
              <option value="adjunct">Adjunct Faculty</option>
            </select>
          </div>
        </div>

        {/* Department & Designation */}
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 pt-2">Organizational Placement</h2>
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
            <label className="block text-xs font-medium text-slate-300 mb-1">Designation</label>
            <select
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="">-- Select Designation --</option>
              {designations.map((des) => (
                <option key={des.id} value={des.id}>{des.name} ({des.category})</option>
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
            {submitting ? "Onboarding..." : "Onboard Staff"}
          </button>
        </div>
      </form>
    </div>
  );
};
