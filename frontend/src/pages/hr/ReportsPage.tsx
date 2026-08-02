import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { FileSpreadsheet, Printer } from "lucide-react";

interface HRReportSummary {
  id: string;
  department: string;
  total_staff: number;
  on_leave: number;
  promotions_this_yr: number;
  open_vacancies: number;
}

export const ReportsPage: React.FC = () => {
  const [reports] = useState<HRReportSummary[]>([
    { id: "1", department: "Computer Science", total_staff: 45, on_leave: 3, promotions_this_yr: 4, open_vacancies: 2 },
    { id: "2", department: "Electrical Eng", total_staff: 38, on_leave: 2, promotions_this_yr: 3, open_vacancies: 1 },
    { id: "3", department: "Mechanical Eng", total_staff: 32, on_leave: 1, promotions_this_yr: 2, open_vacancies: 3 },
    { id: "4", department: "Central Admin", total_staff: 50, on_leave: 4, promotions_this_yr: 5, open_vacancies: 2 },
  ]);

  const columns: ColumnDef<HRReportSummary>[] = [
    { key: "department", header: "Department", sortable: true },
    { key: "total_staff", header: "Total Staff" },
    { key: "on_leave", header: "Currently On Leave" },
    { key: "promotions_this_yr", header: "Promotions (YTD)" },
    { key: "open_vacancies", header: "Open Vacancies" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="HR Analytics & Compliance Reports"
        subtitle="Departmental headcount breakdown, attrition rates, leave utilization & accreditation compliance"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<Printer className="w-4 h-4" />}>
              Print Audit Summary
            </Button>
            <Button variant="primary" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export Headcount (CSV)
            </Button>
          </div>
        }
      />

      <DataTable data={reports} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
