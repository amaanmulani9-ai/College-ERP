import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, ArrowUpRight } from "lucide-react";

interface VoucherItem {
  id: string;
  voucher_number: string;
  department_name: string;
  issued_to_name: string;
  created_at: string;
}

export const IssueVoucherPage: React.FC = () => {
  const vouchers: VoucherItem[] = [
    { id: "1", voucher_number: "VOUCH-2026-881", department_name: "Computer Science", issued_to_name: "Lab Tech Suresh", created_at: "2026-07-30" },
  ];

  const columns: ColumnDef<VoucherItem>[] = [
    { key: "voucher_number", header: "Voucher #", sortable: true },
    { key: "department_name", header: "Issued To Dept", sortable: true },
    { key: "issued_to_name", header: "Recipient Staff" },
    { key: "created_at", header: "Issue Date" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Store Issue Vouchers"
        subtitle="Disburse stock consumables & lab hardware to institutional departments"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Issue Voucher
          </Button>
        }
      />

      <DataTable data={vouchers} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
