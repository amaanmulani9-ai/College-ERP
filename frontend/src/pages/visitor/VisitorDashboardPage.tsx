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
  UserCheck,
  Shield,
  QrCode,
  Truck,
  AlertTriangle,
  Users,
  Car,
  Calendar,
  Plus,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ActivityLogSummary {
  id: string;
  visitor_name: string;
  visitor_id_code: string;
  gate: string;
  check_in: string;
  check_out: string | null;
  status: string;
}

export const VisitorDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    todays_visitors: 142,
    visitors_inside_campus: 38,
    pending_appointments: 15,
    active_gate_passes: 45,
    active_deliveries: 12,
    active_contractors: 8,
    emergency_visits: 2,
    blocked_visitors: 4,
  });

  const [recentLogs] = useState<ActivityLogSummary[]>([
    { id: "1", visitor_name: "Dr. Rajesh K. Sharma", visitor_id_code: "VIS-881920", gate: "Main Gate A", check_in: "10:15 AM", check_out: null, status: "INSIDE CAMPUS" },
    { id: "2", visitor_name: "Amit Patel (Amazon Courier)", visitor_id_code: "VIS-440192", gate: "Service Gate C", check_in: "10:30 AM", check_out: "10:45 AM", status: "CHECKED OUT" },
    { id: "3", visitor_name: "Suresh Gupta (Vendor Visit)", visitor_id_code: "VIS-110293", gate: "Main Gate A", check_in: "09:45 AM", check_out: null, status: "INSIDE CAMPUS" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleBulkCheckout = () => {
    fetch("/api/visitor/logs/bulk_checkout/", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Bulk checkout completed.");
      })
      .catch((err) => console.error(err));
  };

  const columns: ColumnDef<ActivityLogSummary>[] = [
    { key: "visitor_id_code", header: "Visitor ID", sortable: true },
    { key: "visitor_name", header: "Visitor Name", sortable: true },
    { key: "gate", header: "Gate Location" },
    { key: "check_in", header: "Check In Time" },
    { key: "check_out", header: "Check Out Time", accessor: (r) => r.check_out || "Still Inside" },
    {
      key: "status",
      header: "Campus Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status}
          variant={r.status === "INSIDE CAMPUS" ? "warning" : "success"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Security & Visitor Management Command Center"
        subtitle="Visitor check-in/out, digital QR gate passes, host appointments, vehicle tracking & security logs"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<LogOut className="w-4 h-4" />} onClick={handleBulkCheckout}>
              Bulk Check-Out
            </Button>
            <Link to="/visitor/visitors">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Register Visitor
              </Button>
            </Link>
          </div>
        }
      />

      <InlineAlert variant="warning" title="Live Security & Gate Operations">
        Currently {kpis.visitors_inside_campus} visitors inside campus grounds across {kpis.todays_visitors} visits today. {kpis.pending_appointments} visitor appointments pending host employee approval.
      </InlineAlert>

      <StatList
        stats={[
          { label: "Today's Visitors", value: kpis.todays_visitors },
          { label: "Visitors Inside Campus", value: kpis.visitors_inside_campus },
          { label: "Pending Appointments", value: kpis.pending_appointments },
          { label: "Active Gate Passes", value: kpis.active_gate_passes },
          { label: "Active Deliveries", value: kpis.active_deliveries },
          { label: "Maintenance Contractors", value: kpis.active_contractors },
        ]}
      />

      {/* Quick Security Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Link to="/visitor/gate-pass" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-600/10 text-indigo-400"><QrCode className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">QR Gate Passes</h4>
            <p className="text-xs text-slate-400">Digital Access Passes</p>
          </div>
        </Link>
        <Link to="/visitor/entry-exit" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-600/10 text-amber-400"><UserCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Entry / Exit Logs</h4>
            <p className="text-xs text-slate-400">Gate Timestamps</p>
          </div>
        </Link>
        <Link to="/visitor/deliveries" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400"><Truck className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Courier Deliveries</h4>
            <p className="text-xs text-slate-400">Parcel Inward Register</p>
          </div>
        </Link>
        <Link to="/visitor/blacklist" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-rose-600/10 text-rose-400"><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Security Blacklist</h4>
            <p className="text-xs text-slate-400">Blocked Access List ({kpis.blocked_visitors})</p>
          </div>
        </Link>
      </div>

      <DataTable
        title="Live Campus Entry & Exit Gate Activity Feed"
        data={recentLogs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
