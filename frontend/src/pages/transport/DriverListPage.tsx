import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, UserCheck } from "lucide-react";

interface DriverItem {
  id: string;
  name: string;
  license_number: string;
  license_expiry: string;
  phone: string;
  experience_years: number;
  status: "active" | "on_leave" | "suspended" | "inactive";
}

export const DriverListPage: React.FC = () => {
  const drivers: DriverItem[] = [
    {
      id: "1",
      name: "Ramesh Sharma",
      license_number: "DL-9988776655",
      license_expiry: "2027-06-30",
      phone: "+91 98765 43210",
      experience_years: 12,
      status: "active",
    },
    {
      id: "2",
      name: "Suresh Patil",
      license_number: "DL-1122334455",
      license_expiry: "2026-08-25", // Expiring soon!
      phone: "+91 98765 12345",
      experience_years: 8,
      status: "active",
    },
  ];

  const columns: ColumnDef<DriverItem>[] = [
    { key: "name", header: "Driver Name", sortable: true },
    { key: "license_number", header: "License Number" },
    { key: "license_expiry", header: "License Expiry", sortable: true },
    { key: "phone", header: "Contact Number" },
    { key: "experience_years", header: "Experience (yrs)" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "active" ? "success" : "warning"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Driver Profiles & Licensing"
        subtitle="Manage bus driver certifications, license expiries & contact directory"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Driver
          </Button>
        }
      />

      <DataTable data={drivers} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
