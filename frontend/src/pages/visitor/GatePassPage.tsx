import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { QrCode, Plus, ShieldCheck, Printer } from "lucide-react";

interface GatePassItem {
  id: string;
  pass_number: string;
  visitor_name: string;
  qr_code_payload: string;
  issue_date: string;
  expiry_date: string;
  status: string;
}

export const GatePassPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [passes, setPasses] = useState<GatePassItem[]>([
    { id: "1", pass_number: "GP-881920-1015", visitor_name: "Dr. Rajesh K. Sharma", qr_code_payload: "QR-GATEPASS-VALID-881920", issue_date: "2026-08-02 10:15 AM", expiry_date: "2026-08-02 06:15 PM", status: "Active" },
    { id: "2", pass_number: "GP-110293-0945", visitor_name: "Suresh Gupta", qr_code_payload: "QR-GATEPASS-VALID-110293", issue_date: "2026-08-02 09:45 AM", expiry_date: "2026-08-02 05:45 PM", status: "Active" },
    { id: "3", pass_number: "GP-440192-0830", visitor_name: "Amit Patel", qr_code_payload: "QR-GATEPASS-EXPIRED-440192", issue_date: "2026-08-01 08:30 AM", expiry_date: "2026-08-01 04:30 PM", status: "Expired" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/gate-passes/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setPasses(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<GatePassItem>[] = [
    { key: "pass_number", header: "Gate Pass No", sortable: true },
    { key: "visitor_name", header: "Visitor Name", sortable: true },
    { key: "issue_date", header: "Issue Time" },
    { key: "expiry_date", header: "Expiry Time" },
    {
      key: "qr_code_payload",
      header: "QR Verification Code",
      accessor: (r) => <span className="font-mono text-xs text-indigo-400 bg-slate-950 px-2 py-1 rounded">{r.qr_code_payload}</span>,
    },
    {
      key: "status",
      header: "Pass Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Active" ? "success" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Digital QR Gate Pass Generator & Register"
        subtitle="Generate digital QR code gate passes, issue duration validity, and scan at security checkpoints"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Issue Gate Pass
          </Button>
        }
      />

      <DataTable
        title="Institutional Digital QR Gate Passes"
        data={passes}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
