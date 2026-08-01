import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Megaphone } from "lucide-react";

interface HRAnnouncementItem {
  id: string;
  title: string;
  target_audience: string;
  publish_date: string;
}

export const AnnouncementsPage: React.FC = () => {
  const announcements: HRAnnouncementItem[] = [
    { id: "1", title: "Updated Institutional Leave Policy FY 2026-27", target_audience: "All Faculty & Staff", publish_date: "2026-08-01" },
    { id: "2", title: "Mandatory Health & Wellness Checkup Camp", target_audience: "All Employees", publish_date: "2026-07-25" },
  ];

  const columns: ColumnDef<HRAnnouncementItem>[] = [
    { key: "title", header: "Announcement Title", sortable: true },
    { key: "target_audience", header: "Target Audience" },
    { key: "publish_date", header: "Published On", sortable: true },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="HR Circulars & Announcements"
        subtitle="Broadcast institutional policies, holiday notices & official HR communications"
        actions={
          <Button variant="primary" leftIcon={<Megaphone className="w-4 h-4" />}>
            New HR Broadcast
          </Button>
        }
      />

      <DataTable data={announcements} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
