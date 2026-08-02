import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Briefcase, Plus, Mail, Building2 } from "lucide-react";

interface ReferralItem {
  id: string;
  referrer_id_code: string;
  company: string;
  role: string;
  openings: number;
  expiry_date: string;
  contact_email: string;
}

export const JobReferralsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<ReferralItem[]>([
    { id: "1", referrer_id_code: "ALU-2022-0192", company: "Google India", role: "Software Engineer II (Backend)", openings: 3, expiry_date: "2026-08-30", contact_email: "ananya.sharma@google.com" },
    { id: "2", referrer_id_code: "ALU-2023-0401", company: "PayTech Solutions", role: "Fullstack Tech Lead", openings: 2, expiry_date: "2026-09-15", contact_email: "careers@paytech.io" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/job-referrals/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setReferrals(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ReferralItem>[] = [
    { key: "referrer_id_code", header: "Referrer Alumni", sortable: true },
    { key: "company", header: "Company / Organization", sortable: true },
    { key: "role", header: "Open Position / Role" },
    { key: "openings", header: "Openings Count" },
    { key: "expiry_date", header: "Application Deadline" },
    { key: "contact_email", header: "Referral Email" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Job Referrals & Peer Hiring Board"
        subtitle="Post and discover alumni job referral opportunities, peer hiring, and corporate openings"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Post Job Referral
          </Button>
        }
      />

      <DataTable
        title="Active Alumni Job Referral Opportunities"
        data={referrals}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
