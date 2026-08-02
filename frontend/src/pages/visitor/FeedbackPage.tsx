import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Star, MessageSquare } from "lucide-react";

interface FeedbackItem {
  id: string;
  visitor_name: string;
  rating: number;
  comments: string;
}

export const FeedbackPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    { id: "1", visitor_name: "Dr. Rajesh K. Sharma", rating: 5.0, comments: "Smooth digital gate pass check-in process. Excellent security staff behavior." },
    { id: "2", visitor_name: "Suresh Gupta", rating: 4.5, comments: "Quick parking slot allocation at Visitor Slot V-12." },
  ]);

  useEffect(() => {
    fetch("/api/visitor/feedbacks/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setFeedbacks(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<FeedbackItem>[] = [
    { key: "visitor_name", header: "Visitor Name", sortable: true },
    { key: "rating", header: "Rating (Out of 5)", accessor: (r) => `⭐ ${r.rating} / 5.0` },
    { key: "comments", header: "Feedback & Comments" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Visitor Experience Feedback & Service Ratings"
        subtitle="Review visitor feedback comments, gate hospitality ratings, and security service quality"
      />

      <DataTable
        title="Institutional Visitor Feedback Registry"
        data={feedbacks}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
