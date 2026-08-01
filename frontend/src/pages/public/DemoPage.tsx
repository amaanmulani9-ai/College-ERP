import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Calendar, CheckCircle2, ShieldCheck, Clock, Layers, Sparkles, ArrowRight } from "lucide-react";

export const DemoPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    institutionType: "Engineering College",
    studentCount: "1,000 - 5,000",
    country: "India",
    preferredDate: "",
    message: "",
  });

  useEffect(() => {
    document.title = "Schedule a Live Institutional Demo | College ERP";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const benefits = [
    { title: "Live Sandbox Access", desc: "Test real-time student allocations, marks entry, and fee receipt generation." },
    { title: "Custom Schema Walkthrough", desc: "See how django-tenants isolates your institution's data completely." },
    { title: "1-on-1 Architecture Q&A", desc: "Discuss legacy database migration, API webhooks, and biometric hardware sync." },
    { title: "Tailored Price Estimate", desc: "Get an instant deployment cost breakdown customized to your student count." },
  ];

  const processSteps = [
    { step: "01", title: "Request Submitted", desc: "We receive your institution details and assign a dedicated solution engineer." },
    { step: "02", title: "Sandbox Provisioned", desc: "A demo tenant schema is automatically created for your institution." },
    { step: "03", title: "Live 45-Min Guided Session", desc: "Interactive walkthrough of all 20 modules aligned with your workflow." },
    { step: "04", title: "Trial Access Handover", desc: "Full administrative credential access granted for 14-day evaluation." },
  ];

  return (
    <div className="pt-10 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
          <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
          Interactive Product Demonstration
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Book a Live Guided ERP Demo
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          See how College ERP streamlines academics, fee collection, hall tickets, attendance, and hostel management in action.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Column (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Schedule Your Session</h2>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4 bg-purple-950/40 p-8 rounded-2xl border border-purple-800/60">
              <CheckCircle2 className="w-16 h-16 text-purple-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">Demo Scheduled!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{formData.name}</strong>. A calendar invite and sandbox login credentials have been dispatched to <strong className="text-white">{formData.email}</strong>.
              </p>
              <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors">
                Book Another Session
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Prof. Ananya Sen"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="a.sen@university.edu"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organization / College Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Bangalore National University"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Institution Type</label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="State University">State University</option>
                    <option value="Engineering College">Engineering College</option>
                    <option value="Medical College">Medical College</option>
                    <option value="Business School">Business School</option>
                    <option value="Polytechnic Institute">Polytechnic Institute</option>
                    <option value="K-12 School">K-12 School</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Enrollment</label>
                  <select
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Under 1,000">Under 1,000 Students</option>
                    <option value="1,000 - 5,000">1,000 - 5,000 Students</option>
                    <option value="5,000 - 15,000">5,000 - 15,000 Students</option>
                    <option value="15,000+">15,000+ Students (Multi-Campus)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Demo Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention any specific modules you want to prioritize (e.g. Hostel allocation, Razorpay fee receipts, biometric attendance)..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Confirm Live Demo Schedule
              </button>
            </form>
          )}
        </div>

        {/* Benefits & Process (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white">What You'll Experience</h3>
            <div className="space-y-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs text-white font-bold">{b.title}</strong>
                    <span className="text-[11px] text-slate-400">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Process Timeline */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white">Implementation Timeline</h3>
            <div className="space-y-3">
              {processSteps.map((p, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {p.step}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.title}</h4>
                    <p className="text-[11px] text-slate-400">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
