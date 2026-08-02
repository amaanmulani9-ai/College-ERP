import React from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "../../components/public/SEOHead";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 max-w-2xl mx-auto space-y-6">
      <SEOHead title="404 - Page Not Found" description="The page you are looking for does not exist or has been moved." />

      <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shadow-2xl animate-bounce">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
          ERROR CODE 404
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          The educational route or module document you requested does not exist or has been relocated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back Previous Page
        </button>
      </div>
    </div>
  );
};
