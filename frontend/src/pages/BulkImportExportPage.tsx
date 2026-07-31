import React, { useState } from "react";
import { FileSpreadsheet, Upload, Download, CheckCircle } from "lucide-react";
import { studentService } from "../services/studentService";

export const BulkImportExportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await studentService.bulkImport(formData);
      setMessage(res.detail || "Import triggered.");
    } catch (err) {
      alert("Failed to import CSV.");
    }
  };

  const handleExport = async () => {
    try {
      const res = await studentService.bulkExport();
      setMessage(res.detail || "Export triggered.");
    } catch (err) {
      alert("Failed to export CSV.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
          Bulk Operations (CSV Import / Export)
        </h1>
        <p className="text-xs text-slate-400">Batch onboard students or stream export institutional records.</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Import */}
        <form onSubmit={handleImport} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Bulk CSV Import</h2>
          <p className="text-xs text-slate-400">Upload CSV template containing student records.</p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700"
          />
          <button
            type="submit"
            disabled={!file}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" /> Start Bulk Import
          </button>
        </form>

        {/* Bulk Export */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Bulk CSV Export</h2>
            <p className="text-xs text-slate-400 mt-2">Export complete student roster with academic and contact details.</p>
          </div>
          <button
            onClick={handleExport}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" /> Generate CSV Export
          </button>
        </div>
      </div>
    </div>
  );
};
