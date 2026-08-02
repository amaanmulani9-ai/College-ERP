import React, { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { ScheduleItem } from "./types";
import { MOCK_SCHEDULES } from "./mockDistributionData";
import { ScheduleBuilder } from "./ScheduleBuilder";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { ScheduleTemplates } from "./ScheduleTemplates";
import { ScheduledReports } from "./ScheduledReports";

export const ReportScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(MOCK_SCHEDULES);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "calendar" | "templates">("tasks");

  const handleAddSchedule = (newSch: ScheduleItem) => {
    setSchedules([newSch, ...schedules]);
  };

  const handleToggleStatus = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s
      )
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRunNow = (sch: ScheduleItem) => {
    alert(`Triggered immediate execution for "${sch.reportTitle}" via ${sch.format.toUpperCase()} format!`);
  };

  const handleQuickSchedule = (title: string, freq: string) => {
    const newSch: ScheduleItem = {
      id: `sch-quick-${Date.now()}`,
      reportTitle: title,
      reportId: `rep-${Date.now()}`,
      frequency: "weekly",
      format: "pdf",
      channels: ["email", "workspace-inbox"],
      recipients: ["Department Lead"],
      nextRunTime: "2026-08-05 08:00 AM",
      status: "active",
      createdBy: "Quick Automation",
    };
    handleAddSchedule(newSch);
    setActiveTab("tasks");
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Scheduler Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Automated Report Execution Scheduler</span>
          </h2>
          <p className="text-slate-400 mt-0.5">
            Set up recurring daily, weekly, monthly, or semester-end report generation & delivery.
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Scheduled Task</span>
        </button>
      </div>

      {/* Scheduler Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit font-semibold">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            activeTab === "tasks" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Active Tasks ({schedules.length})
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            activeTab === "calendar" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Execution Calendar Agenda
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            activeTab === "templates" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Preset Automation Templates
        </button>
      </div>

      {/* Tab View Display */}
      {activeTab === "tasks" && (
        <ScheduledReports
          schedules={schedules}
          onToggleStatus={handleToggleStatus}
          onDeleteSchedule={handleDeleteSchedule}
          onRunNow={handleRunNow}
        />
      )}

      {activeTab === "calendar" && <ScheduleCalendar schedules={schedules} />}

      {activeTab === "templates" && (
        <ScheduleTemplates onQuickSchedule={handleQuickSchedule} />
      )}

      {/* Schedule Builder Modal */}
      {isBuilderOpen && (
        <ScheduleBuilder
          onClose={() => setIsBuilderOpen(false)}
          onSaveSchedule={handleAddSchedule}
        />
      )}
    </div>
  );
};
