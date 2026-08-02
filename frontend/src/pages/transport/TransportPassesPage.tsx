import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  Modal,
  ColumnDef,
} from "../../design-system";
import { QrCode, Download, CheckCircle } from "lucide-react";

interface TransportPassItem {
  id: string;
  pass_number: string;
  student_name: string;
  route_name: string;
  issue_date: string;
  expiry_date: string;
  status: "valid" | "expired" | "revoked";
}

export const TransportPassesPage: React.FC = () => {
  const [selectedPass, setSelectedPass] = useState<TransportPassItem | null>(null);

  const passes: TransportPassItem[] = [
    {
      id: "1",
      pass_number: "TP-2026-8801",
      student_name: "Aarav Sharma",
      route_name: "R-01: City Center Express",
      issue_date: "2026-08-01",
      expiry_date: "2027-05-31",
      status: "valid",
    },
    {
      id: "2",
      pass_number: "TP-2026-8802",
      student_name: "Ananya Verma",
      route_name: "R-02: North Suburbs Shuttle",
      issue_date: "2026-08-01",
      expiry_date: "2027-05-31",
      status: "valid",
    },
  ];

  const columns: ColumnDef<TransportPassItem>[] = [
    { key: "pass_number", header: "Pass Number", sortable: true },
    { key: "student_name", header: "Student Name", sortable: true },
    { key: "route_name", header: "Route Assignment" },
    { key: "issue_date", header: "Issue Date" },
    { key: "expiry_date", header: "Expiry Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "valid" ? "success" : "danger"}
        />
      ),
    },
    {
      key: "id",
      header: "Action",
      accessor: (r) => (
        <Button
          variant="ghost"
          size="xs"
          leftIcon={<QrCode className="w-3.5 h-3.5" />}
          onClick={() => setSelectedPass(r)}
        >
          View QR Pass
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Digital Transport Passes"
        subtitle="Manage student bus passes with QR code validation and expiry dates"
      />

      <DataTable data={passes} columns={columns} keyExtractor={(r) => r.id} />

      {selectedPass && (
        <Modal
          isOpen={!!selectedPass}
          onClose={() => setSelectedPass(null)}
          title={`Digital Bus Pass — ${selectedPass.pass_number}`}
          size="sm"
          footer={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => setSelectedPass(null)}
            >
              Download Pass PDF
            </Button>
          }
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-36 h-36 bg-slate-900 border-2 border-indigo-500 rounded-3xl mx-auto flex items-center justify-center p-3">
              <QrCode className="w-full h-full text-indigo-400" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">{selectedPass.student_name}</h4>
              <p className="text-xs text-indigo-400 font-mono font-semibold mt-0.5">{selectedPass.route_name}</p>
              <p className="text-[11px] text-slate-400 mt-1">Valid Until: {selectedPass.expiry_date}</p>
            </div>
            <StatusBadge label="VERIFIED PASS" variant="success" icon={<CheckCircle className="w-3.5 h-3.5" />} />
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
