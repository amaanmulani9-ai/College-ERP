import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Award, FileCode, Lock, Server, Smartphone, Cloud, Container } from "lucide-react";

export interface TrustBadge {
  title: string;
  subtitle: string;
  status: string;
  icon: React.ReactNode;
  border: string;
  badgeBg: string;
}

export const AwardsSection: React.FC = () => {
  const badges: TrustBadge[] = [
    {
      title: "Enterprise Ready",
      subtitle: "Full Educational SaaS Architecture",
      status: "Verified",
      icon: <Award className="w-6 h-6 text-amber-400" />,
      border: "border-amber-500/30 hover:border-amber-500/60",
      badgeBg: "bg-amber-950 text-amber-300 border-amber-800",
    },
    {
      title: "125+ Tests Passed",
      subtitle: "100% Pytest Backend Coverage",
      status: "100% Green",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      border: "border-emerald-500/30 hover:border-emerald-500/60",
      badgeBg: "bg-emerald-950 text-emerald-300 border-emerald-800",
    },
    {
      title: "100% TypeScript Build",
      subtitle: "Strict React 19 Frontend Types",
      status: "0 Errors",
      icon: <FileCode className="w-6 h-6 text-blue-400" />,
      border: "border-blue-500/30 hover:border-blue-500/60",
      badgeBg: "bg-blue-950 text-blue-300 border-blue-800",
    },
    {
      title: "Secure Authentication",
      subtitle: "SimpleJWT & Lockout Protection",
      status: "ISO-27001 Ready",
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      border: "border-purple-500/30 hover:border-purple-500/60",
      badgeBg: "bg-purple-950 text-purple-300 border-purple-800",
    },
    {
      title: "Multi-Tenant Schema",
      subtitle: "PostgreSQL Isolation via django-tenants",
      status: "Data Isolated",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      border: "border-indigo-500/30 hover:border-indigo-500/60",
      badgeBg: "bg-indigo-950 text-indigo-300 border-indigo-800",
    },
    {
      title: "Production Ready",
      subtitle: "20 Backend Modules Delivered",
      status: "v0.20.0 Live",
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      border: "border-emerald-500/30 hover:border-emerald-500/60",
      badgeBg: "bg-emerald-950 text-emerald-300 border-emerald-800",
    },
    {
      title: "Responsive Design",
      subtitle: "Desktop, Tablet & Mobile Breakpoints",
      status: "Mobile First",
      icon: <Smartphone className="w-6 h-6 text-pink-400" />,
      border: "border-pink-500/30 hover:border-pink-500/60",
      badgeBg: "bg-pink-950 text-pink-300 border-pink-800",
    },
    {
      title: "Render Ready",
      subtitle: "1-Click render.yaml PaaS Deployment",
      status: "Cloud Native",
      icon: <Cloud className="w-6 h-6 text-cyan-400" />,
      border: "border-cyan-500/30 hover:border-cyan-500/60",
      badgeBg: "bg-cyan-950 text-cyan-300 border-cyan-800",
    },
    {
      title: "Docker Ready",
      subtitle: "Gunicorn, Redis & Celery Compose",
      status: "Containerized",
      icon: <Container className="w-6 h-6 text-blue-400" />,
      border: "border-blue-500/30 hover:border-blue-500/60",
      badgeBg: "bg-blue-950 text-blue-300 border-blue-800",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Trust & Quality Standards
        </h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">
          Certified Quality & Architectural Compliance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-slate-900/60 border ${b.border} rounded-3xl p-5 backdrop-blur-xl transition-all shadow-md flex items-center gap-4 group`}
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {b.icon}
            </div>

            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {b.title}
                </h3>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${b.badgeBg}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{b.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
