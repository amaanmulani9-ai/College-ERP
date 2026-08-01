import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Download, FileSpreadsheet, Printer } from "lucide-react";

interface PayrollReportSummary {
  id: string;
  department: string;
  staff_count: number;
  gross_payout: number;
  total_tax: number;
  total_pf: number;
  net_disbursed: number;
}

export const ReportsPage: React.FC = () => {
  const [reports] = useState<PayrollReportSummary[]>([
    { id: "1", department: "Computer Science", staff_count: 35, gross_payout: 3850000, total_tax: 480000, total_pf: 240000, net_disbursed: 3130000 },
    { id: "2", department: "Electrical Eng", staff_count: 28, gross_payout: 2940000, total_tax: 360000, total_pf: 180000, net_disbursed: 2400000 },
    { id: "3", department: "Mechanical Eng", staff_count: 24, gross_payout: 2400000, total_tax: 280000, total_pf: 140000, net_disbursed: 1980000 },
    { id: "4", department: "Administration", staff_count: 42, gross_payout: 2100000, total_tax: 180000, total_pf: 120000, net_disbursed: 1800000 },
  ]);

  const columns: ColumnDef<PayrollReportSummary>[] = [
    { key: "department", header: "Department / Wing", sortable: true },
    { key: "staff_count", header: "Staff Count" },
    {
      key: "gross_payout",
      header: "Gross Salary (₹)",
      accessor: (r) => <span className="font-mono">₹{r.gross_payout.toLocaleString()}</span>,
    },
    {
      key: "total_tax",
      header: "TDS Tax (₹)",
      accessor: (r) => <span className="font-mono text-amber-400">₹{r.total_tax.toLocaleString()}</span>,
    },
    {
      key: "total_pf",
      header: "PF Contribution (₹)",
      accessor: (r) => <span className="font-mono text-indigo-400">₹{r.total_pf.toLocaleString()}</span>,
    },
    {
      key: "net_disbursed",
      header: "Net Disbursed (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.net_disbursed.toLocaleString()}</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Payroll & Compliance Reports"
        subtitle="Departmental salary cost audit, TDS tax returns, PF contributions & institutional financial reporting"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<Printer className="w-4 h-4" />}>
              Print Audit Summary
            </Button>
            <Button variant="primary" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export Tax Report (CSV)
            </Button>
          </div>
        }
      />

      <DataTable data={reports} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
