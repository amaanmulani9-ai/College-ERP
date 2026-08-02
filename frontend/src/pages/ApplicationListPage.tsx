import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  UserCheck,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { admissionService, AdmissionApplicationItem } from "../services/admissionService";

export const ApplicationListPage: React.FC = () => {
  const [applications, setApplications] = useState<AdmissionApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await admissionService.listApplications(params);
      setApplications(res.data.results ?? (res.data as unknown as AdmissionApplicationItem[]));
    } catch (err) {
      console.error("Failed to load applications list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((app) => app.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkApprove = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Bulk approve ${selectedIds.length} selected applications?`)) return;
    setBulkProcessing(true);
    try {
      await admissionService.bulkApprove(selectedIds, "Bulk approved by admissions officer");
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      console.error("Bulk approve failed", err);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Bulk reject ${selectedIds.length} selected applications?`)) return;
    setBulkProcessing(true);
    try {
      await admissionService.bulkReject(selectedIds, "Bulk rejected by admissions officer");
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      console.error("Bulk reject failed", err);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Soft-delete this admission application?")) return;
    try {
      await admissionService.deleteApplication(id);
      fetchApplications();
    } catch (err) {
      console.error("Delete application failed", err);
    }
  };

  const getStatusBadge = (st: string) => {
    const maps: Record<string, string> = {
      draft: "bg-slate-700/60 text-slate-300 border-slate-600/40",
      submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      under_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      document_verification: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      interview: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      rejected: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      waitlisted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      enrolled: "bg-teal-500/20 text-teal-300 border-teal-500/40",
      cancelled: "bg-slate-800 text-slate-500 border-slate-700",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
          maps[st] || "bg-slate-800 text-slate-400 border-slate-700"
        }`}
      >
        {st.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Admission Applications Roster
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Filter, review, approve and enroll incoming applicants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admissions/create"
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
          <button
            onClick={fetchApplications}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Bulk Actions */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search by application #, name, email or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl font-medium border border-slate-700 transition-all"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="document_verification">Document Verification</option>
                <option value="interview">Interview</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="enrolled">Enrolled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Action Strip */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs">
            <span className="text-indigo-300 font-medium">
              {selectedIds.length} application(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                disabled={bulkProcessing}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bulk Approve
              </button>
              <button
                onClick={handleBulkReject}
                disabled={bulkProcessing}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Bulk Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={applications.length > 0 && selectedIds.length === applications.length}
                      onChange={toggleSelectAll}
                      className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                  </th>
                  <th className="p-3">Application #</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Email / Mobile</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app.id)}
                          onChange={() => toggleSelect(app.id)}
                          className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-indigo-300">{app.application_number}</td>
                      <td className="p-3 font-medium text-white">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="p-3 text-slate-400">
                        <div>{app.email}</div>
                        <div className="text-[10px] text-slate-500">{app.mobile}</div>
                      </td>
                      <td className="p-3 text-slate-300">
                        {app.program_detail?.name || app.program}
                      </td>
                      <td className="p-3">{getStatusBadge(app.status)}</td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admissions/applications/${app.id}`}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all"
                            title="Soft Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
