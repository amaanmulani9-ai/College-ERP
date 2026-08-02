import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Award, Plus, Star } from "lucide-react";

interface StoryItem {
  id: string;
  alumni_id_code: string;
  title: string;
  featured: boolean;
  date: string;
}

export const SuccessStoriesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<StoryItem[]>([
    { id: "1", alumni_id_code: "ALU-2022-0192", title: "Building Large-Scale AI Infra at Google: Journey from College ERP", featured: true, date: "2026-06-15" },
    { id: "2", alumni_id_code: "ALU-2023-0401", title: "From Campus Dorm to $10M Fintech Startup: PayTech Story", featured: true, date: "2026-07-02" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/success-stories/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setStories(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<StoryItem>[] = [
    { key: "alumni_id_code", header: "Alumni ID", sortable: true },
    { key: "title", header: "Story Headline", sortable: true },
    { key: "date", header: "Publication Date" },
    {
      key: "featured",
      header: "Featured Spotlight",
      accessor: (r) => (
        <StatusBadge
          label={r.featured ? "FEATURED" : "STANDARD"}
          variant={r.featured ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Featured Alumni Success Stories & Spotlights"
        subtitle="Celebrate extraordinary alumni career milestones, entrepreneurial journeys, and institutional honors"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Publish Success Story
          </Button>
        }
      />

      <DataTable
        title="Institutional Alumni Hall of Fame & Stories"
        data={stories}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
