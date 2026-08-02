export type ScheduleFrequency =
  | "one-time"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "academic-session"
  | "custom-cron";

export type ExportFormat =
  | "pdf"
  | "excel"
  | "csv"
  | "json"
  | "png"
  | "svg"
  | "print";

export type DeliveryChannel =
  | "download"
  | "email"
  | "notification"
  | "workspace-inbox"
  | "shared-reports";

export type RecipientType =
  | "current-user"
  | "department"
  | "faculty"
  | "students"
  | "parents"
  | "finance"
  | "hr"
  | "principal"
  | "custom-email"
  | "role-group";

export interface ScheduleItem {
  id: string;
  reportTitle: string;
  reportId: string;
  frequency: ScheduleFrequency;
  format: ExportFormat;
  channels: DeliveryChannel[];
  recipients: string[];
  nextRunTime: string;
  status: "active" | "paused" | "completed";
  createdBy: string;
  lastRunTime?: string;
}

export interface DeliveryHistoryItem {
  id: string;
  reportTitle: string;
  scheduleId?: string;
  deliveredAt: string;
  channel: DeliveryChannel;
  format: ExportFormat;
  recipientCount: number;
  status: "success" | "failed" | "pending";
  fileSize: string;
  errorMessage?: string;
}

export interface ShareLinkItem {
  id: string;
  reportTitle: string;
  reportId: string;
  shareUrl: string;
  accessLevel: "read-only" | "editable";
  privacy: "public" | "private";
  expiresAt: string;
  sharedWithRole: string;
  viewCount: number;
}
