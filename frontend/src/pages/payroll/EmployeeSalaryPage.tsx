import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { UserCheck, Plus } from "lucide-react";

interface EmployeeSalaryAssignmentItem {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  salary_structure: string;
  basic_salary: number;
  effective_date: string;
  status: "active" | "suspended" | "terminated";
}

export const EmployeeSalaryPage: React.FC = () => {
  const assignments: EmployeeSalaryAssignmentItem[] = [
    {
      id: "1",
      employee_id: "EMP-1001",
      employee_name: "Dr. Rajesh Sharma",
      department: "Computer Science",
      salary_structure: "Senior Professor / Dean Pay Structure",
      basic_salary: 120000,
      effective_date: "2025-07-01",
      status: "active",
    },
    {
      id: "2",
      employee_id: "EMP-1002",
      employee_name: "Prof. Sunita Rao",
      department: "Electrical Eng",
      salary_structure: "Assistant Professor Scale",
      basic_salary: 65000,
      effective_date: "2025-08-15",
      status: "active",
    },
  ];

  const columns: ColumnDef<EmployeeSalaryAssignmentItem>[] = [
    { key: "employee_id", header: "Emp ID", sortable: true },
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "department", header: "Department" },
    { key: "salary_structure", header: "Assigned Pay Scale" },
    {
      key: "basic_salary",
      header: "Basic Pay (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.basic_salary.toLocaleString()}</span>,
    },
    { key: "effective_date", header: "Effective From" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "active" ? "success" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Employee Salary Mapping"
        subtitle="Map faculty and administrative staff to active institutional salary structures"
        actions={
          <Button variant="primary" leftIcon={<UserCheck className="w-4 h-4" />}>
            Assign Salary Structure
          </Button>
        }
      />

      <DataTable data={assignments} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
