import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = "About Us | Enterprise College ERP SaaS Platform";
  }, []);

  const coreValues = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Data Isolation & Privacy",
      desc: "Zero-compromise security with PostgreSQL schema-isolated multi-tenancy for every educational institution.",
    },
    {
      icon: <Target className="w-6 h-6 text-indigo-400" />,
      title: "Academic Precision",
      desc: "Calculations for SGPA, CGPA, hall tickets, attendance percentages, and fee dues are accurate to the cent and second.",
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      title: "User-Centric Design",
      desc: "Empowering students, faculty, registrars, and parents with intuitive, responsive, glassmorphism UI interfaces.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: "Continuous Innovation",
      desc: "Built on Django 5, React 19, Redis 7, and Docker for long-term maintainability without legacy debt.",
    },
  ];

  const timeline = [
    { phase: "v0.1.0 - v0.5.0", title: "Core Platform & Identity", desc: "Workspace setup, multi-tenant DB schemas, JWT auth, and RBAC matrix." },
    { phase: "v0.6.0 - v0.10.0", title: "Academic & Student Directory", desc: "Academic structure, student/staff lifecycles, parent portal, and admissions." },
    { phase: "v0.11.0 - v0.15.0", title: "Exams, Attendance & Certificates", desc: "Timetables, biometric attendance, exams, CGPA engine, and QR certificates." },
    { phase: "v0.16.0 - v0.20.0", title: "Finance, Hostel & Library", desc: "Fee heads, Razorpay/Stripe payments, scholarships, library, and hostel beds." },
  ];

  return (
    <div className="pt-10 pb-20 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          Our Mission & Legacy
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Empowering Educational Institutions Through{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Modern SaaS Engineering
          </span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          College ERP is built to eliminate administrative overhead, unify institutional data across 20 specialized modules, and deliver schema-isolated multi-tenant security.
        </p>
      </section>

      {/* 2. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            To provide colleges, universities, and polytechnic institutes with an enterprise SaaS operating system that automates daily administrative tasks—from student enrollment to graduation and digital transcripts.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            To become the global gold standard for cloud educational ERPs—offering schema-isolated tenant privacy, AI-assisted academic advising, and seamless payment reconciliation.
          </p>
        </motion.div>
      </section>

      {/* 3. Core Values */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Pillars of Excellence</h2>
          <p className="text-3xl font-extrabold text-white mt-1">Our Core Engineering Values</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {val.icon}
              </div>
              <h3 className="text-base font-bold text-white">{val.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Development Timeline */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Release Journey</h2>
          <p className="text-3xl font-extrabold text-white">Evolution to Version v0.20.0</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeline.map((t, idx) => (
            <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                {t.phase}
              </span>
              <h3 className="text-sm font-bold text-white pt-2">{t.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Architecture & Security Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Security Architecture</span>
          <h2 className="text-3xl font-extrabold text-white">Schema Isolation & RBAC Protection</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            By avoiding single-table tenant IDs and enforcing PostgreSQL schema-per-tenant isolation via <code className="text-purple-300 font-mono">django-tenants</code>, College ERP provides complete data privacy.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated tenant schemas (e.g. <code className="font-mono text-emerald-300">tenant_mit</code>)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 14 RBAC Roles cached in Redis for &lt;1ms permissions checks
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SimpleJWT authentication with lockout and audit logs
            </li>
          </ul>
        </div>
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-slate-400">architecture-spec.json</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <pre className="text-[11px] font-mono text-indigo-300 overflow-x-auto leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
{`{
  "platform_version": "v0.20.0",
  "isolation_mode": "POSTGRESQL_SCHEMA",
  "backend_stack": ["Django 5", "DRF", "SimpleJWT", "Redis", "Celery"],
  "frontend_stack": ["React 19", "TypeScript 5", "TailwindCSS", "Vite"],
  "modules_count": 20,
  "test_pass_rate": "100%"
}`}
          </pre>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="text-center bg-gradient-to-r from-indigo-900 to-purple-950 rounded-3xl p-10 sm:p-16 border border-indigo-500/30 space-y-6 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white">Join the Next Generation of Campus Management</h2>
        <p className="text-indigo-200 text-sm max-w-xl mx-auto">
          Explore our interactive sandbox portal or request a live consultation with our solutions team.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link to="/demo" className="px-8 py-3.5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-100 transition-colors text-sm">
            Book Live Demo
          </Link>
          <Link to="/contact" className="px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors text-sm">
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
};
