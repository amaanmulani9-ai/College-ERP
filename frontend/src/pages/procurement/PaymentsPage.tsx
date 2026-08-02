import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, CreditCard } from "lucide-react";

interface PaymentItem {
  id: string;
  invoice_number: string;
  payment_date: string;
  payment_method: string;
  reference_number: string;
  amount: number;
  status: string;
}

export const PaymentsPage: React.FC = () => {
  const payments: PaymentItem[] = [
    { id: "1", invoice_number: "INV-2026-680", payment_date: "2026-07-28", payment_method: "NEFT / Bank Transfer", reference_number: "NEFT998877665", amount: 18500, status: "completed" },
  ];

  const columns: ColumnDef<PaymentItem>[] = [
    { key: "invoice_number", header: "Invoice Ref #", sortable: true },
    { key: "payment_date", header: "Payment Date" },
    { key: "payment_method", header: "Method" },
    { key: "reference_number", header: "Ref Txn #" },
    {
      key: "amount",
      header: "Amount Paid (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.amount.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (r) => <StatusBadge label={r.status.toUpperCase()} variant="success" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Vendor Payment Disbursement"
        subtitle="Track NEFT, RTGS & cheque disbursements to suppliers"
        actions={
          <Button variant="primary" leftIcon={<CreditCard className="w-4 h-4" />}>
            Disburse Vendor Payment
          </Button>
        }
      />

      <DataTable data={payments} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
