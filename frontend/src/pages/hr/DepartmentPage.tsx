import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  Modal,
  TextInput,
  ColumnDef,
} from "../../design-system";
import { Plus, Building2 } from "lucide-react";

interface HRDeptItem {
  id: string;
  department_code: string;
  department_name: string;
  head_name: string;
  status: "active" | "inactive";
}

export const DepartmentPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments] = useState<HRDeptItem[]>([
    { id: "1", department_code: "DEPT-CS", department_name: "Computer Science & Engineering", head_name: "Dr. Rajesh Sharma", status: "active" },
    { id: "2", department_code: "DEPT-EE", department_name: "Electrical & Electronics Eng", head_name: "Prof. Sunita Rao", status: "active" },
    { id: "3", department_code: "DEPT-ADM", department_name: "Central Administration", head_name: "Vikram Malhotra", status: "active" },
  ]);

  const columns: ColumnDef<HRDeptItem>[] = [
    { key: "department_code", header: "Dept Code", sortable: true },
    { key: "department_name", header: "Department Name", sortable: true },
    { key: "head_name", header: "Head of Department (HOD)" },
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
        title="Institutional Departments"
        subtitle="Manage academic departments, administrative wings & designated HOD leadership"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Department
          </Button>
        }
      />

      <DataTable data={departments} columns={columns} keyExtractor={(r) => r.id} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Department"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Department
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Department Code" placeholder="e.g. DEPT-ME" required />
          <TextInput label="Department Name" placeholder="Mechanical Engineering" required />
        </div>
      </Modal>
    </PageContainer>
  );
};
