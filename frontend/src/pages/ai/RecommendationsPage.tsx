import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { TrendingUp, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  details: string;
  score: string;
}

export const RecommendationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<RecommendationItem[]>([
    { id: "1", title: "B.Tech CSE Sem 6 Academic At-Risk Warning", category: "Student Risk", details: "12 students with low attendance in Data Structures at risk of backlog.", score: "89.50" },
    { id: "2", title: "Automated Low Attendance SMS Alert", category: "Attendance Warning", details: "15 students identified with attendance under 75% for current month.", score: "94.00" },
    { id: "3", title: "High-Demand AI Skill Recommendations", category: "Placement Suggestion", details: "Recommend Python & PyTorch workshop for upcoming Google recruitment drive.", score: "96.20" },
  ]);

  useEffect(() => {
    fetch("/api/ai/recommendations/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setRecs(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = () => {
    fetch("/api/ai/recommendations/generate/", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRecs(data);
      })
      .catch((err) => console.error(err));
  };

  const columns: ColumnDef<RecommendationItem>[] = [
    { key: "title", header: "Recommendation Title", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "details", header: "AI Predictive Analysis & Insights" },
    {
      key: "score",
      header: "Confidence Score",
      accessor: (r) => <StatusBadge label={`${r.score}% MATCH`} variant="info" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI Predictive Academic & Placement Recommendations"
        subtitle="AI-driven early warnings for student risk, attendance alerts, fee defaulters, and placement skill matches"
        actions={
          <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />} onClick={handleGenerate}>
            Generate AI Insights
          </Button>
        }
      />

      <DataTable
        title="Institutional AI Recommendation Matrix"
        data={recs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
