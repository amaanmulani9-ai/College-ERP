import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, RotateCcw } from "lucide-react";

interface ReturnItem {
  id: string;
  return_number: string;
  department_name: string;
  condition: string;
  reason: string;
  created_at: string;
}

export const ReturnVoucherPage: React.FC = () => {
  const returns: ReturnItem[] = [
    { id: "1", return_number: "RET-2026-091", department_name: "Computer Science", condition: "good", reason: "Excess lab components returned to central store", created_at: "2026-07-29" },
  ];

  const columns: ColumnDef<ReturnItem>[] = [
    { key: "return_number", header: "Return #", sortable: true },
    { key: "department_name", header: "Returned From Dept", sortable: true },
    {
      key: "condition",
      header: "Item Condition",
      accessor: (r) => (
        <StatusBadge label={r.condition.toUpperCase()} variant={r.condition === "good" ? "success" : "warning"} />
      ),
    },
    { key: "reason", header: "Reason" },
    { key: "created_at", header: "Return Date" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Store Return Vouchers"
        subtitle="Process unused, excess or defective item returns back into warehouse stock"
        actions={
          <Button variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />}>
            Create Return Voucher
          </Button>
        }
      />

      <DataTable data={returns} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
