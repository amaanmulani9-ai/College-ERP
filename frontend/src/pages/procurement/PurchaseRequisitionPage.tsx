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
import { Plus, ShoppingBag } from "lucide-react";

interface RequisitionItem {
  id: string;
  requisition_number: string;
  department_name: string;
  requested_by_name: string;
  priority: "low" | "medium" | "high" | "urgent";
  required_date: string;
  status: "draft" | "pending" | "approved" | "rejected" | "converted";
}

export const PurchaseRequisitionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqs] = useState<RequisitionItem[]>([
    { id: "1", requisition_number: "REQ-2026-101", department_name: "Computer Science & Eng", requested_by_name: "Dr. Rajesh Sharma", priority: "high", required_date: "2026-08-15", status: "pending" },
    { id: "2", requisition_number: "REQ-2026-098", department_name: "Chemistry Lab", requested_by_name: "Prof. Sunita Rao", priority: "urgent", required_date: "2026-08-05", status: "approved" },
  ]);

  const columns: ColumnDef<RequisitionItem>[] = [
    { key: "requisition_number", header: "Req #", sortable: true },
    { key: "department_name", header: "Department", sortable: true },
    { key: "requested_by_name", header: "Requested By" },
    {
      key: "priority",
      header: "Priority",
      accessor: (r) => (
        <StatusBadge label={r.priority.toUpperCase()} variant={r.priority === "urgent" ? "danger" : "warning"} />
      ),
    },
    { key: "required_date", header: "Required Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge label={r.status.toUpperCase()} variant={r.status === "approved" ? "success" : "warning"} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Purchase Requisitions"
        subtitle="Departmental store material requests & budget allocation checks"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Requisition
          </Button>
        }
      />

      <DataTable data={reqs} columns={columns} keyExtractor={(r) => r.id} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Purchase Requisition"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Submit Requisition
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Requisition Number" placeholder="e.g. REQ-2026-105" required />
          <Select
            label="Priority Level"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
          <TextInput label="Required Date" type="date" required />
        </div>
      </Modal>
    </PageContainer>
  );
};
