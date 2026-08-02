import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  Modal,
  ColumnDef,
} from "../../design-system";
import { FileText, Download, QrCode, CheckCircle } from "lucide-react";

interface PayslipItem {
  id: string;
  payslip_number: string;
  employee_name: string;
  period: string;
  gross_salary: number;
  net_salary: number;
  issue_date: string;
  qr_code_data: string;
}

export const PayslipPage: React.FC = () => {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null);

  const payslips: PayslipItem[] = [
    {
      id: "1",
      payslip_number: "PAY-2026-08-A9F21B",
      employee_name: "Dr. Rajesh Sharma",
      period: "August 2026",
      gross_salary: 125000,
      net_salary: 100300,
      issue_date: "2026-08-01",
      qr_code_data: "PAYSLIP:PAY-2026-08-A9F21B|EMP:EMP-1001|NET:₹100300",
    },
    {
      id: "2",
      payslip_number: "PAY-2026-08-C8E44D",
      employee_name: "Prof. Sunita Rao",
      period: "August 2026",
      gross_salary: 98000,
      net_salary: 80800,
      issue_date: "2026-08-01",
      qr_code_data: "PAYSLIP:PAY-2026-08-C8E44D|EMP:EMP-1002|NET:₹80800",
    },
  ];

  const columns: ColumnDef<PayslipItem>[] = [
    { key: "payslip_number", header: "Payslip #", sortable: true },
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "period", header: "Period" },
    { key: "gross_salary", header: "Gross Pay (₹)" },
    {
      key: "net_salary",
      header: "Net Disbursed (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.net_salary.toLocaleString()}</span>,
    },
    { key: "issue_date", header: "Issue Date" },
    {
      key: "id",
      header: "Action",
      accessor: (r) => (
        <Button
          size="xs"
          variant="ghost"
          leftIcon={<FileText className="w-3.5 h-3.5" />}
          onClick={() => setSelectedPayslip(r)}
        >
          View Payslip
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Employee Payslips Registry"
        subtitle="Generate, inspect & download digitally signed monthly salary slips with QR validation"
      />

      <DataTable data={payslips} columns={columns} keyExtractor={(r) => r.id} />

      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip Statement — ${selectedPayslip.payslip_number}`}
          size="md"
          footer={
            <Button
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => setSelectedPayslip(null)}
            >
              Download PDF Payslip
            </Button>
          }
        >
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedPayslip.employee_name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pay Period: {selectedPayslip.period}</p>
              </div>
              <StatusBadge label="VERIFIED PAYSLIP" variant="success" icon={<CheckCircle className="w-3.5 h-3.5" />} />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 text-sm">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Gross Salary</span>
                <span className="text-base font-semibold text-white font-mono">₹{selectedPayslip.gross_salary.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Net Salary</span>
                <span className="text-base font-bold text-emerald-400 font-mono">₹{selectedPayslip.net_salary.toLocaleString()}</span>
              </div>
            </div>

            <div className="w-28 h-28 bg-slate-900 border border-indigo-500/40 rounded-2xl mx-auto flex items-center justify-center p-2">
              <QrCode className="w-full h-full text-indigo-400" />
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
