import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  Upload,
  User,
  History,
  FileCheck,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import {
  admissionService,
  AdmissionApplicationItem,
  AdmissionDocumentItem,
  StatusHistoryItem,
} from "../services/admissionService";

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<AdmissionApplicationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "history" | "audit">("overview");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Document upload state
  const [docType, setDocType] = useState("aadhaar");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const fetchApplication = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await admissionService.getApplication(id);
      setApp(res.data);
    } catch (err) {
      console.error("Failed to load application details", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    if (!id) return;
    try {
      const res = await admissionService.getAuditLog(id);
      setAuditLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch audit log", err);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  useEffect(() => {
    if (activeTab === "audit") {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleStateTransition = async (targetState: string) => {
    if (!id) return;
    setTransitioning(true);
    try {
      await admissionService.transitionApplication(id, targetState, remarks);
      setRemarks("");
      fetchApplication();
    } catch (err: any) {
      alert(err.response?.data?.detail || "State transition failed");
    } finally {
      setTransitioning(false);
    }
  };

  const handleEnroll = async () => {
    if (!id) return;
    if (!window.confirm("Trigger automated Enrollment Pipeline? This will create User, Student & Parent records.")) return;
    setTransitioning(true);
    try {
      const res = await admissionService.enrollApplication(id);
      alert(`Successfully Enrolled! Created Student ID: ${res.data.student_id}`);
      fetchApplication();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Enrollment failed");
    } finally {
      setTransitioning(false);
    }
  };

  const handleDocumentReview = async (docId: string, statusVal: string) => {
    try {
      await admissionService.reviewDocument(docId, statusVal, "Reviewed by admissions staff");
      fetchApplication();
    } catch (err) {
      console.error("Document review failed", err);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !docFile) return;
    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("application", id);
      formData.append("document_type", docType);
      formData.append("file", docFile);
      await admissionService.uploadDocument(formData);
      setDocFile(null);
      fetchApplication();
    } catch (err) {
      console.error("Upload document failed", err);
    } finally {
      setUploadingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <p>Application record not found.</p>
        <button
          onClick={() => navigate("/admissions/applications")}
          className="px-4 py-2 bg-slate-800 text-xs text-slate-200 rounded-xl"
        >
          Return to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admissions/applications")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications List
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">ID: {app.id}</span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono">{app.application_number}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {app.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-slate-300 text-sm font-medium mt-1">
              {app.first_name} {app.middle_name} {app.last_name} — {app.email} ({app.mobile})
            </p>
          </div>

          {/* Action buttons based on current state */}
          <div className="flex flex-wrap items-center gap-2">
            {app.status === "draft" && (
              <button
                onClick={() => handleStateTransition("submitted")}
                disabled={transitioning}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Submit Application
              </button>
            )}

            {app.status === "submitted" && (
              <button
                onClick={() => handleStateTransition("under_review")}
                disabled={transitioning}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Start Review
              </button>
            )}

            {app.status === "under_review" && (
              <button
                onClick={() => handleStateTransition("document_verification")}
                disabled={transitioning}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Verify Documents
              </button>
            )}

            {app.status === "document_verification" && (
              <>
                <button
                  onClick={() => handleStateTransition("approved")}
                  disabled={transitioning}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => handleStateTransition("rejected")}
                  disabled={transitioning}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Reject
                </button>
              </>
            )}

            {app.status === "approved" && (
              <button
                onClick={handleEnroll}
                disabled={transitioning}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Enroll Student Now
              </button>
            )}

            {app.status === "enrolled" && app.enrolled_student_detail && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Enrolled Student ID: {app.enrolled_student_detail.student_id}
              </div>
            )}
          </div>
        </div>

        {/* Remarks Input */}
        {app.status !== "enrolled" && app.status !== "rejected" && app.status !== "cancelled" && (
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Optional transition remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Tabs Header */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
          }`}
        >
          Applicant Profile
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "documents"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
          }`}
        >
          Documents ({app.documents?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "history"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
          }`}
        >
          Workflow History ({app.status_history?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "audit"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
          }`}
        >
          Audit Log
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PII Card */}
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Full Name</span>
                <span className="text-white font-medium">
                  {app.first_name} {app.middle_name} {app.last_name}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Gender / DOB</span>
                <span className="text-white font-medium">
                  {app.gender} / {app.date_of_birth || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Nationality</span>
                <span className="text-white font-medium">{app.nationality || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="text-white font-medium">{app.category}</span>
              </div>
            </div>
          </div>

          {/* Academic Intent Card */}
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Academic Intent & Qualification
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Applying Program</span>
                <span className="text-indigo-300 font-semibold">
                  {app.program_detail?.name || app.program}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Department</span>
                <span className="text-white font-medium">
                  {app.department_detail?.name || app.department}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Academic Session</span>
                <span className="text-white font-medium">
                  {app.academic_session_detail?.name || app.academic_session}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Previous Qualification / CGPA</span>
                <span className="text-white font-medium">
                  {app.previous_qualification || "N/A"} ({app.percentage_cgpa ? `${app.percentage_cgpa}%` : "N/A"})
                </span>
              </div>
            </div>
          </div>

          {/* Guardian Info Card */}
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Guardian & Contact Details (Parent Account Creation Payload)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Guardian Name</span>
                <span className="text-white font-medium">{app.guardian_name || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Guardian Email</span>
                <span className="text-white font-medium">{app.guardian_email || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Guardian Phone / Rel</span>
                <span className="text-white font-medium">
                  {app.guardian_phone || "N/A"} ({app.guardian_relationship})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Upload Form */}
          <form onSubmit={handleFileUpload} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2"
            >
              <option value="aadhaar">Aadhaar Card</option>
              <option value="birth_certificate">Birth Certificate</option>
              <option value="marksheet">Marksheet</option>
              <option value="transfer_certificate">Transfer Certificate</option>
              <option value="leaving_certificate">Leaving Certificate</option>
              <option value="photo">Passport Photo</option>
              <option value="signature">Signature</option>
              <option value="income_certificate">Income Certificate</option>
              <option value="caste_certificate">Caste Certificate</option>
              <option value="other">Other Document</option>
            </select>

            <input
              type="file"
              onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
              className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-slate-800 file:text-slate-200 file:text-xs hover:file:bg-slate-700"
            />

            <button
              type="submit"
              disabled={uploadingDoc || !docFile}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </button>
          </form>

          {/* Documents Table */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">File</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reviewed By</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {app.documents && app.documents.length > 0 ? (
                  app.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-white">{doc.document_type_display}</td>
                      <td className="p-3">
                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline font-mono"
                        >
                          View File
                        </a>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            doc.review_status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : doc.review_status === "rejected"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {doc.review_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{doc.reviewed_by_name || "—"}</td>
                      <td className="p-3 text-right">
                        {doc.review_status === "pending" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDocumentReview(doc.id, "approved")}
                              className="p-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg"
                              title="Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDocumentReview(doc.id, "rejected")}
                              className="p-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg"
                              title="Reject"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No documents uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === "history" && (
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            Application State Transitions Timeline
          </h2>
          <div className="space-y-3">
            {app.status_history && app.status_history.length > 0 ? (
              app.status_history.map((h) => (
                <div key={h.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono text-indigo-300">
                      {h.previous_status} → {h.new_status}
                    </span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{h.remarks || "No remarks provided."}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>{h.changed_by_name || "System"}</div>
                    <div>{new Date(h.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs text-center py-6">No transition history recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === "audit" && (
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            Admissions Fine-Grained Audit Log
          </h2>
          <div className="space-y-2.5">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.map((log: any) => (
                <div key={log.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-indigo-400">{log.event_type}</span>
                    <p className="text-slate-300 mt-0.5">{log.description}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>{log.actor_email || "System"}</div>
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs text-center py-6">No audit records found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
