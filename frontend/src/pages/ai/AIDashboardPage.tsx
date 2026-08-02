import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  StatusBadge,
  Button,
  InlineAlert,
  ColumnDef,
} from "../../design-system";
import {
  Sparkles,
  Bot,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  ThumbsUp,
  Sliders,
  Plus,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AIActivitySummary {
  id: string;
  prompt_type: string;
  user_email: string;
  provider_name: string;
  response_time_ms: number;
  estimated_tokens: number;
  status: string;
}

export const AIDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    ai_conversations: 428,
    active_users: 184,
    knowledge_articles: 52,
    prompt_templates: 14,
    avg_response_time_ms: 142.5,
    feedback_rating: 4.8,
    recommendations_generated: 126,
    usage_today: 89,
  });

  const [recentLogs] = useState<AIActivitySummary[]>([
    { id: "1", prompt_type: "Attendance Summary", user_email: "prof.sunil@college.edu", provider_name: "Default Academic LLM (gpt-4o-mini)", response_time_ms: 135, estimated_tokens: 280, status: "Success" },
    { id: "2", prompt_type: "Placement Recommendation", user_email: "student.ananya@college.edu", provider_name: "Default Academic LLM (gpt-4o-mini)", response_time_ms: 152, estimated_tokens: 340, status: "Success" },
    { id: "3", prompt_type: "Fee Reminder Draft", user_email: "accounts_admin@college.edu", provider_name: "Default Academic LLM (gpt-4o-mini)", response_time_ms: 118, estimated_tokens: 190, status: "Success" },
  ]);

  useEffect(() => {
    fetch("/api/ai/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AIActivitySummary>[] = [
    { key: "prompt_type", header: "Query / Prompt Type", sortable: true },
    { key: "user_email", header: "User Account", sortable: true },
    { key: "provider_name", header: "LLM Provider Engine" },
    { key: "response_time_ms", header: "Latency (ms)", accessor: (r) => `${r.response_time_ms} ms` },
    { key: "estimated_tokens", header: "Tokens", accessor: (r) => `${r.estimated_tokens} tokens` },
    {
      key: "status",
      header: "Status",
      accessor: (r) => <StatusBadge label={r.status.toUpperCase()} variant="success" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Enterprise AI Academic Assistant Command Center"
        subtitle="Provider-agnostic AI assistant, prompt library, institutional knowledge RAG search, and predictive recommendations"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/ai/providers">
              <Button variant="ghost" leftIcon={<Sliders className="w-4 h-4" />}>
                LLM Settings
              </Button>
            </Link>
            <Link to="/ai/assistant">
              <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                Open AI Chat Assistant
              </Button>
            </Link>
          </div>
        }
      />

      <InlineAlert variant="info" title="AI Provider Agnostic Ready Architecture">
        Operating on Default Academic Provider (gpt-4o-mini) with {kpis.knowledge_articles} indexed knowledge articles and {kpis.prompt_templates} production prompt templates. Response latency average is {kpis.avg_response_time_ms}ms with user satisfaction rating of {kpis.feedback_rating} / 5.0.
      </InlineAlert>

      <StatList
        stats={[
          { label: "AI Conversations", value: kpis.ai_conversations },
          { label: "Active Users Today", value: kpis.active_users },
          { label: "Knowledge Base Articles", value: kpis.knowledge_articles },
          { label: "Prompt Templates", value: kpis.prompt_templates },
          { label: "Avg Response Time", value: `${kpis.avg_response_time_ms} ms` },
          { label: "User Rating", value: `${kpis.feedback_rating} / 5.0` },
        ]}
      />

      {/* AI Feature Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Link to="/ai/assistant" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-600/10 text-indigo-400"><Bot className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">AI Assistant Chat</h4>
            <p className="text-xs text-slate-400">Interactive Chat UI</p>
          </div>
        </Link>
        <Link to="/ai/prompt-library" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-600/10 text-purple-400"><Zap className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Prompt Library</h4>
            <p className="text-xs text-slate-400">{kpis.prompt_templates} Templates</p>
          </div>
        </Link>
        <Link to="/ai/knowledge-base" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400"><BookOpen className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Knowledge Base</h4>
            <p className="text-xs text-slate-400">{kpis.knowledge_articles} Articles RAG</p>
          </div>
        </Link>
        <Link to="/ai/recommendations" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-600/10 text-amber-400"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">AI Recommendations</h4>
            <p className="text-xs text-slate-400">{kpis.recommendations_generated} Predictive Recs</p>
          </div>
        </Link>
      </div>

      <DataTable
        title="Live AI Query & Execution Activity Stream"
        data={recentLogs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
