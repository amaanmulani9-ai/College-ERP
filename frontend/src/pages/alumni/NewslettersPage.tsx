import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Send, Plus, Mail } from "lucide-react";

interface NewsletterItem {
  id: string;
  title: string;
  publish_date: string;
  target_audience: string;
  status: string;
}

export const NewslettersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([
    { id: "1", title: "Institutional Global Alumni Bulletin - Q3 2026", publish_date: "2026-07-01", target_audience: "All Alumni", status: "Published" },
    { id: "2", title: "US Bay Area Chapter Summer Update 2026", publish_date: "2026-07-15", target_audience: "Chapter Wise", status: "Published" },
    { id: "3", title: "Batch of 2020 5-Year Milestone Special Edition", publish_date: "2026-08-10", target_audience: "Batch Wise", status: "Draft" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/newsletters/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setNewsletters(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<NewsletterItem>[] = [
    { key: "title", header: "Newsletter Title", sortable: true },
    { key: "target_audience", header: "Target Audience" },
    { key: "publish_date", header: "Publish Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Published" ? "success" : "warning"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Newsletters & Communications Archive"
        subtitle="Compose, target, publish, and archive institutional alumni bulletins and newsletters"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Newsletter
          </Button>
        }
      />

      <DataTable
        title="Institutional Newsletter Dispatch Archive"
        data={newsletters}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
