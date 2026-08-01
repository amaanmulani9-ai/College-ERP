import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hero } from "../../components/public/Hero";
import { Stats } from "../../components/public/Stats";
import {
  GraduationCap,
  Users,
  Clock,
  Award,
  CreditCard,
  Hotel,
  Layers,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const highlights = [
    {
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      title: "Schema-Isolated Multi-Tenancy",
      description:
        "Every institution gets its own isolated PostgreSQL database schema via django-tenants for total data privacy and zero cross-tenant leak risk.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Granular RBAC Matrix",
      description:
        "14 pre-built institutional roles (Deans, HODs, Faculty, Registrar, Accountants, Wardens) with Redis-cached permission authorization.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Real-Time Automation",
      description:
        "Automated Student/Staff ID generation, automated fee receipting, GPA calculation, biometric attendance sync, and instant hall ticket issuing.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      title: "Institutional Analytics",
      description:
        "Comprehensive dashboards for attendance deficit tracking, hostel vacancy reports, fee collection performance, and student academic progress.",
    },
  ];

  const featuredModules = [
    { icon: <GraduationCap />, name: "Academic Structure", desc: "Faculties, Departments, Programs, Sessions & Offerings" },
    { icon: <Users />, name: "Student Lifecycle", desc: "Auto ID, enrollment history, guardian links & document portal" },
    { icon: <Clock />, name: "Timetable & Attendance", desc: "Conflict-free scheduler, daily attendance & deficit alerts" },
    { icon: <Award />, name: "Exams & Results", desc: "Hall tickets, automated GPA/CGPA calculations & transcripts" },
    { icon: <CreditCard />, name: "Fee & Gateway", desc: "Fee structures, online payments (Razorpay/Stripe) & refunds" },
    { icon: <Hotel />, name: "Hostel & Rooms", desc: "Building management, bed allocation, maintenance & visitor log" },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <Hero />

      {/* Statistics Cards */}
      <Stats />

      {/* Architectural Core */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Architectural Foundation</h2>
          <p className="text-3xl font-bold text-white">Engineered for Security, Scale & Multi-Tenancy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Module Showcase Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Complete Module Coverage</span>
              <h2 className="text-3xl font-bold text-white mt-1">20 Integrated Enterprise Modules</h2>
            </div>
            <Link
              to="/modules"
              className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 gap-1"
            >
              View All 20 Modules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModules.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 flex items-start gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  {m.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{m.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 border border-indigo-500/30 p-10 sm:p-16 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Modernize Your Educational Institution?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto">
            Schedule a live demonstration with our enterprise solution architects or launch the interactive sandbox portal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/demo"
              className="px-8 py-3.5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3.5 bg-slate-900/80 text-white font-semibold rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all text-sm"
            >
              Compare SaaS Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
