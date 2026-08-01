import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Truck } from "lucide-react";

interface SupplierItem {
  id: string;
  supplier_code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  gst_number: string;
  status: "active" | "inactive";
}

export const SupplierPage: React.FC = () => {
  const suppliers: SupplierItem[] = [
    { id: "1", supplier_code: "SUP-001", company_name: "TechLab Solutions Ltd", contact_person: "Ravi Kumar", phone: "+91 98765 43210", email: "sales@techlab.com", gst_number: "27AAAAA0000A1Z5", status: "active" },
    { id: "2", supplier_code: "SUP-002", company_name: "National Stationery Mart", contact_person: "Deepak Patel", phone: "+91 98765 12345", email: "orders@stationerymart.com", gst_number: "27BBBBB1111B2Z6", status: "active" },
  ];

  const columns: ColumnDef<SupplierItem>[] = [
    { key: "supplier_code", header: "Code", sortable: true },
    { key: "company_name", header: "Company Name", sortable: true },
    { key: "contact_person", header: "Contact Person" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "gst_number", header: "GST Number" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "active" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Supplier & Vendor Directory"
        subtitle="Manage approved vendor contacts, GST credentials & procurement histories"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Supplier
          </Button>
        }
      />

      <DataTable data={suppliers} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
