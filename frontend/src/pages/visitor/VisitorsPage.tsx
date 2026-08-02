import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Users, Plus, ShieldCheck, FileText } from "lucide-react";

interface VisitorItem {
  id: string;
  visitor_id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  company: string;
  govt_id_type: string;
  govt_id_number: string;
}

export const VisitorsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<VisitorItem[]>([
    { id: "1", visitor_id: "VIS-881920", first_name: "Dr. Rajesh K.", last_name: "Sharma", mobile: "9876543210", email: "rajesh.sharma@research.org", company: "National Science Foundation", govt_id_type: "Aadhaar", govt_id_number: "XXXX-XXXX-8891" },
    { id: "2", visitor_id: "VIS-440192", first_name: "Amit", last_name: "Patel", mobile: "9988776655", email: "amit.patel@courier.com", company: "Amazon Logistics", govt_id_type: "Driving License", govt_id_number: "DL-2024-9901" },
    { id: "3", visitor_id: "VIS-110293", first_name: "Suresh", last_name: "Gupta", mobile: "9811223344", email: "suresh@labequipments.com", company: "ThermoFisher Scientific", govt_id_type: "PAN", govt_id_number: "ABCDE1234F" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/visitors/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setVisitors(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<VisitorItem>[] = [
    { key: "visitor_id", header: "Visitor ID", sortable: true },
    { key: "first_name", header: "First Name", sortable: true },
    { key: "last_name", header: "Last Name", sortable: true },
    { key: "mobile", header: "Mobile Contact" },
    { key: "company", header: "Company / Organization" },
    { key: "govt_id_type", header: "Govt ID Type" },
    { key: "govt_id_number", header: "Govt ID Number" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Visitor Registration Directory"
        subtitle="Manage campus visitor profiles, contact information, company details, and Government ID verification"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register Visitor
          </Button>
        }
      />

      <DataTable
        title="Institutional Campus Visitor Profiles"
        data={visitors}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
