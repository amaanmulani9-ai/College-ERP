import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Shield, Globe, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const Footer: React.FC = () => {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="bg-slate-950 dark:bg-slate-950 border-t border-slate-900 text-slate-400 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-xl font-bold text-white">College ERP</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The next-generation multi-tenant SaaS platform empowering higher education institutions with real-time academic automation, finance management, dynamic RBAC, and AI advising.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter Account"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Page"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">20 ERP Modules</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing Plans</Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-indigo-400 transition-colors">Book Live Demo</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Sales</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Institutional Login</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Institutional Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Trust & Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" /> ISO 27001 & SOC-2
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Globe className="w-4 h-4 text-indigo-400" /> Multi-Tenant Schema Isolated
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Theme: <span className="text-slate-300 capitalize">{resolvedTheme}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} College ERP SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <Link to="/pricing" className="hover:text-slate-300">Pricing</Link>
            <Link to="/demo" className="hover:text-slate-300">Demo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
