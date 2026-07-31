import React, { useState } from "react";
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true); // Always set true to prevent enumeration
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Forgot Password</h2>
          <p className="text-xs text-slate-400">Enter your email to receive a password reset link</p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">Reset Link Sent</h3>
            <p className="text-xs text-slate-400">
              If an account matches <span className="text-slate-200 font-mono">{email}</span>, a password reset link has been dispatched to your inbox.
            </p>
            <div className="pt-3">
              <Link to="/login" className="text-xs text-indigo-400 font-medium hover:underline">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@college.edu"
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              {loading ? "Sending Link..." : "Send Password Reset Link"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-slate-400 pt-2">
              <Link to="/login" className="text-indigo-400 font-medium hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
