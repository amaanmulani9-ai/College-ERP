import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Calendar, Plus, CheckCircle2, UserCheck } from "lucide-react";

interface AppointmentItem {
  id: string;
  visitor_name: string;
  visitor_mobile: string;
  host_employee_id: string;
  department_name: string;
  purpose: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
}

export const AppointmentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    { id: "1", visitor_name: "Dr. Rajesh K. Sharma", visitor_mobile: "9876543210", host_employee_id: "EMP-2023-0102", department_name: "Computer Science", purpose: "Guest Lecture & Research Meeting", scheduled_date: "2026-08-02", scheduled_time: "10:00 AM", status: "Approved" },
    { id: "2", visitor_name: "Suresh Gupta", visitor_mobile: "9811223344", host_employee_id: "EMP-2023-0440", department_name: "Administration / Procurement", purpose: "Lab Equipment Vendor Demonstration", scheduled_date: "2026-08-02", scheduled_time: "11:30 AM", status: "Approved" },
    { id: "3", visitor_name: "Meena Sundaram", visitor_mobile: "9711882233", host_employee_id: "EMP-2023-0890", department_name: "Admissions Office", purpose: "Admission Inquiry", scheduled_date: "2026-08-03", scheduled_time: "02:00 PM", status: "Pending" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/appointments/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setAppointments(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AppointmentItem>[] = [
    { key: "visitor_name", header: "Visitor Name", sortable: true },
    { key: "purpose", header: "Purpose of Visit" },
    { key: "host_employee_id", header: "Host Employee ID" },
    { key: "department_name", header: "Host Department" },
    { key: "scheduled_date", header: "Date" },
    { key: "scheduled_time", header: "Time Slot" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Approved" ? "success" : r.status === "Pending" ? "warning" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Visitor Appointments & Host Employee Approvals"
        subtitle="Manage scheduled visitor appointments, host staff/faculty approvals, and meeting time slots"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Appointment
          </Button>
        }
      />

      <DataTable
        title="Institutional Scheduled Visitor Appointments"
        data={appointments}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
