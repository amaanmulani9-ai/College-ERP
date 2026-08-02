import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { UserCheck, LogOut, MapPin, Shield } from "lucide-react";

interface EntryExitItem {
  id: string;
  visitor_name: string;
  visitor_id_code: string;
  pass_number: string;
  gate: string;
  check_in: string;
  check_out: string | null;
  remarks: string;
}

export const EntryExitPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<EntryExitItem[]>([
    { id: "1", visitor_name: "Dr. Rajesh K. Sharma", visitor_id_code: "VIS-881920", pass_number: "GP-881920-1015", gate: "Main Gate A", check_in: "2026-08-02 10:15:22", check_out: null, remarks: "Allowed entry with car KA-01-MJ-9901" },
    { id: "2", visitor_name: "Suresh Gupta", visitor_id_code: "VIS-110293", pass_number: "GP-110293-0945", gate: "Main Gate A", check_in: "2026-08-02 09:45:10", check_out: null, remarks: "Vendor demonstration equipment verified" },
    { id: "3", visitor_name: "Amit Patel", visitor_id_code: "VIS-440192", pass_number: "GP-440192-0830", gate: "Service Gate C", check_in: "2026-08-02 10:30:00", check_out: "2026-08-02 10:45:12", remarks: "Courier parcel handed to security office" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/logs/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setLogs(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<EntryExitItem>[] = [
    { key: "visitor_id_code", header: "Visitor ID", sortable: true },
    { key: "visitor_name", header: "Visitor Name", sortable: true },
    { key: "pass_number", header: "Gate Pass No" },
    { key: "gate", header: "Gate Location" },
    { key: "check_in", header: "Check In Timestamp", sortable: true },
    { key: "check_out", header: "Check Out Timestamp", accessor: (r) => r.check_out || "STILL INSIDE" },
    { key: "remarks", header: "Security Remarks" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Gate Entry & Exit Activity Logs"
        subtitle="Real-time campus entrance & exit timestamps recorded by security officers across all campus gates"
        actions={
          <Button variant="primary" leftIcon={<LogOut className="w-4 h-4" />}>
            Manual Check-Out Log
          </Button>
        }
      />

      <DataTable
        title="Campus Security Entry & Exit Activity Ledger"
        data={logs}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
