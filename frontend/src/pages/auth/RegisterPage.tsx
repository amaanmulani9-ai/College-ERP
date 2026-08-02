import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building2, Shield, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthCard } from "../../components/auth/AuthCard";
import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { RegistrationStepper } from "../../components/auth/RegistrationStepper";
import { PasswordStrengthMeter } from "../../components/auth/PasswordStrengthMeter";
import { PasswordChecklist } from "../../components/auth/PasswordChecklist";
import { SuccessCard } from "../../components/auth/SuccessCard";
import { AuthAlert } from "../../components/auth/AuthAlert";
import { SEOHead } from "../../components/public/SEOHead";

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    tenant: "stanford-demo",
    role: "Student",
    department: "Computer Science",
    acceptTerms: false,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email address is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    } else if (currentStep === 2) {
      if (!formData.tenant) newErrors.tenant = "Please select an institution tenant";
      if (!formData.role) newErrors.role = "Role selection is required";
      if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms of service";
    } else if (currentStep === 3) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Must be at least 8 characters";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    setIsSubmitting(true);
    try {
      // Simulate backend registration call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage("Registration failed. Institutional tenant domain or email may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthCard>
        <SEOHead title="Registration Successful" description="Account registered successfully." />
        <SuccessCard
          title="Account Created!"
          message={`Welcome ${formData.firstName}! Your user profile has been registered for tenant ${formData.tenant}.`}
          actionText="Proceed to Portal Sign In"
          actionRoute="/login"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <SEOHead title="Register Account" description="Create an institutional user account on College ERP." />

      <div className="text-center space-y-1 mb-4">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Create User Account</h2>
        <p className="text-xs text-slate-400">Step {step} of 4 — Complete registration wizard</p>
      </div>

      <RegistrationStepper currentStep={step} />

      {errorMessage && <AuthAlert type="error" message={errorMessage} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <AuthInput
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Amaan"
                  icon={<User className="w-4 h-4" />}
                  error={errors.firstName}
                />
                <AuthInput
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Khan"
                  error={errors.lastName}
                />
              </div>

              <AuthInput
                label="Institutional Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="amaan@university.edu"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
              />

              <AuthInput
                label="Mobile Phone Number"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                placeholder="+1 (555) 019-2834"
                icon={<Phone className="w-4 h-4" />}
                error={errors.mobile}
              />
            </div>
          )}

          {/* STEP 2: Institution & Role */}
          {step === 2 && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Tenant Institution
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={formData.tenant}
                    onChange={(e) => handleChange("tenant", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="stanford-demo">Stanford Institute of Technology</option>
                    <option value="oxford-academy">Oxford Global Academy</option>
                    <option value="mit-campus">MIT Engineering Campus</option>
                    <option value="default-tenant">Public Campus Tenant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  RBAC Role Category
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Student">Student User</option>
                    <option value="Faculty">Faculty / Teacher</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="Registrar">College Registrar</option>
                    <option value="Finance">Finance Officer</option>
                  </select>
                </div>
              </div>

              <AuthInput
                label="Department (Optional)"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Computer Science & Engineering"
              />

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I accept the <Link to="/terms" className="text-indigo-400 underline">Terms of Service</Link> and{" "}
                    <Link to="/privacy" className="text-indigo-400 underline">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-[11px] text-red-400 font-medium pt-1">{errors.acceptTerms}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Security & Credentials */}
          {step === 3 && (
            <div className="space-y-3.5 text-xs">
              <PasswordInput
                label="Create Password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••••••"
                error={errors.password}
              />

              <PasswordStrengthMeter password={formData.password} />

              <PasswordInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="••••••••••••"
                error={errors.confirmPassword}
              />

              <PasswordChecklist password={formData.password} />
            </div>
          )}

          {/* STEP 4: Summary & Submit */}
          {step === 4 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Account Summary Review
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Name</span>
                    <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Email</span>
                    <span className="font-semibold">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Tenant</span>
                    <span className="font-semibold">{formData.tenant}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Role</span>
                    <span className="font-semibold">{formData.role}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Stepper Footer Controls */}
      <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/80">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="py-2.5 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        ) : (
          <Link
            to="/login"
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold transition-colors"
          >
            Sign In Instead
          </Link>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 ml-auto"
          >
            Next Step <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-2.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 ml-auto"
          >
            {isSubmitting ? "Creating Account..." : "Confirm & Register"}
          </button>
        )}
      </div>
    </AuthCard>
  );
};
