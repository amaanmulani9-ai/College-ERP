import React from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  GraduationCap,
  Users,
  Briefcase,
  HeartHandshake,
  Clock,
  Calendar,
  Award,
  FileCheck2,
  FileBadge,
  CreditCard,
  Wallet,
  Gift,
  BookOpen,
  Building2,
  Server,
  ShieldCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  tag?: string;
}

export const FeatureSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: <UserCheck className="w-6 h-6 text-indigo-400" />,
      title: "Admissions & Enrollment",
      description: "Automated application tracking, document verification, merit list generation, and instant enrollment.",
      category: "Academic",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-purple-400" />,
      title: "Academic Structure",
      description: "Hierarchy management across Faculties, Departments, Programs, Academic Sessions, and Course Offerings.",
      category: "Academic",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Student Management",
      description: "Auto-generated Student IDs, academic status tracking, profile management, and comprehensive directory.",
      category: "People",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-400" />,
      title: "Staff & HR System",
      description: "Employee directory, designation rankings, status audit trails, and departmental assignments.",
      category: "People",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-pink-400" />,
      title: "Parent & Guardian Portal",
      description: "Multi-student linking, document verification workflows, activity logs, and guardian communication.",
      category: "People",
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: "Attendance Tracking",
      description: "Biometric and QR-based daily/course attendance, automated deficit alerts (<75%), and percentage reports.",
      category: "Academic",
    },
    {
      icon: <Calendar className="w-6 h-6 text-teal-400" />,
      title: "Timetable Management",
      description: "Conflict-free weekly schedule matrix, room allocation, faculty assignment, and instant clash detection.",
      category: "Academic",
    },
    {
      icon: <Award className="w-6 h-6 text-red-400" />,
      title: "Examination System",
      description: "Exam scheduling, seat allocation, hall ticket generation, invigilator duty roster, and grading.",
      category: "Academic",
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-indigo-400" />,
      title: "Results & Grading",
      description: "Marks entry, SGPA/CGPA calculation engine, class rankings, grade cards, and official publication.",
      category: "Academic",
    },
    {
      icon: <FileBadge className="w-6 h-6 text-amber-400" />,
      title: "Certificates & Transcripts",
      description: "Digital certificate generation, transcript issuance, and public QR-code verification portal.",
      category: "Academic",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
      title: "Fee Management",
      description: "Flexible fee structures, concession rules, receipt generation, and outstanding dues reporting.",
      category: "Finance",
    },
    {
      icon: <Wallet className="w-6 h-6 text-cyan-400" />,
      title: "Payment Gateways",
      description: "Integrated Razorpay & Stripe payment processing, webhook listener, transaction history, and refunds.",
      category: "Finance",
    },
    {
      icon: <Gift className="w-6 h-6 text-purple-400" />,
      title: "Scholarship System",
      description: "Merit and need-based scholarship types, application review workflows, renewals, and automated fee offsets.",
      category: "Finance",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      title: "Library Operations",
      description: "Book cataloging, barcode issue/return, reservation queue, overdue fine calculations, and inventory reports.",
      category: "Campus",
    },
    {
      icon: <Building2 className="w-6 h-6 text-orange-400" />,
      title: "Hostel Management",
      description: "Buildings, rooms, bed allocations, room transfers, visitor registers, maintenance tickets, and vacancy reports.",
      category: "Campus",
    },
    {
      icon: <Server className="w-6 h-6 text-violet-400" />,
      title: "Multi-Tenant SaaS",
      description: "PostgreSQL schema-isolation via django-tenants. Complete data privacy and zero cross-tenant leak risk.",
      category: "Platform",
      tag: "Core Architecture",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Enterprise Security",
      description: "Dynamic RBAC authorization, SimpleJWT authentication, token revocation, lockout protection, and audit logs.",
      category: "Platform",
      tag: "Security",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-400" />,
      title: "Analytics Ready",
      description: "Real-time metrics, attendance deficit dashboards, financial collection reports, and enrollment statistics.",
      category: "Platform",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      title: "AI Engine Ready",
      description: "Architected for local LLM advising, document OCR processing, and predictive student performance analytics.",
      category: "Platform",
      tag: "Next-Gen",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="features">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Comprehensive ERP Capabilities
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Everything Your Institution Needs
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          One unified platform for academics, finance, campus operations, communication, and administration.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative bg-slate-900/60 dark:bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  {item.icon}
                </div>
                {item.tag && (
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                    {item.tag}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Category: <strong className="text-slate-400">{item.category}</strong></span>
              <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
