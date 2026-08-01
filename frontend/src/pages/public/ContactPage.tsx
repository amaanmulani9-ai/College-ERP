import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Shield, HelpCircle, Briefcase } from "lucide-react";

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    department: "Sales",
    message: "",
  });

  useEffect(() => {
    document.title = "Contact Institutional Sales & Support | College ERP";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const departments = [
    {
      name: "Institutional Sales",
      email: "sales@college-erp.cloud",
      phone: "+1 (800) 555-0199",
      icon: <Briefcase className="w-5 h-5 text-indigo-400" />,
      desc: "New subscriptions, university custom pricing, and SLA agreements.",
    },
    {
      name: "Customer Support",
      email: "support@college-erp.cloud",
      phone: "+1 (800) 555-0198",
      icon: <HelpCircle className="w-5 h-5 text-emerald-400" />,
      desc: "24/7 technical ticketing, module configuration, and user guidance.",
    },
    {
      name: "Technical & API Team",
      email: "dev@college-erp.cloud",
      phone: "+1 (800) 555-0197",
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      desc: "REST API integrations, webhook configuration, and biometric hardware setup.",
    },
    {
      name: "Business Operations",
      email: "biz@college-erp.cloud",
      phone: "+1 (800) 555-0196",
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      desc: "Partnerships, vendor procurement, and compliance audits.",
    },
  ];

  return (
    <div className="pt-10 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          Enterprise Support & Inquiries
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Get in Touch with Our Team
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Have questions about multi-tenant schema isolation, pricing tiers, or implementation timelines? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4 bg-emerald-950/40 p-8 rounded-2xl border border-emerald-800/60">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">Message Received!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for contacting College ERP. An institutional account manager will reply to <strong className="text-white">{formData.email}</strong> within 2 business hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors">
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="r.sharma@institution.edu"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Institution Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Delhi Institute of Technology"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Department Target</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Sales">Institutional Sales & Pricing</option>
                  <option value="Support">Customer & Technical Support</option>
                  <option value="API">API & Biometric Integration</option>
                  <option value="Business">Business Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Message / Inquiry *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your campus size, current ERP setup, and preferred implementation timeline..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Enterprise Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Map Placeholder (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white">Global Headquarters</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Campus Operations Center</strong>
                  <span>Suite 800, Tech Park Boulevard, Silicon Valley, CA 94025</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>contact@college-erp.cloud</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>+1 (800) 555-0199 (Toll-Free)</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Mon - Fri: 8:00 AM - 8:00 PM EST (24/7 SLA for Enterprise)</span>
              </div>
            </div>

            {/* Google Maps Interactive Placeholder */}
            <div className="bg-slate-950 rounded-2xl h-48 border border-slate-800 relative overflow-hidden flex items-center justify-center text-center p-4">
              <div className="space-y-2">
                <MapPin className="w-8 h-8 text-indigo-500 animate-bounce mx-auto" />
                <span className="block text-xs font-bold text-white">Interactive Map Location</span>
                <span className="block text-[10px] text-slate-400 font-mono">37.7749° N, 122.4194° W • Cloud Datacenter East-1</span>
              </div>
            </div>
          </div>

          {/* Department Contact Directory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  {dept.icon}
                  <h4 className="text-xs font-bold text-white">{dept.name}</h4>
                </div>
                <p className="text-[11px] text-indigo-300 font-mono">{dept.email}</p>
                <p className="text-[10px] text-slate-400">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
