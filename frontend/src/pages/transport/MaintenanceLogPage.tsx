import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Wrench } from "lucide-react";

interface MaintenanceItem {
  id: string;
  vehicle_name: string;
  service_date: string;
  odometer_reading: number;
  cost: number;
  vendor: string;
  next_service_date: string;
}

export const MaintenanceLogPage: React.FC = () => {
  const logs: MaintenanceItem[] = [
    {
      id: "1",
      vehicle_name: "Yellow School Bus #1 (BUS-101)",
      service_date: "2026-07-15",
      odometer_reading: 45200,
      cost: 12500,
      vendor: "Authorized Tata Motors Service Center",
      next_service_date: "2026-10-15",
    },
    {
      id: "2",
      vehicle_name: "Express Campus Shuttle (BUS-102)",
      service_date: "2026-06-20",
      odometer_reading: 32100,
      cost: 8400,
      vendor: "Eicher Motors Workshop",
      next_service_date: "2026-09-20",
    },
  ];

  const columns: ColumnDef<MaintenanceItem>[] = [
    { key: "vehicle_name", header: "Vehicle", sortable: true },
    { key: "service_date", header: "Service Date", sortable: true },
    { key: "odometer_reading", header: "Odometer (km)" },
    {
      key: "cost",
      header: "Cost (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.cost.toLocaleString()}</span>,
    },
    { key: "vendor", header: "Vendor / Workshop" },
    { key: "next_service_date", header: "Next Service Due" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Vehicle Maintenance & Service Logs"
        subtitle="Track routine servicing, repairs, odometer readings & service center expenses"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Record Service Entry
          </Button>
        }
      />

      <DataTable data={logs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
