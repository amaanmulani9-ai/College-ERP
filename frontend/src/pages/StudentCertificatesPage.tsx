import React, { useEffect, useState } from "react";
import { Download, FileCheck, Search } from "lucide-react";
import { certificateService, CertificateItem } from "../services/certificateService";
import { studentService, StudentItem } from "../services/studentService";

export const StudentCertificatesPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfPayload, setPdfPayload] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.listStudents();
        const fetched = res.data.results ?? (res.data as unknown as StudentItem[]);
        setStudents(fetched);
        if (fetched.length) {
          setSelectedStudent(fetched[0].id);
          fetchStudentCerts(fetched[0].id);
        }
      } catch (err) {
        console.error("Failed to load students for cert history", err);
      }
    };
    fetchStudents();
  }, []);

  const fetchStudentCerts = async (stId: string) => {
    setLoading(true);
    setPdfPayload(null);
    try {
      const res = await certificateService.getStudentCertificates(stId);
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to load student certificates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (stId: string) => {
    setSelectedStudent(stId);
    fetchStudentCerts(stId);
  };

  const handleDownload = async (certId: string) => {
    try {
      const res = await certificateService.downloadPDF(certId);
      setPdfPayload(res.data);
    } catch (err) {
      console.error("Failed to download PDF payload", err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-400" />
              Student Certificate Repository & Downloads
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              View and download all official certificates issued to a specific student.
            </p>
          </div>

          <div className="w-full md:w-72">
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.student_id} — {st.profile?.first_name} {st.profile?.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {pdfPayload && (
        <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-2">
          <h3 className="text-sm font-bold text-emerald-300">Generated Certificate Payload Preview</h3>
          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto">
            {JSON.stringify(pdfPayload, null, 2)}
          </pre>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white">Issued Certificates ({certificates.length})</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Certificate Number</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Issued Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-emerald-300">{cert.certificate_number}</td>
                    <td className="p-3 text-white font-semibold">
                      {cert.certificate_type_detail?.name || cert.certificate_type}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{new Date(cert.generated_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px] uppercase">
                        {cert.status_display}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDownload(cert.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg text-[11px] font-semibold transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
