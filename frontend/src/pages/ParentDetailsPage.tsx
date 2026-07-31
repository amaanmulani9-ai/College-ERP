import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Users,
  ShieldCheck,
  Link2,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { parentService, ParentItem, StudentParentLink } from "../services/parentService";

type Tab = "overview" | "students" | "documents" | "activity";

export const ParentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parent, setParent] = useState<ParentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [activityLog, setActivityLog] = useState<unknown[]>([]);
  const [linkStudentId, setLinkStudentId] = useState("");
  const [linkPrimary, setLinkPrimary] = useState(false);
  const [linkEmergency, setLinkEmergency] = useState(false);
  const [linkNotes, setLinkNotes] = useState("");
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  const fetchParent = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await parentService.get(id);
      setParent(res.data);
    } catch {
      console.error("Failed to load parent");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    if (!id) return;
    const res = await parentService.activityLog(id);
    setActivityLog(res.data as unknown[]);
  };

  useEffect(() => {
    fetchParent();
  }, [id]);

  useEffect(() => {
    if (activeTab === "activity") fetchActivity();
  }, [activeTab]);

  const handleVerify = async () => {
    if (!id) return;
    await parentService.verify(id);
    fetchParent();
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !linkStudentId) return;
    setLinkSubmitting(true);
    try {
      await parentService.linkStudent(id, {
        student_id: linkStudentId,
        is_primary_contact: linkPrimary,
        is_emergency_contact: linkEmergency,
        notes: linkNotes,
      });
      setLinkStudentId("");
      setLinkPrimary(false);
      setLinkEmergency(false);
      setLinkNotes("");
      fetchParent();
    } catch {
      console.error("Failed to link student");
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleUnlinkStudent = async (studentId: string) => {
    if (!id || !window.confirm("Remove this student link?")) return;
    await parentService.unlinkStudent(id, studentId);
    fetchParent();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center text-slate-400">
        Parent not found.
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <User size={16} /> },
    { key: "students", label: `Students (${parent.student_links.length})`, icon: <Users size={16} /> },
    { key: "documents", label: `Documents (${parent.documents.length})`, icon: <FileText size={16} /> },
    { key: "activity", label: "Activity Log", icon: <Activity size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white p-6">
      {/* Header card */}
      <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-2xl font-bold shadow-lg">
              {parent.profile.first_name.charAt(0)}
              {parent.profile.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {parent.profile.first_name} {parent.profile.last_name}
              </h1>
              <p className="text-slate-400 text-sm">{parent.profile.user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                  {parent.relationship_type_display}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 text-xs font-mono">
                  {parent.parent_code}
                </span>
                {parent.is_verified ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                    <CheckCircle size={10} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs">
                    <XCircle size={10} /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>
          {!parent.is_verified && (
            <button
              onClick={handleVerify}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold transition-all"
            >
              <ShieldCheck size={16} />
              Verify Parent
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-violet-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="Identity">
            <InfoRow label="Occupation" value={parent.occupation || "—"} />
            <InfoRow label="Employer" value={parent.employer_name || "—"} />
            <InfoRow label="Education" value={parent.education_level_display} />
            <InfoRow
              label="Annual Income"
              value={parent.annual_income ? `$${parent.annual_income}` : "—"}
            />
          </InfoCard>
          <InfoCard title="Portal & Notifications">
            <InfoRow label="Portal Access" value={parent.portal_access_enabled ? "Enabled" : "Disabled"} />
            <InfoRow label="Notifications" value={parent.notification_enabled ? "Enabled" : "Disabled"} />
            {parent.communication_preferences && (
              <>
                <InfoRow
                  label="Email Alerts"
                  value={parent.communication_preferences.email_notifications ? "Yes" : "No"}
                />
                <InfoRow
                  label="SMS Alerts"
                  value={parent.communication_preferences.sms_notifications ? "Yes" : "No"}
                />
                <InfoRow
                  label="Attendance Alerts"
                  value={parent.communication_preferences.attendance_alerts ? "Yes" : "No"}
                />
                <InfoRow
                  label="Fee Reminders"
                  value={parent.communication_preferences.fee_reminders ? "Yes" : "No"}
                />
              </>
            )}
          </InfoCard>
          <InfoCard title="Record Info">
            <InfoRow label="Verified At" value={parent.verified_at ? new Date(parent.verified_at).toLocaleString() : "—"} />
            <InfoRow label="Created" value={new Date(parent.created_at).toLocaleString()} />
            <InfoRow label="Updated" value={new Date(parent.updated_at).toLocaleString()} />
          </InfoCard>
        </div>
      )}

      {/* Tab: Students */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {/* Link student form */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-semibold text-violet-300 mb-3 flex items-center gap-2">
              <Link2 size={16} /> Link a Student
            </h3>
            <form onSubmit={handleLinkStudent} className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Student UUID</label>
                <input
                  value={linkStudentId}
                  onChange={(e) => setLinkStudentId(e.target.value)}
                  placeholder="Student ID (UUID)…"
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-violet-400 w-72"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={linkPrimary}
                  onChange={(e) => setLinkPrimary(e.target.checked)}
                  className="accent-violet-500"
                />
                Primary Contact
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={linkEmergency}
                  onChange={(e) => setLinkEmergency(e.target.checked)}
                  className="accent-violet-500"
                />
                Emergency Contact
              </label>
              <button
                type="submit"
                disabled={linkSubmitting || !linkStudentId}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold transition-all disabled:opacity-50"
              >
                <Plus size={14} /> Link
              </button>
            </form>
          </div>

          {/* Linked students */}
          {parent.student_links.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No students linked yet.</p>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {["Student ID", "Name", "Primary", "Emergency", "Can Pickup", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parent.student_links.map((link: StudentParentLink) => (
                    <tr key={link.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-300 text-xs">{link.student_id_code}</td>
                      <td className="px-4 py-3">{link.student_name}</td>
                      <td className="px-4 py-3">
                        {link.is_primary_contact ? <CheckCircle size={14} className="text-emerald-400" /> : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {link.is_emergency_contact ? <CheckCircle size={14} className="text-amber-400" /> : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {link.can_pickup ? <CheckCircle size={14} className="text-blue-400" /> : <XCircle size={14} className="text-slate-500" />}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleUnlinkStudent(link.student)}
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === "documents" && (
        <div>
          {parent.documents.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No documents uploaded.</p>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {["Type", "Document #", "Status", "Uploaded", "Expires"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parent.documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">{doc.document_type_display}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{doc.document_number || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            doc.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : doc.status === "rejected"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {doc.status_display}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {doc.expires_at ? new Date(doc.expires_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Activity Log */}
      {activeTab === "activity" && (
        <div className="space-y-2">
          {activityLog.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No activity recorded.</p>
          ) : (
            (activityLog as Array<{
              id: string;
              activity_type: string;
              description: string;
              actor_email: string;
              timestamp: string;
            }>).map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <Activity size={14} className="text-violet-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{entry.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    by {entry.actor_email || "System"} • {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-xs shrink-0">
                  {entry.activity_type}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
    <h3 className="text-sm font-semibold text-violet-300 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="text-white font-medium text-right max-w-[60%]">{value}</span>
  </div>
);
