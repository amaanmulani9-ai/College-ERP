import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Fuel } from "lucide-react";

interface FuelLogItem {
  id: string;
  vehicle_name: string;
  fuel_date: string;
  litres: number;
  cost: number;
  mileage_kml: number;
  vendor: string;
}

export const FuelLogsPage: React.FC = () => {
  const logs: FuelLogItem[] = [
    {
      id: "1",
      vehicle_name: "Yellow School Bus #1 (BUS-101)",
      fuel_date: "2026-07-30",
      litres: 65.5,
      cost: 6220,
      mileage_kml: 8.4,
      vendor: "Indian Oil Station #4",
    },
    {
      id: "2",
      vehicle_name: "Express Campus Shuttle (BUS-102)",
      fuel_date: "2026-07-28",
      litres: 45.0,
      cost: 4275,
      mileage_kml: 11.2,
      vendor: "Bharat Petroleum",
    },
  ];

  const columns: ColumnDef<FuelLogItem>[] = [
    { key: "vehicle_name", header: "Vehicle", sortable: true },
    { key: "fuel_date", header: "Fuel Date", sortable: true },
    { key: "litres", header: "Litres Filled" },
    {
      key: "cost",
      header: "Cost (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.cost.toLocaleString()}</span>,
    },
    { key: "mileage_kml", header: "Mileage (km/L)" },
    { key: "vendor", header: "Fuel Station" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Fuel Log & Mileage Audit"
        subtitle="Monitor diesel/petrol fill-ups, fuel costs & vehicle fuel efficiency"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Record Fuel Entry
          </Button>
        }
      />

      <DataTable data={logs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
