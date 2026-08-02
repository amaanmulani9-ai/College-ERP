import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  ColumnDef,
} from "../../design-system";
import { Star, MessageSquare } from "lucide-react";

interface FeedbackItem {
  id: string;
  conversation: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const FeedbackPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    { id: "1", conversation: "Attendance Summary Chat", rating: 5.0, comment: "Accurate attendance breakdown for B.Tech CSE Semester 6.", created_at: "2026-08-02 10:20" },
    { id: "2", conversation: "Placement Match Query", rating: 4.8, comment: "Helpful placement match recommendations.", created_at: "2026-08-02 09:45" },
  ]);

  useEffect(() => {
    fetch("/api/ai/feedbacks/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setFeedbacks(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<FeedbackItem>[] = [
    { key: "conversation", header: "Chat Session", sortable: true },
    { key: "rating", header: "Rating (Out of 5)", accessor: (r) => `⭐ ${r.rating} / 5.0` },
    { key: "comment", header: "User Feedback Comment" },
    { key: "created_at", header: "Timestamp" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI Assistant Feedback & Quality Satisfaction Ratings"
        subtitle="Review user satisfaction ratings, response quality feedback, and accuracy comments"
      />

      <DataTable
        title="Institutional AI Response Feedback Directory"
        data={feedbacks}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
