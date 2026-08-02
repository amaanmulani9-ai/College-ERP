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
import { Plus, Layers } from "lucide-react";

interface SalaryStructureItem {
  id: string;
  structure_code: string;
  structure_name: string;
  basic_salary: number;
  grade: string;
  is_active: boolean;
}

export const SalaryStructurePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [structures] = useState<SalaryStructureItem[]>([
    {
      id: "1",
      structure_code: "GRADE-A1",
      structure_name: "Senior Professor / Dean Pay Structure",
      basic_salary: 120000,
      grade: "Grade A",
      is_active: true,
    },
    {
      id: "2",
      structure_code: "GRADE-B1",
      structure_name: "Assistant Professor Scale",
      basic_salary: 65000,
      grade: "Grade B",
      is_active: true,
    },
    {
      id: "3",
      structure_code: "GRADE-C1",
      structure_name: "Administrative Staff Grade 1",
      basic_salary: 42000,
      grade: "Grade C",
      is_active: true,
    },
  ]);

  const columns: ColumnDef<SalaryStructureItem>[] = [
    { key: "structure_code", header: "Structure Code", sortable: true },
    { key: "structure_name", header: "Structure Name", sortable: true },
    { key: "grade", header: "Pay Grade" },
    {
      key: "basic_salary",
      header: "Basic Salary (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.basic_salary.toLocaleString()}</span>,
    },
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
        title="Salary Structures & Pay Grades"
        subtitle="Configure baseline basic pay tiers, grade bands & institutional compensation frameworks"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Structure
          </Button>
        }
      />

      <DataTable data={structures} columns={columns} keyExtractor={(r) => r.id} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Salary Structure"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Structure
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Structure Code" placeholder="e.g. GRADE-A2" required />
          <TextInput label="Structure Name" placeholder="e.g. Associate Professor Scale" required />
          <TextInput label="Pay Grade Band" placeholder="Grade A / Grade B" required />
          <TextInput label="Basic Salary (₹)" type="number" placeholder="50000" required />
        </div>
      </Modal>
    </PageContainer>
  );
};
