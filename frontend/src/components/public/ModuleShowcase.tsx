import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  Key,
  UserCheck,
  User,
  GraduationCap,
  Users,
  Briefcase,
  HeartHandshake,
  FileSpreadsheet,
  Calendar,
  Clock,
  Award,
  FileCheck2,
  FileBadge,
  CreditCard,
  Wallet,
  Gift,
  BookOpen,
  Building2,
  X,
  CheckCircle2,
  Filter,
  ArrowRight,
} from "lucide-react";

export interface ModuleDetail {
  id: string;
  code: string;
  name: string;
  category: "Platform" | "Academic" | "People" | "Finance" | "Campus" | "Security";
  status: "Released" | "Production Ready";
  version: string;
  shortDesc: string;
  purpose: string;
  keyFeatures: string[];
  roadmap: string[];
  icon: React.ReactNode;
}

export const ModuleShowcase: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleDetail | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const modules: ModuleDetail[] = [
    {
      id: "001",
      code: "TASK-001",
      name: "Workspace Foundation",
      category: "Platform",
      status: "Production Ready",
      version: "v0.1.0",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      shortDesc: "Multi-app backend & React 19 Vite architecture setup.",
      purpose: "Provide high-performance baseline structure for multi-tenant educational enterprise apps.",
      keyFeatures: [
        "Django 5 & Python 3.13 backend core",
        "React 19 + TypeScript + Vite frontend client",
        "TailwindCSS dark mode & styling tokens",
        "Global error handling & API standards",
      ],
      roadmap: ["Next.js SSR support optional layer", "Micro-frontend web component export"],
    },
    {
      id: "002",
      code: "TASK-002",
      name: "Multi-Tenant Architecture",
      category: "Platform",
      status: "Production Ready",
      version: "v0.2.0",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      shortDesc: "PostgreSQL schema isolation via django-tenants.",
      purpose: "Guarantee institution-level data isolation, zero data leaks, and custom domain routing.",
      keyFeatures: [
        "Schema-per-tenant isolation on PostgreSQL 16",
        "Tenant auto-provisioning management commands",
        "Subdomain & custom domain router middleware",
        "Tenant metadata and status tracking",
      ],
      roadmap: ["Cross-tenant global analytical data lake", "Automated tenant schema backup pipeline"],
    },
    {
      id: "003",
      code: "TASK-003",
      name: "Enterprise Authentication",
      category: "Security",
      status: "Production Ready",
      version: "v0.3.0",
      icon: <Key className="w-5 h-5 text-amber-400" />,
      shortDesc: "Custom email user model, SimpleJWT & lockout protection.",
      purpose: "Secure authentication layer with JWT token rotation and audit tracking.",
      keyFeatures: [
        "Custom email-based User authentication model",
        "SimpleJWT access & refresh token rotation",
        "Login lockout safeguards & failed attempt tracking",
        "Detailed authentication audit logging",
      ],
      roadmap: ["OAuth2 / SAML2 Single Sign-On (SSO)", "WebAuthn Biometric passkey support"],
    },
    {
      id: "004",
      code: "TASK-004",
      name: "Enterprise RBAC Matrix",
      category: "Security",
      status: "Production Ready",
      version: "v0.4.0",
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      shortDesc: "Dynamic matrix authorization with Redis caching.",
      purpose: "Provide 14 institutional roles and fine-grained permission evaluation.",
      keyFeatures: [
        "14 pre-seeded institutional roles (Dean, HOD, Faculty, Registrar, etc.)",
        "Dynamic permission matrix matrix checks",
        "Redis-cached user permission caching",
        "Custom DRF permission classes per viewset",
      ],
      roadmap: ["Attribute-Based Access Control (ABAC)", "Time-bounded temporary permission delegation"],
    },
    {
      id: "005",
      code: "TASK-005",
      name: "User Profile System",
      category: "People",
      status: "Production Ready",
      version: "v0.5.0",
      icon: <User className="w-5 h-5 text-cyan-400" />,
      shortDesc: "Centralized identity layer, avatars & preferences.",
      purpose: "Manage user identity data, addresses, contact numbers, avatars, and UI preferences.",
      keyFeatures: [
        "UserProfile, UserContact, UserAddress models",
        "Avatar image upload & validation engine",
        "Profile completion score calculator",
        "UserPreferences storage (Theme, Language, Notifications)",
      ],
      roadmap: ["Digital ID Card generation with QR code", "Multi-factor notification preference webhooks"],
    },
    {
      id: "006",
      code: "TASK-006",
      name: "Academic Structure Engine",
      category: "Academic",
      status: "Production Ready",
      version: "v0.6.0",
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      shortDesc: "Faculty → Department → Program → Semester hierarchy.",
      purpose: "Model complete institutional academic organization and course offerings.",
      keyFeatures: [
        "Faculties, Departments, Programs & Academic Sessions",
        "Semesters, Subjects (Core/Elective/Lab) & Offerings",
        "Course syllabus & credit structure modeling",
        "Hierarchical parent-child validation checks",
      ],
      roadmap: ["Outcome-Based Education (OBE) mapping", "NBA / NAAC accreditation auto-reporting"],
    },
    {
      id: "007",
      code: "TASK-007",
      name: "Student Directory & Lifecycle",
      category: "People",
      status: "Production Ready",
      version: "v0.7.0",
      icon: <Users className="w-5 h-5 text-blue-400" />,
      shortDesc: "Auto Student IDs, academic mapping & status audit.",
      purpose: "Track student lifecycle from enrollment to graduation with status history audit trail.",
      keyFeatures: [
        "Automated unique Student ID generation algorithms",
        "Academic program, session & semester linking",
        "StudentStatusHistory state machine audit logs",
        "Bulk CSV student import and export engine",
      ],
      roadmap: ["Alumni transition workflow", "Student mobility & credit transfer system"],
    },
    {
      id: "008",
      code: "TASK-008",
      name: "Staff & HR Management",
      category: "People",
      status: "Production Ready",
      version: "v0.8.0",
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      shortDesc: "Employee IDs, designations & status audit trails.",
      purpose: "Enterprise HR database for academic faculty and non-teaching administrative staff.",
      keyFeatures: [
        "Auto Employee ID generation with rank hierarchies",
        "Designation ranks & departmental mapping",
        "EmployeeStatusHistory lifecycle audit tracking",
        "Staff workload & teaching load reports",
      ],
      roadmap: ["Faculty appraisal & publication tracker", "Leave management & payroll integration"],
    },
    {
      id: "009",
      code: "TASK-009",
      name: "Parent & Guardian Portal",
      category: "People",
      status: "Production Ready",
      version: "v0.9.0",
      icon: <HeartHandshake className="w-5 h-5 text-pink-400" />,
      shortDesc: "Multi-student linking & document verification.",
      purpose: "Connect parents with student records, attendance alerts, fees, and verified documents.",
      keyFeatures: [
        "Parent-to-Student multi-child relation mapping",
        "Parent document upload & verification workflow",
        "ParentCommunicationPreference engine",
        "Guardian dashboard APIs and React portal",
      ],
      roadmap: ["Parent-Faculty appointment scheduler", "Real-time SMS / WhatsApp push notifications"],
    },
    {
      id: "010",
      code: "TASK-010",
      name: "Admissions Management",
      category: "Academic",
      status: "Production Ready",
      version: "v0.10.0",
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-400" />,
      shortDesc: "Application pipeline, document checks & auto-enrollment.",
      purpose: "Automate admissions intake, application states, seat matrix, and instant student conversion.",
      keyFeatures: [
        "AdmissionApplication tracking & status audit logs",
        "AdmissionDocument upload & staff verification pipeline",
        "Category-wise SeatMatrix quota tracking",
        "One-click application-to-student conversion service",
      ],
      roadmap: ["Online application fee payment integration", "Automated entrance test score ranking"],
    },
    {
      id: "011",
      code: "TASK-011",
      name: "Timetable Management",
      category: "Academic",
      status: "Production Ready",
      version: "v0.11.0",
      icon: <Calendar className="w-5 h-5 text-teal-400" />,
      shortDesc: "Weekly schedule matrix & conflict detection engine.",
      purpose: "Generate and manage class schedules without teacher or room double-booking.",
      keyFeatures: [
        "Timetable Slot & Schedule Matrix models",
        "Real-time teacher & room conflict detection validator",
        "Weekly class timetable view for students & staff",
        "Classroom capacity & lab equipment availability checks",
      ],
      roadmap: ["Automated AI timetable generator solver", "Substitute teacher auto-assignment"],
    },
    {
      id: "012",
      code: "TASK-012",
      name: "Attendance Management",
      category: "Academic",
      status: "Production Ready",
      version: "v0.12.0",
      icon: <Clock className="w-5 h-5 text-red-400" />,
      shortDesc: "Biometric sync, daily/course logs & deficit alerts.",
      purpose: "Monitor student and staff attendance with automated deficit warnings under 75%.",
      keyFeatures: [
        "Daily & subject-wise CourseAttendance Session models",
        "AttendanceRecord bulk entry API endpoint",
        "Automated attendance percentage calculator",
        "Attendance deficit alert generator (<75% threshold)",
      ],
      roadmap: ["Face recognition mobile app attendance", "Biometric hardware push listener API"],
    },
    {
      id: "013",
      code: "TASK-013",
      name: "Examination Management",
      category: "Academic",
      status: "Production Ready",
      version: "v0.13.0",
      icon: <Award className="w-5 h-5 text-indigo-400" />,
      shortDesc: "Exam schedules, hall tickets & invigilator rosters.",
      purpose: "Manage end-to-end exam scheduling, seat plans, and hall ticket issuance.",
      keyFeatures: [
        "ExamType, Examination & ExamSchedule models",
        "ExamCenter & SeatingArrangement planner",
        "HallTicket auto-generation service",
        "Invigilator duty roster assignment engine",
      ],
      roadmap: ["Online proctored examination module", "Question paper bank repository"],
    },
    {
      id: "014",
      code: "TASK-014",
      name: "Result Management System",
      category: "Academic",
      status: "Production Ready",
      version: "v0.14.0",
      icon: <FileCheck2 className="w-5 h-5 text-purple-400" />,
      shortDesc: "Marks entry, SGPA/CGPA engine & publication.",
      purpose: "Calculate grades, semester SGPAs, and cumulative CGPAs with official publication rules.",
      keyFeatures: [
        "ExamMarks entry & validation engine",
        "Automated Grade, GradePoint & Credit calculation",
        "SemesterResult & Multi-Semester CGPA calculator",
        "Official result publication workflow with verification",
      ],
      roadmap: ["Re-evaluation & re-checking workflow", "Grade moderation & scaling tools"],
    },
    {
      id: "015",
      code: "TASK-015",
      name: "Certificate & Transcripts",
      category: "Academic",
      status: "Production Ready",
      version: "v0.15.0",
      icon: <FileBadge className="w-5 h-5 text-amber-400" />,
      shortDesc: "Digital certificates & public QR verification.",
      purpose: "Generate tamper-proof academic certificates and transcripts with public verification.",
      keyFeatures: [
        "CertificateType & StudentCertificate models",
        "HTML/PDF certificate rendering engine",
        "Unique certificate hash & QR code generator",
        "Public certificate verification API & web portal",
      ],
      roadmap: ["Blockchain credential anchor verification", "DigiLocker API integration"],
    },
    {
      id: "016",
      code: "TASK-016",
      name: "Fee Management System",
      category: "Finance",
      status: "Production Ready",
      version: "v0.16.0",
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      shortDesc: "Fee structures, receipts & dues reporting.",
      purpose: "Manage institutional fee heads, payment schedules, and outstanding balances.",
      keyFeatures: [
        "FeeCategory, FeeStructure & FeeHead models",
        "StudentFee allocation & concession rules",
        "FeeReceipt auto-numbering & PDF generator",
        "Outstanding dues report per program/department",
      ],
      roadmap: ["Installment payment schedule engine", "Late fee auto-penalty scheduler"],
    },
    {
      id: "017",
      code: "TASK-017",
      name: "Payment Gateway Integration",
      category: "Finance",
      status: "Production Ready",
      version: "v0.17.0",
      icon: <Wallet className="w-5 h-5 text-cyan-400" />,
      shortDesc: "Razorpay & Stripe payment processing + webhooks.",
      purpose: "Enable online fee payments with instant reconciliation and refund handling.",
      keyFeatures: [
        "Abstract PaymentGateway provider interface",
        "Razorpay & Stripe checkout session creation",
        "Webhook signature verification & transaction log",
        "Refund request & tracking workflow",
      ],
      roadmap: ["UPI / QR Code instant dynamic payment", "Bank reconciliation CSV importer"],
    },
    {
      id: "018",
      code: "TASK-018",
      name: "Scholarship Management",
      category: "Finance",
      status: "Production Ready",
      version: "v0.18.0",
      icon: <Gift className="w-5 h-5 text-purple-400" />,
      shortDesc: "Merit & need scholarships, renewals & fee offset.",
      purpose: "Manage scholarship criteria, application reviews, and fee adjustments.",
      keyFeatures: [
        "ScholarshipType (Government, Merit, Need-based)",
        "ScholarshipApplication review & sanction workflow",
        "ScholarshipRenewal eligibility verification",
        "Automated fee credit & disbursement service",
      ],
      roadmap: ["External donor portal", "Government scholarship portal sync"],
    },
    {
      id: "019",
      code: "TASK-019",
      name: "Library Management",
      category: "Campus",
      status: "Production Ready",
      version: "v0.19.0",
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      shortDesc: "Book catalog, barcode issue/return & fine tracking.",
      purpose: "Complete library automation for books, circulation, holds, and fine collections.",
      keyFeatures: [
        "Book, BookCopy & Category cataloging",
        "Barcode / Accession issue & return transaction engine",
        "Book Reservation queue management",
        "Overdue Fine calculation & Fee system integration",
      ],
      roadmap: ["E-book PDF reader portal", "RFID kiosk auto-checkout listener"],
    },
    {
      id: "020",
      code: "TASK-020",
      name: "Hostel Management",
      category: "Campus",
      status: "Production Ready",
      version: "v0.20.0",
      icon: <Building2 className="w-5 h-5 text-orange-400" />,
      shortDesc: "Buildings, room allocation, visitor log & tickets.",
      purpose: "Manage residential campus hostels, room allocations, visitors, and maintenance.",
      keyFeatures: [
        "Hostel Building, Block, Floor, Room & Bed models",
        "BedAllocation service linked with Fee System",
        "Room Transfer & Check-In/Check-Out workflow",
        "Visitor Register & Maintenance Ticket tracker",
      ],
      roadmap: ["Mess attendance & meal booking system", "Biometric gate entry/exit logging"],
    },
  ];

  const categories = ["All", "Platform", "Academic", "People", "Finance", "Campus", "Security"];

  const filteredModules =
    activeCategory === "All"
      ? modules
      : modules.filter((m) => m.category === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="modules">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          20 Backend Modules Delivered
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Enterprise Modules Showcase
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore the 20 production-ready modules engineered across Django 5 backend REST services and React 19 interfaces.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="text-xs text-slate-500 font-medium mr-2 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter by:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredModules.map((mod) => (
          <motion.div
            key={mod.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => setSelectedModule(mod)}
            className="cursor-pointer bg-slate-900/60 dark:bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-5 backdrop-blur-xl transition-all shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {mod.code}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {mod.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  {mod.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {mod.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">{mod.category} • {mod.version}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {mod.shortDesc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-indigo-400 font-semibold group-hover:text-indigo-300">
              <span>View Specs & Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Top Close Button */}
              <button
                onClick={() => setSelectedModule(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg">
                  {selectedModule.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {selectedModule.code}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {selectedModule.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedModule.version}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1">
                    {selectedModule.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                    Module Purpose
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    {selectedModule.purpose}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                    Key Features Delivered
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedModule.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                    Future Roadmap Integration
                  </h4>
                  <div className="space-y-2">
                    {selectedModule.roadmap.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/30 p-2.5 rounded-xl border border-slate-800/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                >
                  Close Specification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
