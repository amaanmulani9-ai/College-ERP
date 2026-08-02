import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Truck, Plus, PackageCheck, Mail } from "lucide-react";

interface DeliveryItem {
  id: string;
  courier_company: string;
  tracking_number: string;
  recipient_email: string;
  department_name: string;
  delivery_status: string;
  received_at: string;
}

export const DeliveryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([
    { id: "1", courier_company: "Amazon Logistics", tracking_number: "TBA-9910293019", recipient_email: "prof.sunil@college.edu", department_name: "Computer Science", delivery_status: "Received", received_at: "2026-08-02 10:30 AM" },
    { id: "2", courier_company: "BlueDart Express", tracking_number: "BD-8819203912", recipient_email: "tnp_officer@college.edu", department_name: "Training & Placement", delivery_status: "Handed Over", received_at: "2026-08-01 03:15 PM" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/deliveries/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setDeliveries(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<DeliveryItem>[] = [
    { key: "tracking_number", header: "Tracking No", sortable: true },
    { key: "courier_company", header: "Courier Service", sortable: true },
    { key: "recipient_email", header: "Recipient Staff / Student" },
    { key: "department_name", header: "Department" },
    { key: "received_at", header: "Gate Receipt Time" },
    {
      key: "delivery_status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.delivery_status.toUpperCase()}
          variant={r.delivery_status === "Handed Over" ? "success" : r.delivery_status === "Received" ? "info" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inward Courier & Parcel Deliveries Log"
        subtitle="Track incoming courier packages, tracking numbers, recipient staff/students, and gate dispatch status"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Log Courier Package
          </Button>
        }
      />

      <DataTable
        title="Institutional Gate Parcel Inward Registry"
        data={deliveries}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
