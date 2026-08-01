import React from "react";
import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Layers } from "lucide-react";
import { ThemeToggle } from "../components/public/ThemeToggle";

export const AuthLayout: React.FC = () => {
  const benefits = [
    "PostgreSQL Schema-Isolated Multi-Tenancy",
    "14 Granular RBAC Roles & Redis Permission Cache",
    "Real-Time Academics, Fees, Attendance & Exams",
    "Digital Certificate Generation & Public QR Code",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Left Side Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-12 flex-col justify-between overflow-hidden border-r border-slate-900">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none" aria-label="College ERP Homepage">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white">College ERP</span>
              <span className="text-[10px] text-slate-400 font-mono">v0.20.0 Enterprise SaaS</span>
            </div>
          </Link>

          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Website
          </Link>
        </div>

        {/* Center Graphic & Benefits */}
        <div className="relative z-10 space-y-8 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Schema-Isolated Educational Enterprise
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Institutional Management Engine for Modern Campuses
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Log in to manage your faculty, student directories, weekly timetables, exam hall tickets, fee collections, and hostel bed allocations.
          </p>

          <div className="space-y-3 pt-2">
            {benefits.map((b, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-center gap-3 text-xs text-slate-200 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{b}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-900 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> ISO 27001 Ready
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL Schema Isolated
            </span>
          </div>
          <span className="font-mono">Status: 99.99% Operational</span>
        </div>
      </div>

      {/* Right Side Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-12 relative">
        {/* Top Right Theme Toggle */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold text-white">College ERP</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Center Form Area */}
        <div className="my-auto py-8 flex justify-center">
          <Outlet />
        </div>

        {/* Bottom Footer Links */}
        <div className="text-center text-[11px] text-slate-500 space-x-4">
          <span>© {new Date().getFullYear()} College ERP SaaS</span>
          <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
          <Link to="/help" className="hover:text-slate-400">Support</Link>
        </div>
      </div>
    </div>
  );
};
