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
import { Plus, Tag } from "lucide-react";

interface CategoryItem {
  id: string;
  category_code: string;
  category_name: string;
  description: string;
  status: "active" | "inactive";
}

export const CategoryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories] = useState<CategoryItem[]>([
    { id: "1", category_code: "CAT-LAB", category_name: "Lab Equipment & Consumables", description: "Electronics, Physics, Chemistry lab supplies", status: "active" },
    { id: "2", category_code: "CAT-STAT", category_name: "Stationery & Exam Supplies", description: "Answer booklets, A4 paper, pens, folders", status: "active" },
    { id: "3", category_code: "CAT-IT", category_name: "IT & Computer Hardware", description: "Monitors, keyboards, RAM, patch cords", status: "active" },
  ]);

  const columns: ColumnDef<CategoryItem>[] = [
    { key: "category_code", header: "Code", sortable: true },
    { key: "category_name", header: "Category Name", sortable: true },
    { key: "description", header: "Description" },
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
        title="Inventory Categories"
        subtitle="Manage taxonomy, item groups & sub-category classifications"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Category
          </Button>
        }
      />

      <DataTable data={categories} columns={columns} keyExtractor={(r) => r.id} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Category
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Category Code" placeholder="e.g. CAT-FURN" required />
          <TextInput label="Category Name" placeholder="Furniture & Fixtures" required />
        </div>
      </Modal>
    </PageContainer>
  );
};
