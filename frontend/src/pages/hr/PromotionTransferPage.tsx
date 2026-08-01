import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, ArrowUpRight, Repeat } from "lucide-react";

interface MovementRecord {
  id: string;
  type: "Promotion" | "Transfer";
  employee_name: string;
  from_label: string;
  to_label: string;
  effective_date: string;
  reason: string;
}

export const PromotionTransferPage: React.FC = () => {
  const records: MovementRecord[] = [
    { id: "1", type: "Promotion", employee_name: "Dr. Rajesh Sharma", from_label: "Associate Professor", to_label: "Professor & HOD", effective_date: "2026-07-01", reason: "Annual Academic Promotion" },
    { id: "2", type: "Transfer", employee_name: "Vikram Malhotra", from_label: "Admissions Office", to_label: "Central HR & Admin", effective_date: "2026-07-15", reason: "Organizational Realignment" },
  ];

  const columns: ColumnDef<MovementRecord>[] = [
    { key: "type", header: "Movement Type", sortable: true },
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "from_label", header: "Original Role / Dept" },
    { key: "to_label", header: "New Role / Dept" },
    { key: "effective_date", header: "Effective Date" },
    { key: "reason", header: "Reason / Order #" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Promotions & Department Transfers"
        subtitle="Manage faculty career progressions, designation promotions & inter-departmental transfers"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<Repeat className="w-4 h-4" />}>
              Process Transfer
            </Button>
            <Button variant="primary" leftIcon={<ArrowUpRight className="w-4 h-4" />}>
              Process Promotion
            </Button>
          </div>
        }
      />

      <DataTable data={records} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
