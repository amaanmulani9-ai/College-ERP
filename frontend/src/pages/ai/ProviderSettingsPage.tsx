import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Sliders, Plus, CheckCircle2 } from "lucide-react";

interface ProviderItem {
  id: string;
  name: string;
  provider_type: string;
  model_name: string;
  endpoint: string;
  enabled: boolean;
  priority: number;
}

export const ProviderSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderItem[]>([
    { id: "1", name: "Default Academic LLM", provider_type: "OpenAI", model_name: "gpt-4o-mini", endpoint: "https://api.openai.com/v1/chat/completions", enabled: true, priority: 1 },
    { id: "2", name: "Google Gemini Flash Provider", provider_type: "Gemini", model_name: "gemini-1.5-flash", endpoint: "https://generativelanguage.googleapis.com/v1beta", enabled: true, priority: 2 },
    { id: "3", name: "Local Ollama Llama 3 Server", provider_type: "Ollama", model_name: "llama3:8b", endpoint: "http://localhost:11434/api/generate", enabled: false, priority: 3 },
  ]);

  useEffect(() => {
    fetch("/api/ai/providers/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setProviders(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ProviderItem>[] = [
    { key: "priority", header: "Priority", sortable: true },
    { key: "name", header: "Provider Name", sortable: true },
    { key: "provider_type", header: "Provider Engine Type", sortable: true },
    { key: "model_name", header: "Model Name" },
    { key: "endpoint", header: "API Endpoint URL" },
    {
      key: "enabled",
      header: "Status",
      accessor: (r) => <StatusBadge label={r.enabled ? "ACTIVE" : "DISABLED"} variant={r.enabled ? "success" : "neutral"} />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="LLM Provider Settings & Pluggable Integration Registry"
        subtitle="Manage AI Provider engines (OpenAI, Gemini, Azure OpenAI, Ollama, Local LLM), endpoints, and priorities"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add AI Provider
          </Button>
        }
      />

      <DataTable
        title="Pluggable LLM Provider Registry"
        data={providers}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
