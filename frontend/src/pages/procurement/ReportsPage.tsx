import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { FileSpreadsheet, Printer } from "lucide-react";

interface ProcurementReportSummary {
  id: string;
  department_name: string;
  requisitions_count: number;
  total_spend: number;
  open_pos: number;
  completed_pos: number;
}

export const ReportsPage: React.FC = () => {
  const [reports] = useState<ProcurementReportSummary[]>([
    { id: "1", department_name: "Computer Science & Eng", requisitions_count: 12, total_spend: 1850000, open_pos: 2, completed_pos: 10 },
    { id: "2", department_name: "Chemistry Lab", requisitions_count: 8, total_spend: 920000, open_pos: 1, completed_pos: 7 },
  ]);

  const columns: ColumnDef<ProcurementReportSummary>[] = [
    { key: "department_name", header: "Department", sortable: true },
    { key: "requisitions_count", header: "Total Requisitions" },
    {
      key: "total_spend",
      header: "Total Spend (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.total_spend.toLocaleString()}</span>,
    },
    { key: "open_pos", header: "Active POs" },
    { key: "completed_pos", header: "Fulfilled POs" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Procurement Spend & Supplier Analytics"
        subtitle="Departmental procurement spend breakdown, PO fulfillment & vendor rating reports"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<Printer className="w-4 h-4" />}>
              Print Procurement Audit
            </Button>
            <Button variant="primary" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export Spend Report (CSV)
            </Button>
          </div>
        }
      />

      <DataTable data={reports} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
