import React from "react";
import { Shield, Lock, CheckCircle2 } from "lucide-react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Data Protection & Privacy
        </div>
        <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400 font-mono">Last Updated: August 1, 2026</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Multi-Tenant Data Isolation</h2>
          <p>
            CampusPro ERP operates on a PostgreSQL schema-isolated multi-tenant SaaS architecture (`django-tenants`). Each subscriber educational institution is assigned a separate database schema. Data from one tenant institution is logically and cryptographically inaccessible to any other tenant institution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. FERPA & GDPR Compliance</h2>
          <p>
            We strictly adhere to student privacy standards under FERPA (Family Educational Rights and Privacy Act) and GDPR. Personally Identifiable Information (PII) including student grades, identity documents, and guardian contacts are encrypted both at rest (AES-256) and in transit (TLS 1.3).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Information Collection & Usage</h2>
          <p>
            We process institutional user data (student records, faculty employment details, fee transactions) strictly for the purpose of operating the ERP platform on behalf of the customer institution. We do not sell, rent, or monetize educational data under any circumstances.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Audit Logs & Data Retention</h2>
          <p>
            All critical administrative actions (grade overrides, fee waivers, permission changes) are logged in permanent audit trails for compliance verification. Institutions retain full ownership of their data and can request complete database export dumps at any time.
          </p>
        </section>
      </div>
    </div>
  );
};
