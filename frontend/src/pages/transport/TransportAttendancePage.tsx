import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { CheckCircle, Clock } from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  student_name: string;
  pass_number: string;
  route_name: string;
  trip_type: "Morning Pickup" | "Evening Drop";
  status: "boarded" | "dropped" | "absent";
}

export const TransportAttendancePage: React.FC = () => {
  const records: AttendanceRecord[] = [
    {
      id: "1",
      date: "2026-08-01",
      student_name: "Aarav Sharma",
      pass_number: "TP-2026-8801",
      route_name: "R-01 City Express",
      trip_type: "Morning Pickup",
      status: "boarded",
    },
    {
      id: "2",
      date: "2026-08-01",
      student_name: "Ananya Verma",
      pass_number: "TP-2026-8802",
      route_name: "R-02 North Suburbs",
      trip_type: "Morning Pickup",
      status: "boarded",
    },
  ];

  const columns: ColumnDef<AttendanceRecord>[] = [
    { key: "date", header: "Date", sortable: true },
    { key: "pass_number", header: "Pass Number" },
    { key: "student_name", header: "Student Name", sortable: true },
    { key: "route_name", header: "Route" },
    { key: "trip_type", header: "Trip Session" },
    {
      key: "status",
      header: "Boarding Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "boarded" ? "success" : r.status === "dropped" ? "info" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Bus Attendance Register"
        subtitle="Track student morning pickup & evening drop boarding records via pass scans"
        actions={
          <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />}>
            Mark Boarding Attendance
          </Button>
        }
      />

      <DataTable data={records} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
