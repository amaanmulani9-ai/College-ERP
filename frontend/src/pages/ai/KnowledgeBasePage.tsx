import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { BookOpen, Plus, Search, FileText } from "lucide-react";

interface KnowledgeDocItem {
  id: string;
  title: string;
  knowledge_base_name: string;
  knowledge_base_category: string;
  version: string;
  status: string;
}

export const KnowledgeBasePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<KnowledgeDocItem[]>([
    { id: "1", title: "Institutional Academic Regulations 2026", knowledge_base_name: "Academic Policies", knowledge_base_category: "Academic", version: "v2.4", status: "Published" },
    { id: "2", title: "Hostel Allotment & Code of Conduct", knowledge_base_name: "Hostel Rules", knowledge_base_category: "Hostel", version: "v1.8", status: "Published" },
    { id: "3", title: "Library Digital Catalog Borrowing Policy", knowledge_base_name: "Library Guidelines", knowledge_base_category: "Library", version: "v1.2", status: "Published" },
  ]);

  useEffect(() => {
    fetch("/api/ai/knowledge-documents/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setDocs(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<KnowledgeDocItem>[] = [
    { key: "title", header: "Document Title", sortable: true },
    { key: "knowledge_base_name", header: "Knowledge Base" },
    { key: "knowledge_base_category", header: "Category", sortable: true },
    { key: "version", header: "Version" },
    {
      key: "status",
      header: "Indexing Status",
      accessor: (r) => <StatusBadge label={r.status.toUpperCase()} variant="success" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Institutional Knowledge Base RAG Repository"
        subtitle="Manage indexed academic & administrative documents for AI RAG search and context retrieval"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Upload Document
          </Button>
        }
      />

      <DataTable
        title="Indexed Knowledge Base Documents"
        data={docs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
