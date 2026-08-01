import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Heart, Rocket, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export const CareersPage: React.FC = () => {
  useEffect(() => {
    document.title = "Careers & Open Positions | College ERP";
  }, []);

  const cultureBenefits = [
    { icon: <Rocket className="w-5 h-5 text-indigo-400" />, title: "High-Impact Engineering", desc: "Build systems that serve thousands of institutions and millions of students daily." },
    { icon: <Heart className="w-5 h-5 text-pink-400" />, title: "Remote-First & Flexible", desc: "Work from anywhere with flexible hours and generous personal leave." },
    { icon: <Shield className="w-5 h-5 text-emerald-400" />, title: "Competitive Package", desc: "Top-of-market salary, equity options, health insurance, and learning stipends." },
    { icon: <Users className="w-5 h-5 text-amber-400" />, title: "Inclusive Environment", desc: "Collaborative, transparent culture focused on continuous learning." },
  ];

  const positions = [
    { title: "Senior Python / Django Architect", dept: "Backend Engineering", loc: "Remote", type: "Full-Time" },
    { title: "Senior React 19 Frontend Developer", dept: "UI Engineering", loc: "Remote", type: "Full-Time" },
    { title: "SaaS Multi-Tenant DevOps Specialist", dept: "Infrastructure", loc: "Remote", type: "Full-Time" },
    { title: "Enterprise Account Executive", dept: "Institutional Sales", loc: "New Delhi / Remote", type: "Full-Time" },
  ];

  return (
    <div className="pt-10 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          Join Our Mission
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Shape the Future of Higher Education Software
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          We are an ambitious team of engineers, designers, and domain experts building next-generation SaaS tools.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cultureBenefits.map((b, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              {b.icon}
            </div>
            <h3 className="text-base font-bold text-white">{b.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Positions */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Current Open Positions</h2>
          <p className="text-xs text-slate-400 mt-1">Explore open roles across engineering, sales, and product design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {positions.map((p, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex items-center justify-between hover:border-indigo-500/40 transition-colors">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {p.dept}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{p.loc} • {p.type}</p>
              </div>
              <Link to="/contact" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-colors flex items-center gap-1">
                Apply <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
