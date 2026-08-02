import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Settings, Plus, Save } from "lucide-react";

interface ConfigItem {
  id: string;
  config_key: string;
  config_value: string;
  description: string;
}

export const ConfigurationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<ConfigItem[]>([
    { id: "1", config_key: "MAX_CHAT_TOKENS", config_value: "4096", description: "Maximum token limit per chat response generation." },
    { id: "2", config_key: "TEMPERATURE", config_value: "0.4", description: "Sampling temperature for academic precision (0.0 to 1.0)." },
    { id: "3", config_key: "RAG_KNOWLEDGE_TOP_K", config_value: "5", description: "Top K documents retrieved for knowledge RAG context." },
  ]);

  useEffect(() => {
    fetch("/api/ai/configurations/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setConfigs(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ConfigItem>[] = [
    { key: "config_key", header: "Parameter Key", sortable: true },
    { key: "config_value", header: "Config Value" },
    { key: "description", header: "Parameter Description" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI System Configuration Parameters"
        subtitle="Configure global AI assistant behavior, temperature sampling, max token boundaries, and RAG search limits"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Setting
          </Button>
        }
      />

      <DataTable
        title="AI System Parameter Configuration Registry"
        data={configs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
