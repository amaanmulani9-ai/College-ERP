import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileCheck, Check, X, Filter, ExternalLink, RefreshCw } from "lucide-react";
import { admissionService, AdmissionDocumentItem } from "../services/admissionService";

export const DocumentVerificationPage: React.FC = () => {
  const [documents, setDocuments] = useState<AdmissionDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState("pending");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (reviewFilter) params.review_status = reviewFilter;
      const res = await admissionService.listDocuments(params);
      setDocuments(res.data.results ?? (res.data as unknown as AdmissionDocumentItem[]));
    } catch (err) {
      console.error("Failed to load documents for verification", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [reviewFilter]);

  const handleReview = async (docId: string, statusVal: string) => {
    try {
      await admissionService.reviewDocument(docId, statusVal, "Reviewed in Verification Console");
      fetchDocuments();
    } catch (err) {
      console.error("Document review failed", err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-purple-400" />
            Document Verification Console
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Review applicant Aadhaar, marksheets, certificates, and photos.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Strip */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Review Status:</span>
          <select
            value={reviewFilter}
            onChange={(e) => setReviewFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Documents</option>
            <option value="pending">Pending Review Only</option>
            <option value="approved">Approved Documents</option>
            <option value="rejected">Rejected Documents</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">{documents.length} item(s) found</span>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
          No documents found matching the filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">{doc.document_type_display}</span>
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
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>
                    <span className="text-slate-500">Application #:</span>{" "}
                    <Link to={`/admissions/applications/${doc.application}`} className="text-indigo-400 hover:underline font-mono">
                      View Application
                    </Link>
                  </p>
                  <p>
                    <span className="text-slate-500">Uploaded:</span>{" "}
                    {new Date(doc.uploaded_at).toLocaleString()}
                  </p>
                  {doc.reviewed_by_name && (
                    <p>
                      <span className="text-slate-500">Reviewed By:</span> {doc.reviewed_by_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open File
                </a>

                {doc.review_status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReview(doc.id, "approved")}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReview(doc.id, "rejected")}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
