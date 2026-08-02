import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { UserCheck, Plus, RotateCcw } from "lucide-react";

interface AllocationItem {
  id: string;
  asset_code: string;
  asset_name: string;
  allocated_to_type: string;
  employee_name?: string;
  department_name?: string;
  allocated_location: string;
  allocation_date: string;
  expected_return?: string;
  status: string;
}

export const AllocationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allocations, setAllocations] = useState<AllocationItem[]>([
    { id: "1", asset_code: "AST-CS-001", asset_name: "Dell PowerEdge Server R750", allocated_to_type: "Department", department_name: "Computer Science", allocated_location: "Server Room A", allocation_date: "2024-03-16", status: "Active" },
    { id: "2", asset_code: "AST-ADM-012", asset_name: "HP LaserJet Enterprise Printer", allocated_to_type: "Employee", employee_name: "Dr. Rajesh Sharma", allocated_location: "Admissions Room 101", allocation_date: "2024-08-02", status: "Active" },
    { id: "3", asset_code: "AST-AUD-102", asset_name: "Epson 4K Laser Projector", allocated_to_type: "Classroom", department_name: "Auditorium", allocated_location: "Main Auditorium", allocation_date: "2025-06-21", expected_return: "2026-12-31", status: "Active" },
  ]);

  useEffect(() => {
    fetch("/api/assets/allocations/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setAllocations(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AllocationItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "asset_name", header: "Asset Description", sortable: true },
    { key: "allocated_to_type", header: "Allocated To Type" },
    { key: "allocated_entity", header: "Assignee / Department", accessor: (r) => r.employee_name || r.department_name || r.allocated_to_type },
    { key: "allocated_location", header: "Assigned Location" },
    { key: "allocation_date", header: "Allocation Date" },
    { key: "expected_return", header: "Expected Return", accessor: (r) => r.expected_return || "Indefinite" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Active" ? "success" : r.status === "Returned" ? "neutral" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Allocations & Custody"
        subtitle="Track asset custody across Employees, Departments, Labs, Classrooms, and Students"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Allocation
          </Button>
        }
      />

      <DataTable
        title="Active Asset Allocations"
        data={allocations}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
