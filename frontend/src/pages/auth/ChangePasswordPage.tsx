import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../../components/auth/AuthCard";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { PasswordStrengthMeter } from "../../components/auth/PasswordStrengthMeter";
import { PasswordChecklist } from "../../components/auth/PasswordChecklist";
import { SuccessCard } from "../../components/auth/SuccessCard";
import { AuthAlert } from "../../components/auth/AuthAlert";
import { SEOHead } from "../../components/public/SEOHead";
import { KeyRound, Lock, ArrowLeft } from "lucide-react";
import { authService } from "../../services/authService";

export const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!oldPassword) {
      setErrorMessage("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage("Failed to change password. Please verify your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <AuthCard>
          <SEOHead title="Password Changed" description="Your password was updated successfully." />
          <SuccessCard
            title="Password Updated!"
            message="Your account security credentials have been updated successfully."
            actionText="Return to Security Center"
            actionRoute="/profile/security"
          />
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <AuthCard>
        <SEOHead title="Change Password" description="Update your institutional user password." />

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 flex items-center justify-center mx-auto text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Change Password</h2>
          <p className="text-xs text-slate-400">Update your institutional user credentials</p>
        </div>

        {errorMessage && <AuthAlert type="error" message={errorMessage} />}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <PasswordInput
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••••••"
          />

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
            {isLoading ? "Updating Credentials..." : "Update Password"}
          </button>

          <div className="pt-2 text-center">
            <Link to="/profile/security" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Security Settings
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};
