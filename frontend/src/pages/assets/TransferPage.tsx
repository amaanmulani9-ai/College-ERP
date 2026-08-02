import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { ArrowRightLeft, Plus } from "lucide-react";

interface TransferItem {
  id: string;
  asset_code: string;
  asset_name: string;
  from_department_name: string;
  to_department_name: string;
  transfer_date: string;
  reason: string;
  status: string;
}

export const TransferPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<TransferItem[]>([
    { id: "1", asset_code: "AST-PROJ-04", asset_name: "BenQ Short Throw Projector", from_department_name: "Electrical Engineering", to_department_name: "Computer Science", transfer_date: "2026-07-15", reason: "Lab reallocation for new batch", status: "Approved" },
    { id: "2", asset_code: "AST-PRN-09", asset_name: "Canon Digital Copier 500", from_department_name: "Library", to_department_name: "Examinations Cell", transfer_date: "2026-07-28", reason: "Exam hall printing requirement", status: "Pending" },
  ]);

  useEffect(() => {
    fetch("/api/assets/transfers/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setTransfers(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<TransferItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "asset_name", header: "Asset Description", sortable: true },
    { key: "from_department_name", header: "From Department" },
    { key: "to_department_name", header: "To Department" },
    { key: "transfer_date", header: "Transfer Date" },
    { key: "reason", header: "Transfer Reason" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Approved" || r.status === "Completed" ? "success" : r.status === "Pending" ? "warning" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inter-Departmental Asset Transfers"
        subtitle="Manage asset transfers between departments with approval tracking"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Initiate Transfer
          </Button>
        }
      />

      <DataTable
        title="Asset Transfer Requests & History"
        data={transfers}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
