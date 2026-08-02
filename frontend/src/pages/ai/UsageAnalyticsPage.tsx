import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  ColumnDef,
} from "../../design-system";
import { Activity, Clock, Zap } from "lucide-react";

interface UsageItem {
  id: string;
  user_email: string;
  provider_name: string;
  prompt_type: string;
  response_time_ms: number;
  estimated_tokens: number;
  status: string;
  timestamp: string;
}

export const UsageAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<UsageItem[]>([
    { id: "1", user_email: "prof.sunil@college.edu", provider_name: "Default Academic LLM (gpt-4o-mini)", prompt_type: "Attendance Summary", response_time_ms: 135, estimated_tokens: 280, status: "Success", timestamp: "2026-08-02 10:15:00" },
    { id: "2", user_email: "student.ananya@college.edu", provider_name: "Default Academic LLM (gpt-4o-mini)", prompt_type: "Placement Recommendation", response_time_ms: 152, estimated_tokens: 340, status: "Success", timestamp: "2026-08-02 09:30:00" },
  ]);

  useEffect(() => {
    fetch("/api/ai/usage-logs/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setLogs(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<UsageItem>[] = [
    { key: "prompt_type", header: "Query Type", sortable: true },
    { key: "user_email", header: "User Account", sortable: true },
    { key: "provider_name", header: "LLM Engine" },
    { key: "response_time_ms", header: "Response Time", accessor: (r) => `${r.response_time_ms} ms` },
    { key: "estimated_tokens", header: "Tokens", accessor: (r) => `${r.estimated_tokens} tokens` },
    { key: "timestamp", header: "Execution Time" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => <StatusBadge label={r.status.toUpperCase()} variant="success" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI Token Usage & Performance Analytics"
        subtitle="Track query volume, LLM latency metrics, token consumption, and system execution status"
      />

      <DataTable
        title="Institutional AI Execution & Latency Log Ledger"
        data={logs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
