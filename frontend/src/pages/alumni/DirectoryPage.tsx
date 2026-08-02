import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Users, Search, Filter, Mail, Globe } from "lucide-react";

interface AlumniDirectoryItem {
  id: string;
  alumni_id: string;
  student_name: string;
  department_name: string;
  graduation_year: number;
  current_status: string;
  visibility: string;
}

export const DirectoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [directory, setDirectory] = useState<AlumniDirectoryItem[]>([
    { id: "1", alumni_id: "ALU-2022-0192", student_name: "Ananya Sharma", department_name: "Computer Science", graduation_year: 2022, current_status: "Employed", visibility: "Public" },
    { id: "2", alumni_id: "ALU-2023-0401", student_name: "Vikram Malhotra", department_name: "Information Technology", graduation_year: 2023, current_status: "Entrepreneur", visibility: "Public" },
    { id: "3", alumni_id: "ALU-2021-0883", student_name: "Rohan Varma", department_name: "Electrical Engineering", graduation_year: 2021, current_status: "Higher Studies", visibility: "Members Only" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/profiles/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setDirectory(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AlumniDirectoryItem>[] = [
    { key: "alumni_id", header: "Alumni ID", sortable: true },
    { key: "student_name", header: "Full Name", sortable: true },
    { key: "department_name", header: "Department" },
    { key: "graduation_year", header: "Batch / Grad Year", sortable: true },
    {
      key: "current_status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.current_status.toUpperCase()}
          variant={r.current_status === "Employed" ? "success" : r.current_status === "Entrepreneur" ? "info" : "neutral"}
        />
      ),
    },
    { key: "visibility", header: "Directory Scope" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Global Alumni Directory Index"
        subtitle="Search and filter verified alumni by graduation batch, academic department, career status, and global location"
        actions={
          <Button variant="ghost" leftIcon={<Filter className="w-4 h-4" />}>
            Filter Directory
          </Button>
        }
      />

      <DataTable
        title="Verified Institutional Alumni Registry"
        data={directory}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
