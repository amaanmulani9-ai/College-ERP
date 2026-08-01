import React from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "../../components/public/SEOHead";
import { ServerCrash, RefreshCcw, Home } from "lucide-react";

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 max-w-2xl mx-auto space-y-6">
      <SEOHead title="500 - System Exception" description="An unexpected server exception occurred." />

      <div className="w-20 h-20 rounded-3xl bg-red-950/80 border border-red-500/40 flex items-center justify-center shadow-2xl">
        <ServerCrash className="w-10 h-10 text-red-400" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-800">
          ERROR CODE 500
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          System Exception Occurred
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Our backend service encountered a transient exception. Our automated Celery worker monitors have been notified.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Reload Page
        </button>

        <Link
          to="/"
          className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};
