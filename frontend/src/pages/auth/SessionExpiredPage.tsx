import React from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../../components/auth/AuthCard";
import { SEOHead } from "../../components/public/SEOHead";
import { Clock, LogIn } from "lucide-react";

export const SessionExpiredPage: React.FC = () => {
  return (
    <AuthCard>
      <SEOHead title="Session Expired" description="Your JWT session token has expired." />

      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center mx-auto shadow-xl">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            JWT SESSION EXPIRED
          </span>
          <h2 className="text-2xl font-extrabold text-white pt-2">Session Timed Out</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your JWT access token has expired due to inactivity. Please sign in again to resume your portal session.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Re-authenticate Session
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};
