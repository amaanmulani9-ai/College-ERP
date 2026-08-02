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
  Laptop,
  ShieldAlert,
  Wrench,
  QrCode,
  DollarSign,
  TrendingDown,
  Building2,
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AssetItem {
  id: string;
  asset_code: string;
  asset_name: string;
  category_name: string;
  department_name: string;
  location: string;
  purchase_cost: number;
  current_value: number;
  status: "Available" | "Allocated" | "Maintenance" | "Disposed" | "Lost";
}

export const AssetsDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total_assets: 340,
    total_asset_value: 48500000,
    allocated_assets: 260,
    maintenance_due: 8,
    warranty_expiring: 14,
    assets_under_repair: 5,
    disposed_assets: 12,
    department_utilization: [],
  });

  const [recentAssets] = useState<AssetItem[]>([
    { id: "1", asset_code: "AST-CS-001", asset_name: "Dell PowerEdge Server R750", category_name: "Networking & Servers", department_name: "Computer Science", location: "Server Room Block A", purchase_cost: 450000, current_value: 380000, status: "Allocated" },
    { id: "2", asset_code: "AST-ME-045", asset_name: "CNC Milling Machine 3-Axis", category_name: "Laboratory Equipment", department_name: "Mechanical Engineering", location: "Lab 102 Mechanical Block", purchase_cost: 1200000, current_value: 950000, status: "Maintenance" },
    { id: "3", asset_code: "AST-AUD-102", asset_name: "Epson 4K Laser Projector 6000L", category_name: "Projectors & Displays", department_name: "Auditorium", location: "Main Auditorium", purchase_cost: 180000, current_value: 140000, status: "Available" },
  ]);

  useEffect(() => {
    fetch("/api/assets/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AssetItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "asset_name", header: "Asset Description", sortable: true },
    { key: "category_name", header: "Category" },
    { key: "department_name", header: "Department" },
    { key: "location", header: "Location" },
    { key: "purchase_cost", header: "Cost (₹)", accessor: (r) => `₹${r.purchase_cost.toLocaleString()}` },
    { key: "current_value", header: "Book Value (₹)", accessor: (r) => `₹${r.current_value.toLocaleString()}` },
    {
      key: "status",
      header: "Lifecycle Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "Available"
              ? "success"
              : r.status === "Allocated"
              ? "info"
              : r.status === "Maintenance"
              ? "warning"
              : "danger"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Enterprise Asset Management"
        subtitle="Institutional fixed asset tracking across Procurement, Allocation, Maintenance, Transfer, Audit & Disposal"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/assets/qr-labels">
              <Button variant="ghost" leftIcon={<QrCode className="w-4 h-4" />}>
                Print QR Labels
              </Button>
            </Link>
            <Link to="/assets/items">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Register New Asset
              </Button>
            </Link>
          </div>
        }
      />

      {kpis.warranty_expiring > 0 && (
        <InlineAlert variant="warning" title="Warranty Expiry Alert">
          {kpis.warranty_expiring} institutional assets have warranties expiring within the next 30 days. Action required for AMC renewal.
        </InlineAlert>
      )}

      <StatList
        stats={[
          { label: "Total Assets", value: kpis.total_assets },
          { label: "Total Asset Value", value: `₹${(kpis.total_asset_value / 100000).toFixed(2)} Lakhs` },
          { label: "Allocated Assets", value: kpis.allocated_assets },
          { label: "Maintenance Due", value: kpis.maintenance_due, isPositive: kpis.maintenance_due === 0 },
          { label: "Under Repair", value: kpis.assets_under_repair },
          { label: "Warranties Expiring", value: kpis.warranty_expiring },
        ]}
      />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Link to="/assets/allocations" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-600/10 text-indigo-400"><Laptop className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Allocations</h4>
            <p className="text-xs text-slate-400">Issue to staff & labs</p>
          </div>
        </Link>
        <Link to="/assets/maintenance" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-600/10 text-amber-400"><Wrench className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Maintenance</h4>
            <p className="text-xs text-slate-400">Services & AMC logs</p>
          </div>
        </Link>
        <Link to="/assets/depreciation" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400"><TrendingDown className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Depreciation</h4>
            <p className="text-xs text-slate-400">SLM & WDV ledger</p>
          </div>
        </Link>
        <Link to="/assets/audits" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-600/10 text-purple-400"><ShieldAlert className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Asset Audits</h4>
            <p className="text-xs text-slate-400">Physical verification</p>
          </div>
        </Link>
      </div>

      <DataTable
        title="Institutional Fixed Asset Register"
        data={recentAssets}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
