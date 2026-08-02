import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Building2, Plus, Globe, Mail } from "lucide-react";

interface CompanyItem {
  id: string;
  company_code: string;
  company_name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  package_range: string;
  status: string;
}

export const CompanyPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<CompanyItem[]>([
    { id: "1", company_code: "COMP-GOOG", company_name: "Google India Pvt Ltd", industry: "Information Technology", website: "https://careers.google.com", email: "campus-in@google.com", phone: "080-67890000", package_range: "25.0 LPA - 45.0 LPA", status: "active" },
    { id: "2", company_code: "COMP-MSFT", company_name: "Microsoft Corporation India", industry: "Cloud & Software", website: "https://careers.microsoft.com", email: "university-in@microsoft.com", phone: "040-66880000", package_range: "22.0 LPA - 38.0 LPA", status: "active" },
    { id: "3", company_code: "COMP-TCS", company_name: "Tata Consultancy Services", industry: "IT Services & Consulting", website: "https://www.tcs.com", email: "campus.recruitment@tcs.com", phone: "022-67789999", package_range: "4.0 LPA - 10.0 LPA", status: "active" },
  ]);

  useEffect(() => {
    fetch("/api/placement/companies/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setCompanies(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<CompanyItem>[] = [
    { key: "company_code", header: "Code", sortable: true },
    { key: "company_name", header: "Company Name", sortable: true },
    { key: "industry", header: "Industry / Sector" },
    { key: "package_range", header: "CTC Package Range" },
    { key: "email", header: "Recruiter Email" },
    { key: "phone", header: "Contact Phone" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "active" ? "success" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Corporate Recruiting Companies Directory"
        subtitle="Manage corporate partners, industry sectors, recruiter contacts, and package tiers"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Recruiting Company
          </Button>
        }
      />

      <DataTable
        title="Verified Corporate Recruiters"
        data={companies}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
