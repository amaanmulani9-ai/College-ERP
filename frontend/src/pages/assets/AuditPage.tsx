import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { ShieldCheck, Plus, AlertCircle } from "lucide-react";

interface AuditItem {
  id: string;
  audit_date: string;
  department_name: string;
  auditor_email: string;
  result: "Passed" | "Discrepancy" | "Failed";
  missing_assets: string[];
  remarks: string;
  status: string;
}

export const AuditPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState<AuditItem[]>([
    { id: "1", audit_date: "2026-07-20", department_name: "Computer Science", auditor_email: "auditor@college.edu", result: "Passed", missing_assets: [], remarks: "All 120 CS Lab assets physically verified and matched.", status: "Completed" },
    { id: "2", audit_date: "2026-07-25", department_name: "Mechanical Engineering", auditor_email: "auditor@college.edu", result: "Discrepancy", missing_assets: ["AST-ME-099"], remarks: "1 lathe tool kit missing during audit.", status: "Completed" },
  ]);

  useEffect(() => {
    fetch("/api/assets/audits/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setAudits(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AuditItem>[] = [
    { key: "audit_date", header: "Audit Date", sortable: true },
    { key: "department_name", header: "Audited Department" },
    { key: "auditor_email", header: "Auditor" },
    {
      key: "result",
      header: "Audit Result",
      accessor: (r) => (
        <StatusBadge
          label={r.result.toUpperCase()}
          variant={r.result === "Passed" ? "success" : r.result === "Discrepancy" ? "warning" : "danger"}
        />
      ),
    },
    { key: "missing_assets", header: "Flagged Missing Assets", accessor: (r) => r.missing_assets.length > 0 ? r.missing_assets.join(", ") : "None" },
    { key: "remarks", header: "Auditor Remarks" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Physical Asset Verification Audits"
        subtitle="Departmental physical inventory audits, discrepancy flagging, and auditor sign-off"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Conduct Department Audit
          </Button>
        }
      />

      <DataTable
        title="Physical Asset Audit Logs"
        data={audits}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
