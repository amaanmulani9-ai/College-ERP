import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../../components/auth/AuthCard";
import { AuthInput } from "../../components/auth/AuthInput";
import { SEOHead } from "../../components/public/SEOHead";
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <AuthCard>
      <SEOHead title="Reset Institutional Password" description="Request a password reset link for your institutional account." />

      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center mx-auto text-indigo-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-400">Enter your registered email to receive a password reset token</p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-xs text-slate-300">
            If an account exists for <strong className="text-white">{email}</strong>, password reset instructions have been dispatched.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold hover:text-indigo-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <AuthInput
            label="Registered Institutional Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@institution.edu"
            icon={<Mail className="w-4 h-4" />}
          />

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Send Reset Instructions
          </button>

          <div className="pt-2 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};
