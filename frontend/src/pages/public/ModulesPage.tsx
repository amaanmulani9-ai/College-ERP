import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  Building2,
  Calendar,
  CreditCard,
  BookOpen,
  Hotel,
  Award,
  CheckCircle2,
  Search,
  ArrowUpRight,
  Shield,
  FileCheck,
  Percent,
} from "lucide-react";

export const ModulesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const modules = [
    { id: "TASK-001", code: "v0.1.0", name: "Workspace & Foundation", category: "core", icon: <Building2 />, desc: "Multi-tenant Django setup, schema isolation & Vite React foundation." },
    { id: "TASK-002", code: "v0.2.0", name: "Multi-Tenant SaaS Architecture", category: "core", icon: <Shield />, desc: "django-tenants schema resolution, domain routing & tenant database routing." },
    { id: "TASK-003", code: "v0.3.0", name: "Enterprise Authentication", category: "core", icon: <Shield />, desc: "Email-based custom user model, SimpleJWT refresh rotation & lockout safeguards." },
    { id: "TASK-004", code: "v0.4.0", name: "Enterprise RBAC System", category: "core", icon: <Shield />, desc: "14 default institutional roles & Redis permission key caching." },
    { id: "TASK-005", code: "v0.5.0", name: "User Profile Management", category: "core", icon: <Users />, desc: "Centralized user identity, avatar upload/deletion safeguards & profile completion index." },
    { id: "TASK-006", code: "v0.6.0", name: "Academic Structure Engine", category: "academic", icon: <GraduationCap />, desc: "Faculty → Department → Program → AcademicSession → Semester → Subject → Offering." },
    { id: "TASK-007", code: "v0.7.0", name: "Student Management System", category: "academic", icon: <Users />, desc: "Auto Student IDs, status lifecycle audit, academic mapping & bulk import/export." },
    { id: "TASK-008", code: "v0.8.0", name: "Staff & HR Management", category: "administrative", icon: <Users />, desc: "Auto Employee IDs, designation catalog, employment audit & staff analytics." },
    { id: "TASK-009", code: "v0.9.0", name: "Parent & Guardian Management", category: "administrative", icon: <Users />, desc: "Multi-student parent links, document verification workflow & parent communication engine." },
    { id: "TASK-010", code: "v0.10.0", name: "Admissions Management System", category: "academic", icon: <FileCheck />, desc: "Online application submission, document verification, seat matrix & enrollment workflow." },
    { id: "TASK-011", code: "v0.11.0", name: "Timetable Management System", category: "academic", icon: <Calendar />, desc: "Weekly schedule grid, classroom scheduling, conflict checking & teacher allocation." },
    { id: "TASK-012", code: "v0.12.0", name: "Attendance Management System", category: "academic", icon: <Calendar />, desc: "Daily & subject attendance, biometric integration, deficit alerts & parent notifications." },
    { id: "TASK-013", code: "v0.13.0", name: "Examination Management System", category: "academic", icon: <Award />, desc: "Exam schedules, hall ticket generation, exam centers & supervisor assignments." },
    { id: "TASK-014", code: "v0.14.0", name: "Result Management System", category: "academic", icon: <Award />, desc: "Marks entry, automated GPA/CGPA grading rules, grade publish & result analytics." },
    { id: "TASK-015", code: "v0.15.0", name: "Certificates & Transcripts", category: "academic", icon: <Award />, desc: "Bonafide, degree, transcript PDF generation with verification QR codes." },
    { id: "TASK-016", code: "v0.16.0", name: "Fee Management System", category: "finance", icon: <CreditCard />, desc: "Academic tuition, exam, hostel fee structures, collection counter & receipt logs." },
    { id: "TASK-017", code: "v0.17.0", name: "Payment Gateway Integration", category: "finance", icon: <CreditCard />, desc: "Razorpay & Stripe checkout, webhook status sync, transaction history & refunds." },
    { id: "TASK-018", code: "v0.18.0", name: "Scholarship Management", category: "finance", icon: <Percent />, desc: "Institutional & govt scholarships, eligibility rules, application review & renewals." },
    { id: "TASK-019", code: "v0.19.0", name: "Library Management System", category: "operations", icon: <BookOpen />, desc: "Book catalog, ISBN search, issue/return barcode workflow, reservations & fine calculations." },
    { id: "TASK-020", code: "v0.20.0", name: "Hostel Management System", category: "operations", icon: <Hotel />, desc: "Hostel buildings, blocks, rooms, bed allocations, visitor log & maintenance tickets." },
  ];

  const filtered = modules.filter((m) => {
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Enterprise Module Catalog
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore All{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            20 Integrated Modules
          </span>
        </h1>
        <p className="text-slate-300 text-base">
          From core multi-tenant security to academics, finance, exams, and campus operations.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: "all", name: "All Modules (20)" },
            { id: "core", name: "Core & Security (5)" },
            { id: "academic", name: "Academics & Exams (8)" },
            { id: "administrative", name: "Staff & Parents (2)" },
            { id: "finance", name: "Finance & Fees (3)" },
            { id: "operations", name: "Library & Hostel (2)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  {m.icon}
                </div>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-semibold">
                  {m.code}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{m.id}</span>
              <Link
                to="/dashboard"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
              >
                Launch Module <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
