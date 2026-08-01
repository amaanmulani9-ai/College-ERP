import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  Modal,
  TextInput,
  Select,
  ColumnDef,
} from "../../design-system";
import { Plus, Bus } from "lucide-react";

interface VehicleItem {
  id: string;
  vehicle_code: string;
  registration_number: string;
  vehicle_name: string;
  vehicle_type: string;
  capacity: number;
  manufacturer: string;
  status: "active" | "inactive" | "maintenance" | "retired";
  gps_enabled: boolean;
}

export const VehicleListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles] = useState<VehicleItem[]>([
    {
      id: "1",
      vehicle_code: "BUS-101",
      registration_number: "MH-12-AB-1234",
      vehicle_name: "Yellow School Bus #1",
      vehicle_type: "Bus",
      capacity: 40,
      manufacturer: "Tata Motors",
      status: "active",
      gps_enabled: true,
    },
    {
      id: "2",
      vehicle_code: "BUS-102",
      registration_number: "MH-12-CD-5678",
      vehicle_name: "Express Campus Shuttle",
      vehicle_type: "Mini Bus",
      capacity: 25,
      manufacturer: "Eicher",
      status: "active",
      gps_enabled: true,
    },
  ]);

  const columns: ColumnDef<VehicleItem>[] = [
    { key: "vehicle_code", header: "Code", sortable: true },
    { key: "vehicle_name", header: "Vehicle Name", sortable: true },
    { key: "registration_number", header: "Reg #" },
    { key: "vehicle_type", header: "Type" },
    { key: "capacity", header: "Capacity" },
    { key: "manufacturer", header: "Manufacturer" },
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
        title="Vehicle Fleet Registry"
        subtitle="Manage institution buses, minivans, capacities & registration details"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Register Vehicle
          </Button>
        }
      />

      <DataTable
        data={vehicles}
        columns={columns}
        keyExtractor={(r) => r.id}
        selectable
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Fleet Vehicle"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Vehicle
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Vehicle Code" placeholder="e.g. BUS-104" required />
          <TextInput label="Registration Number" placeholder="MH-12-XX-0000" required />
          <TextInput label="Vehicle Name" placeholder="e.g. West Route Express" required />
          <Select
            label="Vehicle Type"
            options={[
              { label: "Bus", value: "bus" },
              { label: "Mini Bus", value: "mini_bus" },
              { label: "Van", value: "van" },
            ]}
          />
          <TextInput label="Seating Capacity" type="number" placeholder="40" required />
        </div>
      </Modal>
    </PageContainer>
  );
};
