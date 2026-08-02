import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, MapPin } from "lucide-react";

interface RouteItem {
  id: string;
  route_code: string;
  route_name: string;
  source: string;
  destination: string;
  distance_km: number;
  estimated_duration_mins: number;
  is_active: boolean;
}

export const RouteListPage: React.FC = () => {
  const routes: RouteItem[] = [
    {
      id: "1",
      route_code: "R-01",
      route_name: "City Center to Main Campus",
      source: "City Center Station",
      destination: "Main Campus Gate 1",
      distance_km: 15.5,
      estimated_duration_mins: 45,
      is_active: true,
    },
    {
      id: "2",
      route_code: "R-02",
      route_name: "North Suburbs to Campus",
      source: "North Terminal",
      destination: "Main Campus Gate 2",
      distance_km: 22.0,
      estimated_duration_mins: 60,
      is_active: true,
    },
  ];

  const columns: ColumnDef<RouteItem>[] = [
    { key: "route_code", header: "Route Code", sortable: true },
    { key: "route_name", header: "Route Name", sortable: true },
    { key: "source", header: "Source" },
    { key: "destination", header: "Destination" },
    { key: "distance_km", header: "Distance (km)" },
    { key: "estimated_duration_mins", header: "Est. Time (mins)" },
    {
      key: "is_active",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.is_active ? "ACTIVE" : "INACTIVE"}
          variant={r.is_active ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Transport Routes & Stops"
        subtitle="Manage route paths, pickup/drop stops, distance & estimated travel times"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Route
          </Button>
        }
      />

      <DataTable data={routes} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
