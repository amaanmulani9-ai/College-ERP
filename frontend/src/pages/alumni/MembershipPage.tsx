import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Award, Plus, RefreshCw, CheckCircle2 } from "lucide-react";

interface MembershipItem {
  id: string;
  membership_number: string;
  alumni_id_code: string;
  membership_type: "Standard" | "Premium" | "Lifetime";
  join_date: string;
  expiry_date: string;
  status: "Active" | "Expired" | "Suspended";
}

export const MembershipPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<MembershipItem[]>([
    { id: "1", membership_number: "MEM-ALU-2022-0192", alumni_id_code: "ALU-2022-0192", membership_type: "Lifetime", join_date: "2022-07-01", expiry_date: "2099-12-31", status: "Active" },
    { id: "2", membership_number: "MEM-ALU-2023-0401", alumni_id_code: "ALU-2023-0401", membership_type: "Premium", join_date: "2023-08-10", expiry_date: "2026-08-10", status: "Active" },
    { id: "3", membership_number: "MEM-ALU-2021-0883", alumni_id_code: "ALU-2021-0883", membership_type: "Standard", join_date: "2021-06-15", expiry_date: "2025-06-15", status: "Expired" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/memberships/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setMemberships(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<MembershipItem>[] = [
    { key: "membership_number", header: "Membership No", sortable: true },
    { key: "alumni_id_code", header: "Alumni ID" },
    {
      key: "membership_type",
      header: "Tier / Plan",
      accessor: (r) => (
        <span className={`font-semibold ${r.membership_type === "Lifetime" ? "text-amber-400" : r.membership_type === "Premium" ? "text-purple-400" : "text-slate-300"}`}>
          {r.membership_type}
        </span>
      ),
    },
    { key: "join_date", header: "Join Date" },
    { key: "expiry_date", header: "Expiry Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Active" ? "success" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Membership Tiers & Renewals"
        subtitle="Manage Standard, Premium & Lifetime Patron memberships, privileges, and annual renewals"
        actions={
          <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Renew Memberships
          </Button>
        }
      />

      <DataTable
        title="Institutional Alumni Membership Register"
        data={memberships}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
