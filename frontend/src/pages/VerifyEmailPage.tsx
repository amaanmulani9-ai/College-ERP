import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { authService } from "../services/authService";

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("Verification token missing.");
      return;
    }

    authService
      .verifyEmail(token)
      .then((res) => {
        setSuccess(true);
        setMessage(res.detail || "Email verified successfully!");
      })
      .catch((err) => {
        setSuccess(false);
        setMessage(err.response?.data?.token?.[0] || "Invalid or expired token.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center space-y-4">
        {loading ? (
          <div className="py-8 space-y-3">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Verifying your email address...</p>
          </div>
        ) : success ? (
          <div className="py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Email Verified</h2>
            <p className="text-xs text-slate-400">{message}</p>
            <div className="pt-4">
              <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
                Proceed to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-3">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Verification Failed</h2>
            <p className="text-xs text-slate-400">{message}</p>
            <div className="pt-4">
              <Link to="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
