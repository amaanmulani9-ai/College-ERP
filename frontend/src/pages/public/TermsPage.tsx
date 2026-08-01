import React from "react";
import { FileText, ShieldCheck } from "lucide-react";

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          SaaS Agreement
        </div>
        <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400 font-mono">Last Updated: August 1, 2026</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Subscription & Services</h2>
          <p>
            CampusPro ERP provides subscription-based software-as-a-service (SaaS) for educational institutional management. By subscribing, the customer institution agrees to utilize the platform in accordance with authorized student and staff limits under the chosen plan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Service Level Agreement (SLA)</h2>
          <p>
            CampusPro guarantees 99.99% monthly service uptime for core database and web application services. Planned maintenance windows are communicated at least 48 hours in advance during off-peak hours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Acceptable Use Policy</h2>
          <p>
            Subscriber accounts must not attempt to bypass tenant schema isolation, reverse engineer backend API contracts, or deploy malicious scripts. Access is governed by role-based authorization matrices configured by the customer’s system administrator.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Termination & Data Export</h2>
          <p>
            Upon cancellation or expiration of a subscription, the institution is granted a 60-day grace period to download full SQL schema backups and media archives.
          </p>
        </section>
      </div>
    </div>
  );
};
