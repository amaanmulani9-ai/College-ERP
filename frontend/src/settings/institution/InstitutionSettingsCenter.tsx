import React, { useState } from "react";
import { InstitutionProfilePage } from "./InstitutionProfilePage";
import { CampusManagementPage } from "./CampusManagementPage";
import { AcademicStructurePage } from "./AcademicStructurePage";
import { AcademicSessionPage } from "./AcademicSessionPage";
import { DepartmentManagementPage } from "./DepartmentManagementPage";
import { ProgramManagementPage } from "./ProgramManagementPage";
import { CourseConfigurationPage } from "./CourseConfigurationPage";
import { SemesterConfigurationPage } from "./SemesterConfigurationPage";
import { SectionManagementPage } from "./SectionManagementPage";
import { ClassroomManagementPage } from "./ClassroomManagementPage";
import { CalendarConfigurationPage } from "./CalendarConfigurationPage";
import { WorkingDaysPage } from "./WorkingDaysPage";
import { HolidayConfigurationPage } from "./HolidayConfigurationPage";

export const InstitutionSettingsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "campuses"
    | "structure"
    | "sessions"
    | "departments"
    | "programs"
    | "courses"
    | "semesters"
    | "sections"
    | "classrooms"
    | "calendar"
    | "working-days"
    | "holidays"
  >("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "campuses", label: "Campuses" },
    { id: "structure", label: "Hierarchy Structure" },
    { id: "sessions", label: "Academic Sessions" },
    { id: "departments", label: "Departments" },
    { id: "programs", label: "Programs" },
    { id: "courses", label: "Courses" },
    { id: "semesters", label: "Semesters" },
    { id: "sections", label: "Sections" },
    { id: "classrooms", label: "Classrooms & Labs" },
    { id: "calendar", label: "Calendar" },
    { id: "working-days", label: "Working Days" },
    { id: "holidays", label: "Holidays" },
  ];

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl font-semibold overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === t.id
                ? "bg-indigo-600 text-white font-bold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic Sub-Page View */}
      {activeTab === "profile" && <InstitutionProfilePage />}
      {activeTab === "campuses" && <CampusManagementPage />}
      {activeTab === "structure" && <AcademicStructurePage />}
      {activeTab === "sessions" && <AcademicSessionPage />}
      {activeTab === "departments" && <DepartmentManagementPage />}
      {activeTab === "programs" && <ProgramManagementPage />}
      {activeTab === "courses" && <CourseConfigurationPage />}
      {activeTab === "semesters" && <SemesterConfigurationPage />}
      {activeTab === "sections" && <SectionManagementPage />}
      {activeTab === "classrooms" && <ClassroomManagementPage />}
      {activeTab === "calendar" && <CalendarConfigurationPage />}
      {activeTab === "working-days" && <WorkingDaysPage />}
      {activeTab === "holidays" && <HolidayConfigurationPage />}
    </div>
  );
};

export default InstitutionSettingsCenter;
