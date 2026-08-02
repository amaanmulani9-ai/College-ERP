import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Calendar, Plus, MapPin, Users } from "lucide-react";

interface EventItem {
  id: string;
  event_code: string;
  title: string;
  type: string;
  venue: string;
  start_date: string;
  status: string;
}

export const EventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([
    { id: "1", event_code: "EVT-2026-REUN", title: "Silver Jubilee Global Alumni Reunion 2026", type: "Reunion", venue: "Main Campus Grand Auditorium", start_date: "2026-09-15", status: "Upcoming" },
    { id: "2", event_code: "EVT-2026-WEB1", title: "AI Innovations & Global Tech Leadership Webinar", type: "Webinar", venue: "Virtual Zoom Room", start_date: "2026-08-25", status: "Upcoming" },
    { id: "3", event_code: "EVT-2026-DINN", title: "US Bay Area Alumni Chapter Dinner", type: "Networking", venue: "Silicon Valley Convention Center", start_date: "2026-10-10", status: "Upcoming" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/events/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setEvents(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<EventItem>[] = [
    { key: "event_code", header: "Event Code", sortable: true },
    { key: "title", header: "Event Title", sortable: true },
    { key: "type", header: "Category / Type" },
    { key: "venue", header: "Location / Venue" },
    { key: "start_date", header: "Event Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Upcoming" ? "info" : r.status === "Ongoing" ? "warning" : "success"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Reunions, Seminars & Chapter Events"
        subtitle="Manage global alumni reunions, technical webinars, networking dinners, and event registrations"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Alumni Event
          </Button>
        }
      />

      <DataTable
        title="Global Alumni Events Calendar"
        data={events}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
