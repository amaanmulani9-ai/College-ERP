import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Target,
  Award,
  Shield,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Globe2,
  CheckCircle2,
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const milestones = [
    { year: "2024", title: "SaaS Foundation Launched", desc: "Built PostgreSQL schema multi-tenancy & enterprise JWT auth." },
    { year: "2025", title: "Academic & Finance Suite", desc: "Integrated student lifecycle, staff HR, automated fee engine & payments." },
    { year: "2026", title: "v0.20.0 Released", desc: "Delivered 20 enterprise modules including Hostel, Timetable, Exams & AI Advising." },
  ];

  const values = [
    {
      title: "Data Sovereignty",
      desc: "Zero data leakage between tenant institutions through strict PostgreSQL schema isolation.",
    },
    {
      title: "Institutional Transparency",
      desc: "Complete audit log trails for grade edits, fee receipts, bed allocations, and document approvals.",
    },
    {
      title: "High Performance",
      desc: "Sub-50ms API response times backed by Redis permission caching and optimized database queries.",
    },
    {
      title: "AI & Innovation",
      desc: "Cutting-edge local Ollama predictive advising and intelligent automated timetable conflict checking.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          Our Mission & Legacy
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Empowering Education Through{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Technology Excellence
          </span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          CampusPro ERP is engineered to solve the real-world operational challenges of universities, engineering colleges, and multi-campus institutions.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold mb-4">
              0{idx + 1}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Institutional Growth</span>
          <h2 className="text-3xl font-bold text-white">Our Engineering Milestones</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {milestones.map((m, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-indigo-500/40 space-y-2">
              <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                {m.year}
              </span>
              <h4 className="text-base font-bold text-white">{m.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Want to partner with CampusPro ERP?</h3>
        <div className="flex justify-center gap-4">
          <Link to="/contact" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
            Contact Engineering Team
          </Link>
          <Link to="/features" className="px-6 py-3 bg-slate-900 text-slate-200 border border-slate-700 text-sm font-medium rounded-xl hover:bg-slate-800">
            View Features Architecture
          </Link>
        </div>
      </div>
    </div>
  );
};
