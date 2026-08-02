import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Shield, Globe, Github, Twitter, Linkedin, Heart, Activity } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const Footer: React.FC = () => {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="bg-slate-950 dark:bg-slate-950 border-t border-slate-900 text-slate-400 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">College ERP</span>
                <span className="text-[10px] text-slate-500 font-mono">v0.20.0 Enterprise Release</span>
              </div>
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

          {/* Col 3: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-400 transition-colors">Features Matrix</Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">20 ERP Modules</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-indigo-400 transition-colors">SaaS Pricing</Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-indigo-400 transition-colors">Book Live Demo</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions & Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">State Universities</Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">Engineering Institutes</Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">Medical Colleges</Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">Business Schools</Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-indigo-400 transition-colors">Polytechnic Colleges</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-indigo-400 transition-colors">Engineering Blog</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-indigo-400 transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Sales</Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400" /> System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Trust & Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" /> ISO 27001 & SOC-2
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Globe className="w-4 h-4 text-indigo-400" /> Schema-Isolated SaaS
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
              </li>
              <li className="pt-1 text-[11px] text-slate-500">
                Theme: <span className="text-slate-300 capitalize">{resolvedTheme}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} College ERP SaaS Architecture. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
            <Link to="/status" className="hover:text-slate-300">Status</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
