import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Play, Users, Layers, Award } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 dark:bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          Next-Gen Multi-Tenant Educational SaaS
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-indigo-200 font-mono">v0.20.0</span>
        </motion.div>

        {/* Large Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-tight"
        >
          One Platform to Manage Your{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Entire Campus
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Enterprise ERP for Colleges, Universities and Educational Institutions. Streamline admissions, academics, fee collection, attendance, examinations, and hostel allocation in one schema-isolated SaaS.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/demo"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/demo"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-current" />
            Book Demo
          </Link>
        </motion.div>

        {/* Hero Interactive Illustration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative mx-auto max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-purple-500/10 to-slate-950 shadow-2xl shadow-indigo-950/80"
        >
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 p-6 md:p-8 text-left">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">college-erp.cloud/institutional-dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full font-mono border border-emerald-800/60 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SCHEMA ISOLATED: DEMO_TENANT
                </span>
              </div>
            </div>

            {/* Simulated Live ERP Stats Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Active Students</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">4,820</div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1">↑ 12% vs last semester</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Modules Live</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">20 / 20</div>
                <div className="text-[10px] text-purple-400 font-medium mt-1">100% Operational</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Daily Attendance</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">94.8%</div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1">Biometric Sync Live</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Fee Collection</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">$1.42M</div>
                <div className="text-[10px] text-amber-400 font-medium mt-1">Razorpay / Stripe Active</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
