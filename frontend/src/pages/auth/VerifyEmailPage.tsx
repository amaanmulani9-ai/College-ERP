import React from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../../components/auth/AuthCard";
import { SEOHead } from "../../components/public/SEOHead";
import { MailCheck, LogIn } from "lucide-react";

export const VerifyEmailPage: React.FC = () => {
  return (
    <AuthCard>
      <SEOHead title="Verify Email Address" description="Verify your institutional email address." />

      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
          <MailCheck className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Email Verification</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Please check your inbox and click the verification link dispatched to confirm your institutional email.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Proceed to Portal Sign In
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};
