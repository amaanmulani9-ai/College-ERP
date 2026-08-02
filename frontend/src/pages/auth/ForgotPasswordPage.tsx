import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, ArrowLeft, Lock } from "lucide-react";
import { AuthCard } from "../../components/auth/AuthCard";
import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { OTPInput } from "../../components/auth/OTPInput";
import { CountdownTimer } from "../../components/auth/CountdownTimer";
import { PasswordStrengthMeter } from "../../components/auth/PasswordStrengthMeter";
import { PasswordChecklist } from "../../components/auth/PasswordChecklist";
import { SuccessCard } from "../../components/auth/SuccessCard";
import { AuthAlert } from "../../components/auth/AuthAlert";
import { SEOHead } from "../../components/public/SEOHead";

export const ForgotPasswordPage: React.FC = () => {
  const [stage, setStage] = useState<"email" | "otp" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid institutional email address");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStage("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (otp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStage("reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStage("success");
    } finally {
      setIsLoading(false);
    }
  };

  if (stage === "success") {
    return (
      <AuthCard>
        <SEOHead title="Password Reset Successful" description="Your password has been updated." />
        <SuccessCard
          title="Password Reset Complete!"
          message="Your institutional access password has been updated successfully. You may now sign in with your new credentials."
          actionText="Sign In with New Password"
          actionRoute="/login"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <SEOHead title="Account Recovery" description="Reset your institutional user password." />

      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center mx-auto text-indigo-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Recovery</h2>
        <p className="text-xs text-slate-400">
          {stage === "email" && "Step 1 — Enter registered email address"}
          {stage === "otp" && "Step 2 — Verify 6-digit security code"}
          {stage === "reset" && "Step 3 — Create new secure password"}
        </p>
      </div>

      {errorMessage && <AuthAlert type="error" message={errorMessage} />}

      <AnimatePresence mode="wait">
        {/* STAGE 1: Email Form */}
        {stage === "email" && (
          <motion.form
            key="email-stage"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleEmailSubmit}
            className="space-y-4 text-xs"
          >
            <AuthInput
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@institution.edu"
              icon={<Mail className="w-4 h-4" />}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Dispatching OTP..." : "Send Verification Code"}
            </button>

            <div className="pt-2 text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </motion.form>
        )}

        {/* STAGE 2: OTP Code Verification */}
        {stage === "otp" && (
          <motion.form
            key="otp-stage"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleOTPSubmit}
            className="space-y-4 text-xs"
          >
            <p className="text-center text-slate-300 text-xs">
              We sent a 6-digit verification code to <strong className="text-white">{email}</strong>
            </p>

            <OTPInput value={otp} onChange={setOtp} error={!!errorMessage} />

            <CountdownTimer onResend={() => setErrorMessage("")} />

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isLoading ? "Verifying Code..." : "Verify OTP Code"}
            </button>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setStage("email")}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Change Email Address
              </button>
            </div>
          </motion.form>
        )}

        {/* STAGE 3: New Password Form */}
        {stage === "reset" && (
          <motion.form
            key="reset-stage"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleResetSubmit}
            className="space-y-4 text-xs"
          >
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <PasswordStrengthMeter password={newPassword} />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <PasswordChecklist password={newPassword} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthCard>
  );
};
