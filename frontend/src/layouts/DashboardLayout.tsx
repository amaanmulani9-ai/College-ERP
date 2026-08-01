import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  CreditCard,
  Building,
  BarChart2,
  Shield,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Globe,
  Command,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserMenuDropdown } from "../components/auth/UserMenuDropdown";
import { SecurityIndicatorBar } from "../components/auth/SecurityIndicatorBar";
import { ThemeToggle } from "../components/public/ThemeToggle";
import { Breadcrumbs } from "../components/dashboard/Breadcrumbs";

export interface NavGroup {
  groupLabel: string;
  items: {
    label: string;
    route: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { tenant, user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuGroups: NavGroup[] = [
    {
      groupLabel: "Main",
      items: [
        { label: "Dashboard", route: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      groupLabel: "Academics",
      items: [
        { label: "Academic Courses", route: "/academics/departments", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Class Timetables", route: "/timetable", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Examinations", route: "/examinations", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Grades & Results", route: "/results", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Certificates", route: "/certificates", icon: <BookOpen className="w-4 h-4" /> },
      ],
    },
    {
      groupLabel: "Directory",
      items: [
        { label: "Student Directory", route: "/students", icon: <Users className="w-4 h-4" />, badge: "2.4k" },
        { label: "Admissions Portal", route: "/admissions", icon: <Users className="w-4 h-4" /> },
        { label: "Faculty & Staff", route: "/staff", icon: <UserCheck className="w-4 h-4" /> },
        { label: "Parent Portal", route: "/parents", icon: <Users className="w-4 h-4" /> },
      ],
    },
    {
      groupLabel: "Finance",
      items: [
        { label: "Fee Structures", route: "/fees", icon: <CreditCard className="w-4 h-4" /> },
        { label: "Payment Collections", route: "/payments", icon: <CreditCard className="w-4 h-4" /> },
        { label: "Scholarships", route: "/scholarships", icon: <CreditCard className="w-4 h-4" /> },
      ],
    },
    {
      groupLabel: "Campus Facilities",
      items: [
        { label: "Digital Library", route: "/library", icon: <Building className="w-4 h-4" /> },
        { label: "Hostels & Beds", route: "/hostel", icon: <Building className="w-4 h-4" /> },
      ],
    },
    {
      groupLabel: "Administration",
      items: [
        { label: "Analytics & Reports", route: "/reports/naac-nirf", icon: <BarChart2 className="w-4 h-4" /> },
        { label: "RBAC & Permissions", route: "/rbac/roles", icon: <Shield className="w-4 h-4" /> },
        { label: "System Settings", route: "/profile/security", icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Security Status Bar */}
      <SecurityIndicatorBar />

      {/* Main Top Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Controls & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white leading-tight">College ERP</span>
              <span className="text-[10px] text-indigo-400 font-mono font-semibold">Enterprise Portal</span>
            </div>
          </Link>

          {/* Academic Session & Tenant Badges */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-800">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono font-bold text-slate-300">
              AY 2026-2027
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-[11px] font-mono font-bold text-indigo-300">
              Tenant: {tenant || "stanford-demo"}
            </span>
          </div>
        </div>

        {/* Search & Quick Action Center */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students, modules, courses or staff... (Ctrl + K)"
              className="w-full pl-10 pr-12 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <kbd className="absolute right-3 top-2 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 rounded text-slate-400 pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & Profile Menu */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/students/create"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1"
            title="Quick Action: Create Student"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Quick Action</span>
          </Link>

          <button
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
          </button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <UserMenuDropdown />
        </div>
      </header>

      {/* Main Body Workspace (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-900 bg-slate-950 transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Collapse Toggle Button */}
          <div className="p-3 border-b border-slate-900 flex justify-end">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <span className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    {group.groupLabel}
                  </span>
                )}
                {group.items.map((item, itemIdx) => {
                  const isActive = location.pathname === item.route;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.route}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 shadow-inner"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                      }`}
                      title={item.label}
                    >
                      <span className={isActive ? "text-indigo-400" : "text-slate-400"}>{item.icon}</span>
                      {!isSidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!isSidebarCollapsed && item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-900 text-indigo-300 border border-slate-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="w-72 bg-slate-950 border-r border-slate-800 h-full p-4 overflow-y-auto space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-white">Navigation Menu</span>
                  <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {menuGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                        {group.groupLabel}
                      </span>
                      {group.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          to={item.route}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* Command Palette Floating Shortcut */}
      <button
        onClick={() => alert("Command Palette (Ctrl + K) feature coming in UI-003 Part 4!")}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/40 z-30 transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Open Command Palette"
      >
        <Command className="w-5 h-5" />
      </button>
    </div>
  );
};
