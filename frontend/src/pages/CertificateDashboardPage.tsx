import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileCheck, ShieldCheck, Download, Layers, Plus, ArrowRight, Award, Ticket } from "lucide-react";
import { certificateService, CertificateItem, TranscriptItem } from "../services/certificateService";

export const CertificateDashboardPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [certRes, trRes] = await Promise.all([
          certificateService.listCertificates(),
          certificateService.listTranscripts(),
        ]);
        setCertificates(certRes.data.results ?? (certRes.data as unknown as CertificateItem[]));
        setTranscripts(trRes.data.results ?? (trRes.data as unknown as TranscriptItem[]));
      } catch (err) {
        console.error("Failed to load certificate dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 rounded-2xl border border-emerald-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileCheck className="w-7 h-7 text-emerald-400" />
            Enterprise Certificate & Transcript Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated issuance of bonafide, leaving, degree certificates, official transcripts & verification portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/certificates/verify"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Verification Portal
          </Link>
          <Link
            to="/certificates/generate"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Issue Certificate
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Issued Certificates</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{certificates.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Active verified documents</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Official Transcripts</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{transcripts.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Consolidated mark sheets</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Degree & Marksheets</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {certificates.filter((c) => ["DEGREE", "MARKSHEET"].includes(c.certificate_type_detail?.code)).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Academic achievement passes</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Verified System Records</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">100%</p>
          <p className="text-[11px] text-slate-500 mt-1">Tamper-proof certificate hashes</p>
        </div>
      </div>

      {/* Issued Certificates Roster */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Issued Certificates Roster
          </h2>
          <span className="text-xs text-slate-400">Official document registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Certificate Number</th>
                <th className="p-3">Certificate Type</th>
                <th className="p-3">Student ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Issued Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-emerald-300">{cert.certificate_number}</td>
                  <td className="p-3 font-bold text-white">{cert.certificate_type_detail?.name || cert.certificate_type}</td>
                  <td className="p-3 font-mono text-indigo-300">{cert.student_detail?.student_id || cert.student}</td>
                  <td className="p-3 text-slate-300">
                    {cert.student_detail?.profile?.first_name} {cert.student_detail?.profile?.last_name}
                  </td>
                  <td className="p-3 font-mono text-slate-400">{new Date(cert.generated_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px] uppercase">
                      {cert.status_display}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
