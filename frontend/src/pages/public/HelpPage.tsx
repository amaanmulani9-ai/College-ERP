import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileCheck,
  Shield,
  CreditCard,
} from "lucide-react";

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      q: "How does multi-tenant database isolation work in CampusPro ERP?",
      a: "CampusPro uses PostgreSQL schema isolation via `django-tenants`. Each college or university receives a distinct schema in the database. Shared application logic runs against tenant-specific schemas automatically determined by the request HTTP domain or tenant header.",
    },
    {
      q: "Can we integrate biometric attendance devices with the ERP?",
      a: "Yes! The Attendance Tracking Module provides automated REST APIs and webhook listeners for ZKTeco, Suprema, and standard HTTP biometric push protocols to log student and staff attendance in real time.",
    },
    {
      q: "What payment gateways are supported for online student fee collection?",
      a: "CampusPro ERP natively integrates with Razorpay, Stripe, and UPI gateways. It includes automatic webhook receipt generation, transaction audit trails, and instant status reconciliation.",
    },
    {
      q: "How are student hall tickets and transcripts generated?",
      a: "Hall tickets and official transcripts are generated dynamically as digitally verifiable PDFs complete with QR verification codes, institutional seals, and student photo placeholders.",
    },
    {
      q: "What roles are available in the RBAC matrix?",
      a: "14 default pre-configured roles are included: System Administrator, Registrar, Dean, Head of Department (HOD), Faculty Member, Accountant, Warden, Librarian, Exam Controller, Student, Parent, and Backoffice Staff.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          Help Center & Documentation
        </div>
        <h1 className="text-4xl font-extrabold text-white">How Can We Help You?</h1>
        <p className="text-slate-300 text-sm">
          Search our knowledge base or browse frequently asked institutional questions.
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto pt-4">
          <Search className="w-4 h-4 absolute left-4 top-7 text-slate-500" />
          <input
            type="text"
            placeholder="Search FAQs, setup guides, API docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xl"
          />
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-indigo-300"
            >
              <span>{faq.q}</span>
              {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {openFaq === idx && (
              <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still need help CTA */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Still have questions?</h3>
        <p className="text-xs text-slate-400">Our enterprise technical support team is available 24/7 for institutional subscribers.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg"
        >
          <MessageSquare className="w-4 h-4" /> Contact Support Team
        </Link>
      </div>
    </div>
  );
};
