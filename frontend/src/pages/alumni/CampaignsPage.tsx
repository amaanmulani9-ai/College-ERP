import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Target, Plus, TrendingUp } from "lucide-react";

interface CampaignItem {
  id: string;
  campaign_name: string;
  goal_amount: number;
  collected_amount: number;
  start_date: string;
  end_date: string;
  status: string;
}

export const CampaignsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([
    { id: "1", campaign_name: "AI & Supercomputing Innovation Lab Fund", goal_amount: 5000000, collected_amount: 3200000, start_date: "2026-01-01", end_date: "2026-12-31", status: "Active" },
    { id: "2", campaign_name: "Merit-cum-Means Student Scholarship Endowment", goal_amount: 2500000, collected_amount: 1850000, start_date: "2026-03-01", end_date: "2026-11-30", status: "Active" },
    { id: "3", campaign_name: "Campus Library Digital Expansion", goal_amount: 1000000, collected_amount: 1000000, start_date: "2025-06-01", end_date: "2026-05-31", status: "Completed" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/campaigns/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setCampaigns(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<CampaignItem>[] = [
    { key: "campaign_name", header: "Campaign Name", sortable: true },
    { key: "goal_amount", header: "Goal (₹)", accessor: (r) => `₹${(r.goal_amount / 100000).toFixed(2)} L` },
    { key: "collected_amount", header: "Collected (₹)", accessor: (r) => `₹${(r.collected_amount / 100000).toFixed(2)} L` },
    {
      key: "progress",
      header: "Progress Rate",
      accessor: (r) => {
        const pct = Math.min(100, Math.round((r.collected_amount / r.goal_amount) * 100));
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono text-indigo-400">{pct}%</span>
          </div>
        );
      },
    },
    { key: "end_date", header: "Target Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Active" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Institutional Fundraising Campaigns"
        subtitle="Manage capital fundraising campaigns, endowment goals, collected contributions, and completion rates"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Campaign
          </Button>
        }
      />

      <DataTable
        title="Active Capital Campaign Portfolio"
        data={campaigns}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
