import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Briefcase, Plus, Calendar, MapPin } from "lucide-react";

interface DriveItem {
  id: string;
  drive_code: string;
  company_name: string;
  job_role: string;
  ctc: number;
  location: string;
  mode: string;
  registration_start: string;
  registration_end: string;
  drive_date: string;
  status: string;
}

export const CampusDrivesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState<DriveItem[]>([
    { id: "1", drive_code: "DRV-2026-GOOG", company_name: "Google India Ltd", job_role: "Software Engineer (SDE-1)", ctc: 3200000, location: "Bangalore / Hyderabad", mode: "Hybrid", registration_start: "2026-07-20", registration_end: "2026-08-10", drive_date: "2026-08-15", status: "Registration Open" },
    { id: "2", drive_code: "DRV-2026-MSFT", company_name: "Microsoft R&D", job_role: "Cloud Solution Architect", ctc: 2800000, location: "Hyderabad", mode: "Online", registration_start: "2026-08-01", registration_end: "2026-08-18", drive_date: "2026-08-20", status: "Upcoming" },
    { id: "3", drive_code: "DRV-2026-AMZN", company_name: "Amazon Web Services", job_role: "Systems Development Engineer", ctc: 2400000, location: "Chennai / Remote", mode: "Offline", registration_start: "2026-07-01", registration_end: "2026-07-25", drive_date: "2026-07-28", status: "In Progress" },
  ]);

  useEffect(() => {
    fetch("/api/placement/drives/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setDrives(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<DriveItem>[] = [
    { key: "drive_code", header: "Drive Code", sortable: true },
    { key: "company_name", header: "Recruiter Company", sortable: true },
    { key: "job_role", header: "Designation / Role" },
    { key: "ctc", header: "CTC (₹)", accessor: (r) => `₹${(r.ctc / 100000).toFixed(2)} LPA` },
    { key: "mode", header: "Drive Mode" },
    { key: "registration_end", header: "Reg End Date" },
    { key: "drive_date", header: "Drive Date", sortable: true },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "Registration Open"
              ? "success"
              : r.status === "In Progress"
              ? "warning"
              : "info"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Recruitment Drives Calendar"
        subtitle="Manage upcoming campus drives, job descriptions, CTC packages, and drive dates"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Campus Drive
          </Button>
        }
      />

      <DataTable
        title="Institutional Campus Recruitment Schedule"
        data={drives}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
