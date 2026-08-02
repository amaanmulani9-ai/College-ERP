import React from "react";
import { motion } from "framer-motion";
import { Layers, CheckCircle2, ShieldCheck, Server } from "lucide-react";

export const Stats: React.FC = () => {
  const statsList = [
    {
      value: "20+",
      label: "Enterprise Modules",
      subtext: "Academics, Finance, Hostel & Exams",
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
      borderColor: "border-indigo-500/30",
    },
    {
      value: "125+",
      label: "Automated Tests",
      subtext: "100% Test Suite Pass Rate",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/30",
    },
    {
      value: "100%",
      label: "Multi-Tenant Ready",
      subtext: "PostgreSQL Schema Isolation",
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
      borderColor: "border-purple-500/30",
    },
    {
      value: "99.9%",
      label: "System Availability",
      subtext: "High Uptime & SLA Guarantee",
      icon: <Server className="w-6 h-6 text-amber-400" />,
      gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
      borderColor: "border-amber-500/30",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Institutional Performance & Reliability
        </h2>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Proven at Scale for Modern Higher Education
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative rounded-3xl p-6 bg-slate-900/60 dark:bg-slate-900/60 border ${stat.borderColor} backdrop-blur-xl shadow-xl overflow-hidden group`}
          >
            {/* Ambient Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-md">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Metric 0{idx + 1}</span>
              </div>

              <div>
                <div className="text-4xl font-extrabold text-white bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-200 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{stat.subtext}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
