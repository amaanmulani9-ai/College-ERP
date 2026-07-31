import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { parentService, ParentItem } from "../services/parentService";

export const ParentListPage: React.FC = () => {
  const [parents, setParents] = useState<ParentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    relationship_type: "guardian",
    occupation: "",
    education_level: "bachelor",
    portal_access_enabled: true,
    notification_enabled: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchParents = async (q?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (q) params.search = q;
      const res = await parentService.list(params);
      setParents(res.data.results ?? (res.data as unknown as ParentItem[]));
    } catch {
      console.error("Failed to load parents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParents(search);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await parentService.create(formData);
      setShowForm(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        relationship_type: "guardian",
        occupation: "",
        education_level: "bachelor",
        portal_access_enabled: true,
        notification_enabled: true,
      });
      fetchParents();
    } catch {
      console.error("Failed to create parent");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    await parentService.verify(id);
    fetchParents(search);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Soft-delete this parent?")) {
      await parentService.delete(id);
      fetchParents(search);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Parent & Guardian Management
            </h1>
            <p className="text-slate-400 text-sm">Manage parent profiles and student links</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all text-sm font-semibold shadow-lg"
        >
          <Plus size={16} />
          Add Parent
        </button>
      </div>

      {/* Add Parent Form */}
      {showForm && (
        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-violet-300 mb-4">Create Parent / Guardian</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "first_name", label: "First Name", type: "text" },
              { key: "last_name", label: "Last Name", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "occupation", label: "Occupation", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
                <input
                  type={type}
                  required={key !== "occupation"}
                  value={(formData as Record<string, unknown>)[key] as string}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-violet-400"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-slate-400 mb-1">Relationship</label>
              <select
                value={formData.relationship_type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, relationship_type: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-violet-400"
              >
                {["father", "mother", "guardian", "grandfather", "grandmother", "uncle", "aunt", "sibling", "other"].map((r) => (
                  <option key={r} value={r} className="bg-slate-800">
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Education Level</label>
              <select
                value={formData.education_level}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, education_level: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-violet-400"
              >
                {[
                  ["none", "No Formal Education"],
                  ["primary", "Primary School"],
                  ["secondary", "Secondary School"],
                  ["diploma", "Diploma"],
                  ["bachelor", "Bachelor's Degree"],
                  ["master", "Master's Degree"],
                  ["doctorate", "Doctorate"],
                  ["other", "Other"],
                ].map(([val, label]) => (
                  <option key={val} value={val} className="bg-slate-800">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Parent"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or code…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-400"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold transition-all"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => { setSearch(""); fetchParents(); }}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <RefreshCw size={16} />
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {["Code", "Name", "Email", "Relationship", "Occupation", "Verified", "Portal", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {parents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No parents found.
                  </td>
                </tr>
              ) : (
                parents.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-violet-300 text-xs">{p.parent_code}</td>
                    <td className="px-4 py-3 font-medium">
                      {p.profile.first_name} {p.profile.last_name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{p.profile.user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                        {p.relationship_type_display}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{p.occupation || "—"}</td>
                    <td className="px-4 py-3">
                      {p.is_verified ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="text-slate-500" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.portal_access_enabled ? (
                        <span className="text-emerald-400 text-xs">Enabled</span>
                      ) : (
                        <span className="text-slate-500 text-xs">Disabled</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!p.is_verified && (
                          <button
                            onClick={() => handleVerify(p.id)}
                            title="Verify Parent"
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 transition-all"
                          >
                            <ShieldCheck size={14} />
                          </button>
                        )}
                        <button
                          title="View Details"
                          className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
