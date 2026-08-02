import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { AlertTriangle, Plus, ShieldOff } from "lucide-react";

interface BlacklistItem {
  id: string;
  visitor_name: string;
  reason: string;
  blocked_date: string;
}

export const BlacklistPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [blacklists, setBlacklists] = useState<BlacklistItem[]>([
    { id: "1", visitor_name: "Karan Johar", reason: "Unauthorized intrusion attempt at Restricted Server Room on 2026-05-10.", blocked_date: "2026-05-10" },
    { id: "2", visitor_name: "Manish Sharma", reason: "Disruptive conduct and verbal altercation with gate security staff.", blocked_date: "2026-06-02" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/blacklist/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setBlacklists(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<BlacklistItem>[] = [
    { key: "visitor_name", header: "Blacklisted Visitor", sortable: true },
    { key: "reason", header: "Reason for Blockade" },
    { key: "blocked_date", header: "Blockade Date" },
    {
      key: "status",
      header: "Campus Access",
      accessor: () => <StatusBadge label="ACCESS DENIED" variant="danger" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Security Visitor Blacklist Directory"
        subtitle="Manage security blacklist records, security alerts, and blocked visitor entry restrictions"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Blacklist Visitor
          </Button>
        }
      />

      <DataTable
        title="Blacklisted Visitor Entry Blockade Ledger"
        data={blacklists}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
