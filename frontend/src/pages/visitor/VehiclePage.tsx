import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Car, Plus, MapPin, Shield } from "lucide-react";

interface VehicleItem {
  id: string;
  visitor_name: string;
  vehicle_number: string;
  vehicle_type: string;
  parking_slot: string;
}

export const VehiclePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([
    { id: "1", visitor_name: "Dr. Rajesh K. Sharma", vehicle_number: "KA-01-MJ-9901", vehicle_type: "Four-Wheeler", parking_slot: "Visitor Slot V-12" },
    { id: "2", visitor_name: "Suresh Gupta", vehicle_number: "KA-05-AB-1234", vehicle_type: "Commercial", parking_slot: "Loading Bay Slot L-02" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/vehicles/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setVehicles(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<VehicleItem>[] = [
    { key: "vehicle_number", header: "Vehicle Number Plate", sortable: true },
    { key: "visitor_name", header: "Visitor Owner", sortable: true },
    { key: "vehicle_type", header: "Vehicle Category" },
    { key: "parking_slot", header: "Assigned Campus Parking Slot" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Visitor Vehicles & Parking Allocation Register"
        subtitle="Manage visitor vehicle registrations, vehicle types, license plate numbers, and assigned parking slots"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register Vehicle
          </Button>
        }
      />

      <DataTable
        title="Campus Parking Slot Allocations"
        data={vehicles}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
