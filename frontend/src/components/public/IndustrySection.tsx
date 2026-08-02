import React from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  Cpu,
  Stethoscope,
  Building,
  Wrench,
  School,
  BookOpenCheck,
  Target,
} from "lucide-react";

export interface IndustryItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}

export const IndustrySection: React.FC = () => {
  const industries: IndustryItem[] = [
    {
      icon: <Landmark className="w-8 h-8 text-indigo-400" />,
      title: "Universities",
      description: "Multi-faculty state and private universities with complex department hierarchies and multi-campus governance.",
      badge: "Multi-Faculty",
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      title: "Engineering Colleges",
      description: "Technical institutes requiring lab timetable scheduling, semester credits, outcome-based education, and placement analytics.",
      badge: "STEM & Labs",
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-emerald-400" />,
      title: "Medical Colleges",
      description: "Health science institutes with clinical rotation scheduling, residency tracking, and strict regulatory documentation.",
      badge: "Clinical Rotations",
    },
    {
      icon: <Building className="w-8 h-8 text-purple-400" />,
      title: "Business Schools",
      description: "Management institutes managing case study evaluations, trimester sessions, hostel allocations, and corporate recruitment.",
      badge: "Trimester & MBAs",
    },
    {
      icon: <Wrench className="w-8 h-8 text-amber-400" />,
      title: "Polytechnic Institutes",
      description: "Diploma colleges requiring hands-on workshop attendance tracking, practical exam scoring, and industrial training.",
      badge: "Vocational & Labs",
    },
    {
      icon: <School className="w-8 h-8 text-pink-400" />,
      title: "K-12 Schools & Academies",
      description: "Primary and secondary schools seeking parent portal links, fee collections, report card issuance, and bus transport tracking.",
      badge: "K-12 System",
    },
    {
      icon: <BookOpenCheck className="w-8 h-8 text-cyan-400" />,
      title: "Training Institutes",
      description: "Professional certification centers managing short courses, rolling student intakes, and instant digital certificate QR verification.",
      badge: "Certifications",
    },
    {
      icon: <Target className="w-8 h-8 text-teal-400" />,
      title: "Coaching Centers",
      description: "Test preparation academies tracking mock exam scoring, batch timetables, online fee receipts, and performance analytics.",
      badge: "Test Prep",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
          <Landmark className="w-3.5 h-3.5 text-blue-400" />
          Versatile Educational Deployment
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Industries & Institutions We Serve
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Tailored schema structures and customizable workflows engineered for every scale of educational organization.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map((ind, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group bg-slate-900/60 dark:bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  {ind.icon}
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800 font-medium">
                  {ind.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                {ind.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Tenant Ready</span>
              <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Explore →
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
