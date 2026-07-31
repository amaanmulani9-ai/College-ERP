import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn, UserPlus, User, GraduationCap, Server, ShieldCheck, Key, Table, Users, Settings, History, Edit3, Landmark, Building2, BookOpen, Calendar, Layers, FileText, CheckSquare, UserCheck, BarChart3, FileSpreadsheet, Award, Briefcase, HeartHandshake, FileCheck, FilePlus } from "lucide-react";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const staffItems = [
    { label: "Staff Directory", path: "/staff", icon: Briefcase },
    { label: "Onboard Staff", path: "/staff/create", icon: UserCheck },
    { label: "Designations", path: "/staff/designations", icon: Award },
    { label: "HR Analytics", path: "/staff/statistics", icon: BarChart3 },
  ];

  const studentItems = [
    { label: "Student Roster", path: "/students", icon: Users },
    { label: "Onboard Student", path: "/students/create", icon: UserCheck },
    { label: "Population Analytics", path: "/students/statistics", icon: BarChart3 },
    { label: "Bulk CSV Ops", path: "/students/import-export", icon: FileSpreadsheet },
  ];

  const academicItems = [
    { label: "Faculties & Schools", path: "/academics/faculties", icon: Landmark },
    { label: "Departments", path: "/academics/departments", icon: Building2 },
    { label: "Academic Programs", path: "/academics/programs", icon: BookOpen },
    { label: "Academic Sessions", path: "/academics/sessions", icon: Calendar },
    { label: "Semesters", path: "/academics/semesters", icon: Layers },
    { label: "Subjects Catalog", path: "/academics/subjects", icon: FileText },
    { label: "Subject Offerings", path: "/academics/offerings", icon: CheckSquare },
  ];

  const profileItems = [
    { label: "My Profile", path: "/profile/me", icon: User },
    { label: "Edit Profile", path: "/profile/edit", icon: Edit3 },
    { label: "Preferences", path: "/profile/preferences", icon: Settings },
    { label: "Activity Timeline", path: "/profile/timeline", icon: History },
  ];

  const rbacItems = [
    { label: "Role Management", path: "/rbac/roles", icon: ShieldCheck },
    { label: "Permission Catalog", path: "/rbac/permissions", icon: Key },
    { label: "Permission Matrix", path: "/rbac/matrix", icon: Table },
    { label: "Assign User Roles", path: "/rbac/assign-roles", icon: Users },
  ];

  const parentItems = [
    { label: "Parents & Guardians", path: "/parents", icon: HeartHandshake },
  ];

  const admissionItems = [
    { label: "Admissions Hub", path: "/admissions", icon: LayoutDashboard },
    { label: "Applications Roster", path: "/admissions/applications", icon: FileText },
    { label: "New Application", path: "/admissions/create", icon: FilePlus },
    { label: "Doc Verification", path: "/admissions/documents", icon: FileCheck },
    { label: "Seat Matrix", path: "/admissions/seat-matrix", icon: Layers },
  ];

  const timetableItems = [
    { label: "Timetable Hub", path: "/timetable", icon: LayoutDashboard },
    { label: "Weekly Schedule", path: "/timetable/weekly", icon: Calendar },
    { label: "Conflict Checker", path: "/timetable/conflict-checker", icon: AlertTriangle },
  ];

  const attendanceItems = [
    { label: "Attendance Hub", path: "/attendance", icon: LayoutDashboard },
    { label: "Take Attendance", path: "/attendance/take", icon: CheckSquare },
    { label: "Reports & Analytics", path: "/attendance/reports", icon: PieChart },
  ];

  const examItems = [
    { label: "Exam Hub", path: "/examinations", icon: LayoutDashboard },
    { label: "Exam Schedules", path: "/examinations/schedules", icon: Calendar },
    { label: "Hall Tickets", path: "/examinations/hall-tickets", icon: Ticket },
  ];

  const resultItems = [
    { label: "Result Hub", path: "/results", icon: LayoutDashboard },
    { label: "Marks Entry", path: "/results/entry", icon: FileText },
    { label: "Publish Results", path: "/results/publish", icon: CheckSquare },
    { label: "Transcript Preview", path: "/results/student", icon: Trophy },
  ];

  const certItems = [
    { label: "Certificate Hub", path: "/certificates", icon: LayoutDashboard },
    { label: "Issue Certificate", path: "/certificates/generate", icon: FileCheck },
    { label: "Student Repository", path: "/certificates/student-certs", icon: Ticket },
    { label: "Verification Portal", path: "/certificates/verify", icon: ShieldCheck },
  ];

  const feeItems = [
    { label: "Fee Dashboard", path: "/fees", icon: LayoutDashboard },
    { label: "Fee Structures", path: "/fees/structure", icon: Layers },
    { label: "Collect Fee", path: "/fees/collect", icon: CheckSquare },
    { label: "Outstanding Report", path: "/fees/outstanding", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide">College ERP</h1>
            <p className="text-[10px] text-indigo-400 font-mono">Staff Engine v1.0</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-4">
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Staff & HR Management
            </div>
            {staffItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Student Management
            </div>
            {studentItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Academic Engine
            </div>
            {academicItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Identity & Profile
            </div>
            {profileItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Access Control (RBAC)
            </div>
            {rbacItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Admissions Engine
            </div>
            {admissionItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Timetable Engine
            </div>
            {timetableItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Attendance Engine
            </div>
            {attendanceItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Examinations Engine
            </div>
            {examItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Result Engine
            </div>
            {resultItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Certificates Engine
            </div>
            {certItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Fee Management
            </div>
            {feeItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Parent Portal
            </div>
            {parentItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 m-4 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-slate-300">Staff System</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Employee Codes, Designation Ranks & Status Auditing.
        </p>
      </div>
    </aside>
  );
};
