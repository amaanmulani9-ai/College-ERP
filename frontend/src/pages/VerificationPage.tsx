import React, { useState } from "react";
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { certificateService, VerificationResult } from "../services/certificateService";

export const VerificationPage: React.FC = () => {
  const [certNumber, setCertNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber.trim()) return;
    setVerifying(true);
    setResult(null);

    try {
      const res = await certificateService.verifyCertificate(certNumber.trim());
      setResult(res.data);
    } catch (err: any) {
      if (err.response?.data) {
        setResult(err.response.data);
      } else {
        setResult({ valid: false, message: "Certificate verification failed." });
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-3xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white">Public Certificate Verification Portal</h1>
          <p className="text-slate-400 text-xs max-w-md">
            Enter an official institutional certificate number below to verify document authenticity.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="e.g. CERT-2026-BONAFIDE-A1B2C3"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={verifying}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all"
          >
            <Search className="w-4 h-4" />
            {verifying ? "Verifying..." : "Verify Pass"}
          </button>
        </form>
      </div>

      {result && (
        <div
          className={`p-6 rounded-2xl border shadow-xl space-y-4 ${
            result.valid
              ? "bg-emerald-950/40 border-emerald-500/30 text-slate-100"
              : "bg-rose-950/40 border-rose-500/30 text-slate-100"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            {result.valid ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-400" />
            )}
            <div>
              <h2 className="text-base font-bold text-white">
                {result.valid ? "AUTHENTIC CERTIFICATE VERIFIED" : "VERIFICATION FAILED"}
              </h2>
              <p className="text-xs text-slate-400">
                {result.valid ? "Document record matches institutional database." : result.message}
              </p>
            </div>
          </div>

          {result.valid && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Certificate Number:</span>
                <span className="font-mono font-bold text-emerald-300">{result.certificate_number}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Certificate Type:</span>
                <span className="font-bold text-white">{result.type}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Student Name:</span>
                <span className="font-semibold text-slate-200">{result.student_name}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Student ID:</span>
                <span className="font-mono text-indigo-300">{result.student_id}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Academic Program:</span>
                <span className="text-slate-300">{result.program}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Issued Date:</span>
                <span className="font-mono text-slate-400">
                  {new Date(result.issued_date || "").toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
