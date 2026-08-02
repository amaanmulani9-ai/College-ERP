import React, { useEffect, useState } from "react";
import { FileCheck, Award, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { certificateService, CertificateTypeItem } from "../services/certificateService";
import { studentService, StudentItem } from "../services/studentService";

export const GenerateCertificatePage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [certTypes, setCertTypes] = useState<CertificateTypeItem[]>([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [generatingCert, setGeneratingCert] = useState(false);
  const [generatingTranscript, setGeneratingTranscript] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, typeRes] = await Promise.all([
          studentService.listStudents(),
          certificateService.listTypes(),
        ]);
        const fetchedStudents = stRes.data.results ?? (stRes.data as unknown as StudentItem[]);
        const fetchedTypes = typeRes.data.results ?? (typeRes.data as unknown as CertificateTypeItem[]);

        setStudents(fetchedStudents);
        setCertTypes(fetchedTypes);

        if (fetchedStudents.length) setSelectedStudent(fetchedStudents[0].id);
        if (fetchedTypes.length) setSelectedType(fetchedTypes[0].id);
      } catch (err) {
        console.error("Failed to load options for certificate generator", err);
      }
    };
    fetchData();
  }, []);

  const handleGenerateCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedType) return;
    setGeneratingCert(true);
    setMessage(null);

    try {
      const res = await certificateService.generateCertificate(selectedStudent, selectedType);
      setMessage({ type: "success", text: `Certificate ${res.data.certificate_number} issued successfully!` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to issue certificate." });
    } finally {
      setGeneratingCert(false);
    }
  };

  const handleGenerateTranscript = async () => {
    if (!selectedStudent) return;
    setGeneratingTranscript(true);
    setMessage(null);

    try {
      const res = await certificateService.generateTranscript(selectedStudent);
      setMessage({ type: "success", text: `Official Transcript generated! CGPA: ${res.data.cgpa}` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to generate transcript." });
    } finally {
      setGeneratingTranscript(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-4xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            Issue Certificate & Official Transcript
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Generate tamper-proof academic certificates or consolidated student transcripts.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/60 border border-rose-500/30 text-rose-300"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            {message.text}
          </div>
        )}

        <form onSubmit={handleGenerateCert} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Select Student *</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.student_id} — {st.profile?.first_name} {st.profile?.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Select Certificate Type *</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {certTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={generatingCert}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              <FileCheck className="w-4 h-4" />
              {generatingCert ? "Issuing..." : "Issue Certificate"}
            </button>

            <button
              type="button"
              onClick={handleGenerateTranscript}
              disabled={generatingTranscript}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              <Award className="w-4 h-4" />
              {generatingTranscript ? "Generating..." : "Generate Official Transcript"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
