import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, ShieldCheck, CheckCircle } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Container Box */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/30 p-10 sm:p-16 text-center shadow-2xl overflow-hidden z-10">
        {/* Floating Background Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.15, 0.35, 0.15],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/80 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            Institutional Transformation
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Transform Your Campus?
          </h2>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Join forward-thinking colleges and universities. Experience schema-isolated multi-tenancy, real-time academic tracking, automated fee receipts, and digital certificate verification.
          </p>

          {/* Key Value Checks */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-indigo-200 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 1-Hour Cloud Setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Free Data Migration
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 24/7 SLA Support
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/demo"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 text-white fill-current" />
              Book Live Demo
            </Link>

            <Link
              to="/demo"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial (Interactive Sandbox)
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
