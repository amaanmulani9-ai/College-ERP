import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { HeartHandshake, Plus, FileText, DollarSign } from "lucide-react";

interface DonationItem {
  id: string;
  donor_id_code: string;
  campaign_name: string;
  amount: number;
  payment_status: string;
  date: string;
}

export const DonationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<DonationItem[]>([
    { id: "1", donor_id_code: "ALU-2022-0192", campaign_name: "AI & Supercomputing Innovation Lab Fund", amount: 500000, payment_status: "Completed", date: "2026-07-15" },
    { id: "2", donor_id_code: "ALU-2023-0401", campaign_name: "Merit-cum-Means Student Scholarship Endowment", amount: 250000, payment_status: "Completed", date: "2026-07-20" },
    { id: "3", donor_id_code: "ALU-2021-0883", campaign_name: "Campus Library Digital Expansion", amount: 100000, payment_status: "Completed", date: "2026-07-28" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/donations/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setDonations(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<DonationItem>[] = [
    { key: "donor_id_code", header: "Donor Alumni ID", sortable: true },
    { key: "campaign_name", header: "Fundraising Campaign" },
    { key: "amount", header: "Amount (₹)", accessor: (r) => `₹${r.amount.toLocaleString()}` },
    { key: "date", header: "Donation Date" },
    {
      key: "payment_status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.payment_status.toUpperCase()}
          variant={r.payment_status === "Completed" ? "success" : "warning"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Philanthropic Giving & Contributions"
        subtitle="Track alumni financial donations, endowment funds, scholarship sponsorships, and payment receipts"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Record Donation
          </Button>
        }
      />

      <DataTable
        title="Institutional Alumni Donation Register"
        data={donations}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
