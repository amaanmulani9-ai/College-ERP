import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, UserPlus } from "lucide-react";

interface StudentAllocationItem {
  id: string;
  student_id: string;
  student_name: string;
  pass_number: string;
  route_code: string;
  vehicle_code: string;
  boarding_stop: string;
  fee_plan: string;
  is_active: boolean;
}

export const StudentAllocationPage: React.FC = () => {
  const allocations: StudentAllocationItem[] = [
    {
      id: "1",
      student_id: "STU-1001",
      student_name: "Aarav Sharma",
      pass_number: "TP-2026-8801",
      route_code: "R-01",
      vehicle_code: "BUS-101",
      boarding_stop: "City Station Stop #1",
      fee_plan: "Annual (₹18,000)",
      is_active: true,
    },
    {
      id: "2",
      student_id: "STU-1002",
      student_name: "Ananya Verma",
      pass_number: "TP-2026-8802",
      route_code: "R-02",
      vehicle_code: "BUS-102",
      boarding_stop: "North Terminal Stop #3",
      fee_plan: "Semester (₹9,500)",
      is_active: true,
    },
  ];

  const columns: ColumnDef<StudentAllocationItem>[] = [
    { key: "pass_number", header: "Pass Number", sortable: true },
    { key: "student_id", header: "Student ID" },
    { key: "student_name", header: "Student Name", sortable: true },
    { key: "route_code", header: "Route" },
    { key: "vehicle_code", header: "Vehicle" },
    { key: "boarding_stop", header: "Boarding Stop" },
    { key: "fee_plan", header: "Fee Plan" },
    {
      key: "is_active",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.is_active ? "ALLOCATED" : "INACTIVE"}
          variant={r.is_active ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Student Transport Allocation"
        subtitle="Assign students to buses, routes, boarding stops & transport fee plans"
        actions={
          <Button variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
            Allocate Student
          </Button>
        }
      />

      <DataTable data={allocations} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
