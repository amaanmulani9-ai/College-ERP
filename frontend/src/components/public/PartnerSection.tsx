import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Layers,
  Container,
  FileCode,
  Palette,
  KeyRound,
  Network,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface TechItem {
  name: string;
  category: string;
  role: string;
  icon: React.ReactNode;
  gradient: string;
}

export const PartnerSection: React.FC = () => {
  const stack: TechItem[] = [
    {
      name: "Django 5",
      category: "Backend Framework",
      role: "Python 3.13 ORM & Core APIs",
      icon: <Code2 className="w-6 h-6 text-emerald-400" />,
      gradient: "border-emerald-500/30 hover:border-emerald-500/60",
    },
    {
      name: "React 19",
      category: "Frontend Client",
      role: "UI & Component State Engine",
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      gradient: "border-cyan-500/30 hover:border-cyan-500/60",
    },
    {
      name: "PostgreSQL 16",
      category: "Database",
      role: "Schema Isolation & ACID Storage",
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      gradient: "border-indigo-500/30 hover:border-indigo-500/60",
    },
    {
      name: "Redis 7",
      category: "Cache & Broker",
      role: "RBAC Cache & Celery Queue",
      icon: <Zap className="w-6 h-6 text-red-400" />,
      gradient: "border-red-500/30 hover:border-red-500/60",
    },
    {
      name: "Docker",
      category: "Containerization",
      role: "Multi-Service Container Stack",
      icon: <Container className="w-6 h-6 text-blue-400" />,
      gradient: "border-blue-500/30 hover:border-blue-500/60",
    },
    {
      name: "TypeScript 5",
      category: "Language",
      role: "Type-Safe Client Interfaces",
      icon: <FileCode className="w-6 h-6 text-blue-500" />,
      gradient: "border-blue-500/30 hover:border-blue-500/60",
    },
    {
      name: "TailwindCSS v4",
      category: "Styling Tokens",
      role: "Glassmorphism & Responsive UI",
      icon: <Palette className="w-6 h-6 text-teal-400" />,
      gradient: "border-teal-500/30 hover:border-teal-500/60",
    },
    {
      name: "SimpleJWT",
      category: "Authentication",
      role: "Token Rotation & Lockouts",
      icon: <KeyRound className="w-6 h-6 text-amber-400" />,
      gradient: "border-amber-500/30 hover:border-amber-500/60",
    },
    {
      name: "REST APIs",
      category: "API Architecture",
      role: "DRF Endpoint Envelopes",
      icon: <Network className="w-6 h-6 text-purple-400" />,
      gradient: "border-purple-500/30 hover:border-purple-500/60",
    },
    {
      name: "Multi-Tenant SaaS",
      category: "Cloud Pattern",
      role: "django-tenants Schema Isolation",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      gradient: "border-emerald-500/30 hover:border-emerald-500/60",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          Battle-Tested Engineering Stack
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Powered by Industry-Standard Technology
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Built using modern open-source frameworks for maximum security, performance, and long-term sustainability.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stack.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-slate-900/60 border ${item.gradient} rounded-2xl p-4 backdrop-blur-xl transition-all shadow-md flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[9px] font-mono uppercase text-slate-500">{item.category}</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{item.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
