import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Award, Plus, FileText, CheckCircle2 } from "lucide-react";

interface OfferItem {
  id: string;
  offer_number: string;
  company_name: string;
  student_id_code: string;
  student_name: string;
  package: number;
  joining_date: string;
  offer_status: "Offered" | "Accepted" | "Rejected" | "Expired";
}

export const OffersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<OfferItem[]>([
    { id: "1", offer_number: "OFF-GOOG-0891", company_name: "Google India Ltd", student_id_code: "STU-2023-0891", student_name: "Rahul Sharma", package: 3200000, joining_date: "2026-10-01", offer_status: "Accepted" },
    { id: "2", offer_number: "OFF-MSFT-0442", company_name: "Microsoft R&D", student_id_code: "STU-2023-0442", student_name: "Priya Patel", package: 2800000, joining_date: "2026-10-15", offer_status: "Accepted" },
    { id: "3", offer_number: "OFF-AMZN-0115", company_name: "Amazon Web Services", student_id_code: "STU-2023-0115", student_name: "Aman Verma", package: 2400000, joining_date: "2026-11-01", offer_status: "Offered" },
  ]);

  useEffect(() => {
    fetch("/api/placement/offers/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setOffers(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<OfferItem>[] = [
    { key: "offer_number", header: "Offer Letter No", sortable: true },
    { key: "company_name", header: "Recruiting Company", sortable: true },
    { key: "student_id_code", header: "Student ID" },
    { key: "student_name", header: "Candidate Name" },
    { key: "package", header: "Offered CTC (₹)", accessor: (r) => `₹${(r.package / 100000).toFixed(2)} LPA` },
    { key: "joining_date", header: "Joining Date" },
    {
      key: "offer_status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.offer_status.toUpperCase()}
          variant={r.offer_status === "Accepted" ? "success" : r.offer_status === "Offered" ? "info" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Corporate Offer Letters & Student Acceptance"
        subtitle="Manage job offer letters, CTC compensation packages, joining dates, and student responses"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Issue Offer Letter
          </Button>
        }
      />

      <DataTable
        title="Issued Job Offers & Placement Confirmation"
        data={offers}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
