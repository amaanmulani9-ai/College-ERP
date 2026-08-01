import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Zap,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const PricingPage: React.FC = () => {
  const [studentCount, setStudentCount] = useState(2500);

  const plans = [
    {
      name: "Starter Institution",
      badge: "For Single Campus / Standalone Colleges",
      priceMonthly: "$499",
      priceAnnual: "$399",
      desc: "Essential SaaS foundation for institutions with up to 1,500 active students.",
      features: [
        "Up to 1,500 Active Students",
        "Schema-Isolated Multi-Tenancy",
        "14 Pre-Built Institutional Roles",
        "Core Academics, Students & Staff Modules",
        "Admissions & Enrollment Engine",
        "Email & Basic Support (24h SLA)",
      ],
      highlighted: false,
      cta: "Start 14-Day Free Trial",
    },
    {
      name: "Growth University",
      badge: "Most Popular for Accredited Institutions",
      priceMonthly: "$1,299",
      priceAnnual: "$999",
      desc: "Full enterprise suite with automated fees, examinations, timetable & hostel management.",
      features: [
        "Up to 10,000 Active Students",
        "Everything in Starter Plan",
        "Razorpay & Stripe Payment Integration",
        "Exam Scheduling, Hall Tickets & CGPA Calculator",
        "Weekly Timetable Scheduler & Conflict Checker",
        "Hostel, Room & Visitor Management",
        "Biometric & Daily Attendance Tracking",
        "Priority 24/7 Support (2h SLA)",
      ],
      highlighted: true,
      cta: "Get Growth Enterprise",
    },
    {
      name: "Multi-Campus Enterprise",
      badge: "For Universities & Educational Trusts",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      desc: "Tailored multi-campus infrastructure, dedicated database instances & custom integrations.",
      features: [
        "Unlimited Students & Multi-Campus Trust",
        "Everything in Growth Plan",
        "Dedicated PostgreSQL Database Instance",
        "Local Ollama AI Advising & Predictive Engine",
        "Custom API Connectors & SSO Integration",
        "Dedicated Solution Architect & Account Manager",
        "99.99% Uptime Guarantee SLA",
      ],
      highlighted: false,
      cta: "Contact Enterprise Sales",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          Transparent SaaS Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Simple, Predictable Institutional{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Subscription Plans
          </span>
        </h1>
        <p className="text-slate-300 text-base">
          No hidden per-user fees. Full access to enterprise features with isolated multi-tenant databases.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
              p.highlighted
                ? "bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-950/60"
                : "bg-slate-900/40 border border-slate-800"
            }`}
          >
            {p.highlighted && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                {p.badge}
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{p.priceAnnual}</span>
                {p.priceAnnual !== "Custom" && <span className="text-xs text-slate-400">/ month (billed annually)</span>}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Plan Highlights:</span>
                <ul className="space-y-2.5">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                to="/demo"
                className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  p.highlighted
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                {p.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
