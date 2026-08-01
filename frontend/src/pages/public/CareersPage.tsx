import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const CareersPage: React.FC = () => {
  const jobs = [
    { title: "Senior Python / Django Architect", team: "Core Backend & Multi-Tenancy", location: "Remote / Silicon Valley / Mumbai", type: "Full-Time" },
    { title: "Staff Frontend Engineer (React 19 / Vite)", team: "Design System & UI Architecture", location: "Remote / Hybrid", type: "Full-Time" },
    { title: "AI / ML Solutions Engineer", team: "Predictive Analytics & Ollama Advising", location: "Remote / Hybrid", type: "Full-Time" },
    { title: "Enterprise Technical Account Manager", team: "Institutional Growth", location: "Mumbai / New Delhi / Bangalore", type: "Full-Time" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          We Are Hiring
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Build the Future of{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Educational SaaS
          </span>
        </h1>
        <p className="text-slate-300 text-base">
          Join our mission to empower thousands of colleges and universities with next-generation automated ERP systems.
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-6">Open Engineering & Product Positions</h2>
        {jobs.map((j, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{j.title}</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                  {j.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">{j.team}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                <MapPin className="w-3 h-3 text-indigo-400" /> {j.location}
              </div>
            </div>

            <Link
              to="/contact"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all self-start md:self-center inline-flex items-center gap-1.5"
            >
              Apply Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
