import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Building, Zap, ShieldCheck } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      badge: "Single Campus",
      desc: "Ideal for small colleges, academies and vocational institutes.",
      monthlyPrice: "$299",
      annualPrice: "$249",
      period: "/month",
      highlight: false,
      buttonText: "Get Started",
      buttonLink: "/demo",
      features: [
        "Up to 1,000 Active Students",
        "Schema-Isolated Multi-Tenancy",
        "Admissions & Student Directory",
        "Academic Structure Engine",
        "Fee Management & Receipts",
        "Basic Daily Attendance",
        "Standard Email Support (24h SLA)",
      ],
    },
    {
      name: "Professional",
      badge: "Most Popular",
      desc: "For growing colleges needing full academics, exams & payments.",
      monthlyPrice: "$699",
      annualPrice: "$599",
      period: "/month",
      highlight: true,
      buttonText: "Get Started",
      buttonLink: "/demo",
      features: [
        "Up to 5,000 Active Students",
        "All 20 Enterprise Modules Included",
        "Timetable Conflict Solver",
        "Exam Scheduling & Hall Tickets",
        "Results SGPA/CGPA Engine",
        "Razorpay & Stripe Gateway Integration",
        "Hostel & Library Management",
        "Parent & Guardian Portal",
        "Priority Support (4h SLA)",
      ],
    },
    {
      name: "Enterprise",
      badge: "Universities & Multi-Campus",
      desc: "Custom deployment for state universities and educational groups.",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      period: "",
      highlight: false,
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      features: [
        "Unlimited Active Students & Campuses",
        "Custom Schema Migration & DB Tuning",
        "Dedicated Celery Worker Pool",
        "OAuth2 / SAML2 Single Sign-On (SSO)",
        "Biometric Hardware Sync Listener",
        "Custom Analytics & NAAC Reports",
        "Dedicated Account Executive & 99.9% SLA",
        "On-Premise or Private Cloud Deployment",
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="pricing">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          Transparent SaaS Investment
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Flexible Pricing for Every Campus
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Select the optimal plan for your institution. Save 20% with annual billing.
        </p>

        {/* Toggle Switch */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <span className={`text-xs font-medium ${!isAnnual ? "text-white" : "text-slate-400"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle Billing Frequency"
            className="w-14 h-8 bg-slate-900 border border-slate-700 rounded-full p-1 transition-colors relative focus:outline-none"
          >
            <div
              className={`w-6 h-6 bg-indigo-500 rounded-full transition-transform ${
                isAnnual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${isAnnual ? "text-white" : "text-slate-400"} flex items-center gap-1.5`}>
            Annual Billing
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
              plan.highlight
                ? "bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20"
                : "bg-slate-900/60 border border-slate-800 backdrop-blur-xl"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Recommended Choice
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-950 text-indigo-300 border border-slate-800">
                  {plan.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.desc}</p>

              <div className="mb-6 pb-6 border-b border-slate-800/80">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
              </div>

              <div className="space-y-3 mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Features Included:</h4>
                <ul className="space-y-2.5">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <Link
                to={plan.buttonLink}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30"
                    : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {plan.buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 max-w-xl mx-auto">
        <Building className="w-4 h-4 text-indigo-400" />
        <span>Custom pricing, multi-college discounts & legacy data migration support available for Universities.</span>
      </div>
    </section>
  );
};
