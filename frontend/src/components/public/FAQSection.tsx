import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  category: "Platform" | "Security" | "Modules" | "Deployment";
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is College ERP?",
      answer:
        "College ERP is a next-generation multi-tenant SaaS platform engineered specifically for higher education institutions. Built on Django 5 and React 19, it unifies admissions, academics, fee collection, attendance, examinations, certificates, library, and hostels into one schema-isolated cloud system.",
      category: "Platform",
    },
    {
      question: "How secure is the platform?",
      answer:
        "Security is built-in from the ground up. Every institution benefits from PostgreSQL schema isolation (django-tenants), SimpleJWT authentication with token revocation, Redis-cached dynamic RBAC, lockout protection against brute-force attacks, parameterized queries, and full audit logging.",
      category: "Security",
    },
    {
      question: "Does it support Multi-Tenant?",
      answer:
        "Yes, 100%. Every college or university gets a dedicated, isolated PostgreSQL database schema. Data cannot cross tenant boundaries under any circumstance, guaranteeing complete data sovereignty and regulatory compliance.",
      category: "Platform",
    },
    {
      question: "Can multiple campuses be managed?",
      answer:
        "Yes. The academic hierarchy supports multi-campus modeling under a unified institutional tenant. Faculties, departments, programs, and hostels can be tagged and filtered per campus location.",
      category: "Platform",
    },
    {
      question: "How are backups handled?",
      answer:
        "Automated daily snapshot backups are executed per tenant schema and stored across encrypted cloud object stores (S3 / GCS) with 30-day point-in-time recovery.",
      category: "Deployment",
    },
    {
      question: "Can we integrate payment gateways?",
      answer:
        "Yes. The Fee & Payment system features built-in support for Razorpay and Stripe with webhook listeners for instant payment reconciliation, automated fee receipt numbering, and refund tracking.",
      category: "Modules",
    },
    {
      question: "Does it support mobile?",
      answer:
        "Yes. The entire frontend is fully responsive across mobile phones, tablets, laptops, and desktop screens. Additionally, REST APIs are mobile-ready for native iOS and Android apps.",
      category: "Platform",
    },
    {
      question: "Can it integrate with biometric devices?",
      answer:
        "Yes. The Attendance module includes REST endpoint listeners for biometric fingerprint and facial recognition hardware for real-time daily staff and student attendance logging.",
      category: "Modules",
    },
    {
      question: "Can reports be exported?",
      answer:
        "Yes. All core tables support 1-click export to CSV, Excel, and official rendered PDF formats (such as Hall Tickets, Fee Receipts, Transcripts, and Outstanding Dues reports).",
      category: "Modules",
    },
    {
      question: "Does it support role-based access?",
      answer:
        "Yes. It includes 14 pre-seeded institutional roles (Dean, HOD, Faculty, Registrar, Accountant, Warden, Student, etc.) with a dynamic matrix authorization engine cached in Redis.",
      category: "Security",
    },
    {
      question: "Can modules be enabled individually?",
      answer:
        "Yes. All 20 modules are modularly decoupled. Institutions can activate only the modules they require (e.g., start with Admissions & Academics, then enable Hostel and Library later).",
      category: "Modules",
    },
    {
      question: "Is cloud deployment available?",
      answer:
        "Yes. It comes containerized with Docker Compose and pre-configured with a render.yaml manifest for 1-click cloud deployment on AWS, GCP, Azure, or Render.",
      category: "Deployment",
    },
    {
      question: "Do you provide training?",
      answer:
        "Yes. We provide comprehensive online onboarding documentation, video walkthroughs, administrator training sessions, and optional dedicated staff training workshops.",
      category: "Deployment",
    },
    {
      question: "How long is implementation?",
      answer:
        "Standard cloud tenant provisioning takes under 1 hour. Full data migration and academic structure setup typically take 3 to 7 business days depending on institution size.",
      category: "Deployment",
    },
    {
      question: "Can data be migrated?",
      answer:
        "Yes. We provide automated bulk CSV importer tools and custom migration scripts for transferring existing legacy student databases, employee rosters, and course catalogs cleanly.",
      category: "Deployment",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="faq">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          Frequently Asked Questions
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Everything You Need to Know
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Clear answers regarding architecture, security, module capabilities, and deployment.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                    Q{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span className="text-base font-bold text-white leading-snug">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
