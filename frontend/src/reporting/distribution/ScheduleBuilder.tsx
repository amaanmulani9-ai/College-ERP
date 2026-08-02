import React, { useState } from "react";
import { Clock, Send, Calendar, FileText, CheckCircle2, X } from "lucide-react";
import { ScheduleFrequency, ExportFormat, DeliveryChannel, ScheduleItem } from "./types";

interface ScheduleBuilderProps {
  onClose: () => void;
  onSaveSchedule: (newSch: ScheduleItem) => void;
}

export const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  onClose,
  onSaveSchedule,
}) => {
  const [reportTitle, setReportTitle] = useState("Weekly Attendance & Performance Audit");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("weekly");
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [channels, setChannels] = useState<DeliveryChannel[]>(["email", "workspace-inbox"]);
  const [recipients, setRecipients] = useState<string>("HOD, Principal, Academic Dean");
  const [runTime, setRunTime] = useState("08:00 AM");

  const toggleChannel = (ch: DeliveryChannel) => {
    if (channels.includes(ch)) {
      setChannels(channels.filter((c) => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSave = () => {
    const newSch: ScheduleItem = {
      id: `sch-${Date.now()}`,
      reportTitle,
      reportId: `rep-${Date.now()}`,
      frequency,
      format,
      channels,
      recipients: recipients.split(",").map((s) => s.trim()),
      nextRunTime: `2026-08-05 ${runTime}`,
      status: "active",
      createdBy: "Current User",
    };
    onSaveSchedule(newSch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-xs font-sans space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Schedule Automated Report Delivery</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Select Target Report
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Execution Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
              >
                <option value="one-time">One Time Run</option>
                <option value="hourly">Hourly (System)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Mondays)</option>
                <option value="monthly">Monthly (1st of Month)</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="academic-session">Academic Semester End</option>
                <option value="custom-cron">Custom Cron Expression</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Export File Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="excel">Excel Workbook (.xlsx)</option>
                <option value="csv">CSV Spreadsheet (.csv)</option>
                <option value="json">JSON Data Stream (.json)</option>
                <option value="png">PNG Image Snapshot (.png)</option>
                <option value="svg">SVG Vector Image (.svg)</option>
                <option value="print">Direct Printer Spool</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Delivery Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {(["email", "workspace-inbox", "download", "notification", "shared-reports"] as DeliveryChannel[]).map(
                (ch) => {
                  const selected = channels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] capitalize transition-colors ${
                        selected
                          ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {ch.replace("-", " ")}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Recipients & Roles (Comma separated)
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="e.g. Principal, HOD, finance@college.edu..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
