import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface ConversationItem {
  id: string;
  session_title: string;
  user_email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const ConversationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([
    { id: "1", session_title: "Attendance Summary Inquiry", user_email: "prof.sunil@college.edu", role: "Faculty", created_at: "2026-08-02 10:15", updated_at: "2026-08-02 10:20" },
    { id: "2", session_title: "Placement Preparation Matching", user_email: "student.ananya@college.edu", role: "Student", created_at: "2026-08-02 09:30", updated_at: "2026-08-02 09:42" },
  ]);

  useEffect(() => {
    fetch("/api/ai/conversations/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setConversations(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ConversationItem>[] = [
    { key: "session_title", header: "Chat Session Title", sortable: true },
    { key: "user_email", header: "User Account", sortable: true },
    { key: "role", header: "User Role" },
    { key: "created_at", header: "Started At" },
    { key: "updated_at", header: "Last Active" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI Conversation History Directory"
        subtitle="Manage chat session logs across Students, Faculty, Parents, and Administrators"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Chat Session
          </Button>
        }
      />

      <DataTable
        title="Institutional AI Conversation Sessions"
        data={conversations}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
