import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Server,
  KeyRound,
  Code2,
  Lock,
  Smartphone,
  TrendingUp,
  CheckCircle2,
  TestTube2,
  Layers3,
  Database,
  Zap,
  Container,
  Cloud,
} from "lucide-react";

export interface AdvantageItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  highlight: string;
}

export const WhyChooseUs: React.FC = () => {
  const advantages: AdvantageItem[] = [
    {
      icon: <Server className="w-6 h-6 text-indigo-400" />,
      title: "Multi-Tenant SaaS",
      subtitle: "Schema Isolation",
      description: "PostgreSQL schema-per-tenant isolation via django-tenants. Guaranteed zero cross-tenant data leaks.",
      badge: "Architecture",
      highlight: "100% Data Isolation",
    },
    {
      icon: <Cloud className="w-6 h-6 text-cyan-400" />,
      title: "Cloud Ready",
      subtitle: "Stateless Scaling",
      description: "Designed for Gunicorn, Nginx, Redis, and WhiteNoise. Deploys seamlessly on AWS, GCP, Azure, or Render.",
      badge: "Deployment",
      highlight: "Any Cloud Provider",
    },
    {
      icon: <KeyRound className="w-6 h-6 text-amber-400" />,
      title: "Role-Based Access",
      subtitle: "Granular RBAC",
      description: "14 pre-seeded roles, Redis-cached permission checks, and dynamic permission matrices.",
      badge: "Security",
      highlight: "14 Seeded Roles",
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
      title: "REST APIs",
      subtitle: "DRF + SimpleJWT",
      description: "Comprehensive REST endpoints for all 20 modules with structured envelope responses & SimpleJWT tokens.",
      badge: "Integration",
      highlight: "100+ Endpoints",
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: "Highly Secure",
      subtitle: "Enterprise Standard",
      description: "JWT revocation, brute-force lockout safeguards, parameterized queries, CSRF & XSS protection.",
      badge: "Security",
      highlight: "ISO-27001 Ready",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-pink-400" />,
      title: "Responsive UI",
      subtitle: "React 19 + Tailwind",
      description: "Modern dark-mode & light-mode interface crafted for Desktop, Tablet, and Mobile viewport sizes.",
      badge: "UX Design",
      highlight: "Mobile First",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      title: "Scalable",
      subtitle: "High Throughput",
      description: "Built for institutions with 10,000+ students, asynchronous Celery queues, and PgBouncer connection pooling.",
      badge: "Performance",
      highlight: "10k+ Active Users",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      title: "Production Ready",
      subtitle: "v0.20.0 Released",
      description: "Fully completed backend services, seed data scripts, migration integrity, and verified API contracts.",
      badge: "Status",
      highlight: "v0.20.0 Live",
    },
    {
      icon: <TestTube2 className="w-6 h-6 text-teal-400" />,
      title: "125+ Automated Tests",
      subtitle: "100% Pass Rate",
      description: "Comprehensive pytest test suite covering tenancy, auth, RBAC, academics, fees, hostel & library.",
      badge: "Quality Gate",
      highlight: "125 Passed Tests",
    },
    {
      icon: <Layers3 className="w-6 h-6 text-violet-400" />,
      title: "Enterprise Architecture",
      subtitle: "Clean Domain Boundary",
      description: "Domain-driven app segregation (`apps.tenancy`, `apps.academics`, `apps.fees`, `apps.hostel`, etc.).",
      badge: "Code Quality",
      highlight: "High Cohesion",
    },
    {
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      title: "PostgreSQL 16",
      subtitle: "Relational Power",
      description: "Optimized indexing, foreign key cascade constraints, soft-delete managers, and ACID transactions.",
      badge: "Database",
      highlight: "ACID Guaranteed",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Redis Ready",
      subtitle: "Permission Caching",
      description: "Redis broker for Celery async tasks and sub-millisecond RBAC permission authorization caching.",
      badge: "Caching",
      highlight: "<1ms Cache Check",
    },
    {
      icon: <Container className="w-6 h-6 text-cyan-400" />,
      title: "Docker Ready",
      subtitle: "Containerized Stack",
      description: "Docker & Docker Compose setup with Gunicorn, PostgreSQL, Redis, Celery, and Nginx containers.",
      badge: "DevOps",
      highlight: "1-Click Compose",
    },
    {
      icon: <Cloud className="w-6 h-6 text-emerald-400" />,
      title: "Render Ready",
      subtitle: "One-Click Deploy",
      description: "Pre-configured `render.yaml` manifest for instant cloud deployment of Web, Celery, and Database services.",
      badge: "Cloud PaaS",
      highlight: "1-Click Render",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Uncompromising Technical Excellence
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Why Choose College ERP?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Architected from the ground up for modern higher education SaaS requirements with zero legacy technical debt.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {advantages.map((adv, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group bg-slate-900/60 dark:bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  {adv.icon}
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                  {adv.badge}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                {adv.subtitle}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                {adv.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{adv.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Key Metric</span>
              <span className="text-white font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {adv.highlight}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
