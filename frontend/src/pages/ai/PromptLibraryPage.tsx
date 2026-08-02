import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Zap, Plus, Copy, FileText } from "lucide-react";

interface PromptTemplateItem {
  id: string;
  template_name: string;
  category: string;
  user_prompt_template: string;
  enabled: boolean;
}

export const PromptLibraryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<PromptTemplateItem[]>([
    { id: "1", template_name: "Attendance Summary Prompt", category: "Attendance Summary", user_prompt_template: "Summarize attendance records for department {dept_code} and semester {sem_no}.", enabled: true },
    { id: "2", template_name: "Student Performance Analyzer", category: "Student Performance Analysis", user_prompt_template: "Analyze mid-term grades for student {student_id} and highlight risk subjects.", enabled: true },
    { id: "3", template_name: "Academic Fee Reminder Notice", category: "Fee Reminder Draft", user_prompt_template: "Draft a formal academic fee reminder email for balance amount {amount}.", enabled: true },
    { id: "4", template_name: "Placement Recommendation Matcher", category: "Placement Recommendation", user_prompt_template: "Match student skill profile {skills} against active campus drives.", enabled: true },
  ]);

  useEffect(() => {
    fetch("/api/ai/prompt-templates/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setTemplates(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<PromptTemplateItem>[] = [
    { key: "template_name", header: "Template Name", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "user_prompt_template", header: "Prompt Template Text" },
    {
      key: "enabled",
      header: "Status",
      accessor: (r) => <StatusBadge label={r.enabled ? "ACTIVE" : "DISABLED"} variant={r.enabled ? "success" : "neutral"} />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Institutional AI Prompt Template Library"
        subtitle="Manage standardized prompt templates for attendance summaries, exam analysis, fee reminders, and notices"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Prompt Template
          </Button>
        }
      />

      <DataTable
        title="Institutional Prompt Template Registry"
        data={templates}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
