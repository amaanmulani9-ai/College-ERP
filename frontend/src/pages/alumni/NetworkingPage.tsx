import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Globe, Plus, MessageSquare, UserCheck } from "lucide-react";

interface NetworkingItem {
  id: string;
  requester_id_code: string;
  receiver_id_code: string;
  status: string;
  message: string;
}

export const NetworkingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<NetworkingItem[]>([
    { id: "1", requester_id_code: "ALU-2023-0401", receiver_id_code: "ALU-2022-0192", status: "Accepted", message: "Hi Ananya! Would love to connect regarding AI infrastructure scaling." },
    { id: "2", requester_id_code: "ALU-2021-0883", receiver_id_code: "ALU-2023-0401", status: "Pending", message: "Hello Vikram, interested in learning more about PayTech startup journey." },
  ]);

  useEffect(() => {
    fetch("/api/alumni/networking-requests/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setRequests(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<NetworkingItem>[] = [
    { key: "requester_id_code", header: "Requester Alumni", sortable: true },
    { key: "receiver_id_code", header: "Receiver Alumni", sortable: true },
    { key: "message", header: "Connection Message" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Accepted" ? "success" : "warning"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Peer Alumni Networking & Connections"
        subtitle="Manage peer-to-peer connection requests, professional outreach messages, and networking logs"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Send Connection Request
          </Button>
        }
      />

      <DataTable
        title="Institutional Alumni Connection Directory"
        data={requests}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
