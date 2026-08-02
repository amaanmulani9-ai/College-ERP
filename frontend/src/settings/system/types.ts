// ── System Administration Center – Type Definitions ──────────────────────────

export type ServiceStatus = "Healthy" | "Degraded" | "Critical" | "Maintenance" | "Unknown";
export type JobStatus     = "Running" | "Pending" | "Completed" | "Failed" | "Cancelled";
export type BackupType    = "Full" | "Incremental" | "Schema-Only";
export type BackupTrigger = "Scheduled" | "Manual";
export type LogResult     = "Success" | "Failure" | "Blocked" | "Warning";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";
export type TicketStatus   = "Open" | "In Progress" | "Resolved" | "Closed";

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface MetricCard {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "stable";
  status?: ServiceStatus;
}

// ── Health Monitoring ─────────────────────────────────────────────────────────

export interface ServiceHealth {
  id: string;
  service: string;
  category: "API" | "Database" | "Redis" | "Email" | "AI" | "Payments" | "Storage";
  status: ServiceStatus;
  uptime: string;
  latencyMs: number;
  lastChecked: string;
  history: number[]; // last 10 latency readings
}

// ── Maintenance ───────────────────────────────────────────────────────────────

export interface MaintenanceWindow {
  id: string;
  title: string;
  scheduledAt: string;
  estimatedDuration: string;
  affectedModules: string[];
  status: "Scheduled" | "Ongoing" | "Completed";
}

// ── Backups ───────────────────────────────────────────────────────────────────

export interface BackupJob {
  id: string;
  type: BackupType;
  trigger: BackupTrigger;
  size: string;
  duration: string;
  status: "Completed" | "Running" | "Failed";
  completedAt: string;
  location: string;
}

// ── Audit / Activity Logs ─────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ip: string;
  result: LogResult;
  category: "Security" | "Configuration" | "System";
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  module: string;
  action: string;
  detail: string;
}

// ── Storage ───────────────────────────────────────────────────────────────────

export interface StorageBucket {
  id: string;
  name: string;
  usedGB: number;
  totalGB: number;
  category: "Uploads" | "Reports" | "Media" | "Logs" | "Backups";
}

// ── Job Queue ─────────────────────────────────────────────────────────────────

export interface JobEntry {
  id: string;
  name: string;
  queue: string;
  status: JobStatus;
  scheduledAt: string;
  duration?: string;
  retries: number;
}

// ── Cache ─────────────────────────────────────────────────────────────────────

export interface CacheStat {
  key: string;
  hits: number;
  misses: number;
  sizeKB: number;
  ttlSeconds: number;
}

// ── Database ──────────────────────────────────────────────────────────────────

export interface DbTableStat {
  name: string;
  rows: number;
  sizeKB: number;
  indexes: number;
  lastVacuum: string;
}

// ── Disaster Recovery ─────────────────────────────────────────────────────────

export interface RecoveryContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface RecoveryChecklistItem {
  id: string;
  step: string;
  description: string;
  done: boolean;
}

// ── Support ───────────────────────────────────────────────────────────────────

export interface SupportTicket {
  id: string;
  title: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
}
