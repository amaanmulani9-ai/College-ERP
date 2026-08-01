import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, LogIn, AlertCircle } from "lucide-react";
import { AuthCard } from "../../components/auth/AuthCard";
import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { RememberMeCheckbox } from "../../components/auth/RememberMeCheckbox";
import { AuthDivider } from "../../components/auth/AuthDivider";
import { SocialButton } from "../../components/auth/SocialButton";
import { SEOHead } from "../../components/public/SEOHead";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid institutional email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate client authentication validation before dashboard handoff
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Store dummy token for frontend navigation preview
      localStorage.setItem("access_token", "demo_token_v0.20.0");
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Invalid institutional credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <SEOHead title="Institutional Login" description="Sign in to your College ERP institutional dashboard." />

      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to College ERP</h2>
        <p className="text-xs text-slate-400">Enter your institutional credentials to access your tenant portal</p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Social Single Sign-On Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <SocialButton
          provider="Google"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          }
        />
        <SocialButton
          provider="Microsoft"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
          }
        />
      </div>

      <AuthDivider label="or sign in with email" />

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <AuthInput
          label="Institutional Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@institution.edu"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          error={errors.password}
        />

        <div className="flex items-center justify-between pt-1">
          <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

          <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Authenticating Tenant...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to Portal</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-3 text-xs">
        <p className="text-slate-400">
          Don't have an institutional tenant?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            Register Institution
          </Link>
        </p>

        <Link to="/" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to Marketing Website
        </Link>
      </div>
    </AuthCard>
  );
};
