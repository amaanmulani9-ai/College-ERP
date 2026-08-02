import type {
  ServiceHealth,
  BackupJob,
  AuditLogEntry,
  ActivityLogEntry,
  StorageBucket,
  JobEntry,
  CacheStat,
  DbTableStat,
  RecoveryContact,
  RecoveryChecklistItem,
  SupportTicket,
  MaintenanceWindow,
} from "./types";

// ── Service Health ─────────────────────────────────────────────────────────────

export const MOCK_SERVICES: ServiceHealth[] = [
  { id: "svc-api",  service: "Django REST API Gateway",   category: "API",      status: "Healthy",     uptime: "99.98%", latencyMs: 42,  lastChecked: "2s ago",  history: [38,41,44,40,42,39,43,45,41,42] },
  { id: "svc-db",   service: "PostgreSQL 16 Primary",     category: "Database", status: "Healthy",     uptime: "99.99%", latencyMs: 8,   lastChecked: "2s ago",  history: [7,8,9,7,8,8,9,8,7,8] },
  { id: "svc-red",  service: "Redis 7 Session Cache",     category: "Redis",    status: "Healthy",     uptime: "100%",   latencyMs: 1,   lastChecked: "1s ago",  history: [1,1,1,2,1,1,1,1,1,1] },
  { id: "svc-mail", service: "SendGrid SMTP Relay",       category: "Email",    status: "Healthy",     uptime: "99.90%", latencyMs: 112, lastChecked: "10s ago", history: [100,108,115,110,112,114,109,111,113,112] },
  { id: "svc-ai",   service: "Anthropic Claude Copilot",  category: "AI",       status: "Healthy",     uptime: "99.95%", latencyMs: 880, lastChecked: "30s ago", history: [820,850,900,870,880,860,890,880,875,880] },
  { id: "svc-pay",  service: "Razorpay Payment Bridge",   category: "Payments", status: "Healthy",     uptime: "99.95%", latencyMs: 89,  lastChecked: "5s ago",  history: [80,85,92,88,89,86,91,89,88,89] },
  { id: "svc-s3",   service: "AWS S3 Document Storage",   category: "Storage",  status: "Healthy",     uptime: "99.99%", latencyMs: 65,  lastChecked: "4s ago",  history: [60,62,68,65,66,64,67,65,63,65] },
  { id: "svc-cel",  service: "Celery Worker Queue",       category: "API",      status: "Degraded",    uptime: "98.1%",  latencyMs: 340, lastChecked: "30s ago", history: [280,300,320,340,360,340,330,345,340,340] },
  { id: "svc-tw",   service: "Twilio SMS Gateway",        category: "Email",    status: "Maintenance", uptime: "95.2%",  latencyMs: 0,   lastChecked: "1m ago",  history: [0,0,0,0,0,0,0,0,0,0] },
];

// ── Maintenance Windows ────────────────────────────────────────────────────────

export const MOCK_MAINTENANCE_WINDOWS: MaintenanceWindow[] = [
  { id: "mw-001", title: "PostgreSQL Major Version Upgrade 16 → 17", scheduledAt: "2026-08-10 02:00 IST", estimatedDuration: "3 hours",    affectedModules: ["All Modules"], status: "Scheduled" },
  { id: "mw-002", title: "Redis Cluster Shard Rebalancing",          scheduledAt: "2026-08-05 01:30 IST", estimatedDuration: "45 minutes",  affectedModules: ["Session Mgmt", "Caching Layer"], status: "Scheduled" },
  { id: "mw-003", title: "Celery Broker Migration to RabbitMQ",      scheduledAt: "2026-08-20 03:00 IST", estimatedDuration: "2 hours",    affectedModules: ["Job Queue", "Notifications", "Reports"], status: "Scheduled" },
];

// ── Backups ────────────────────────────────────────────────────────────────────

export const MOCK_BACKUP_JOBS: BackupJob[] = [
  { id: "bkp-001", type: "Full",         trigger: "Scheduled", size: "18.4 GB", duration: "12m 34s", status: "Completed", completedAt: "2026-08-02 03:00:15", location: "s3://nits-backups/2026-08-02/full" },
  { id: "bkp-002", type: "Incremental",  trigger: "Scheduled", size: "2.1 GB",  duration: "1m 48s",  status: "Completed", completedAt: "2026-08-02 09:00:04", location: "s3://nits-backups/2026-08-02/incr-09h" },
  { id: "bkp-003", type: "Incremental",  trigger: "Manual",    size: "—",       duration: "Running…",status: "Running",   completedAt: "In Progress",          location: "s3://nits-backups/2026-08-02/incr-manual" },
  { id: "bkp-004", type: "Schema-Only",  trigger: "Manual",    size: "92 MB",   duration: "22s",     status: "Completed", completedAt: "2026-08-01 18:11:30", location: "s3://nits-backups/2026-08-01/schema" },
  { id: "bkp-005", type: "Full",         trigger: "Scheduled", size: "17.9 GB", duration: "11m 58s", status: "Completed", completedAt: "2026-08-01 03:00:20", location: "s3://nits-backups/2026-08-01/full" },
  { id: "bkp-006", type: "Incremental",  trigger: "Scheduled", size: "1.8 GB",  duration: "1m 12s",  status: "Failed",    completedAt: "2026-07-31 15:00:02", location: "—" },
];

// ── Audit Logs ─────────────────────────────────────────────────────────────────

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "log-001", timestamp: "2026-08-02 14:42:11", actor: "Dr. Priya Sharma",    role: "Super Admin",     action: "ROLE_ASSIGN",      target: "amaan.k@nits.edu → Finance Officer",  ip: "10.0.1.45",  result: "Success",  category: "Security" },
  { id: "log-002", timestamp: "2026-08-02 14:39:08", actor: "Amaan Khan",          role: "HOD",             action: "SETTING_MODIFY",   target: "FeatureFlag: liquid_glass_ui → true",  ip: "10.0.2.12",  result: "Success",  category: "Configuration" },
  { id: "log-003", timestamp: "2026-08-02 14:31:55", actor: "System",              role: "SYSTEM",          action: "BACKUP_START",     target: "Full DB Backup Job #B-0442",           ip: "127.0.0.1",  result: "Success",  category: "System" },
  { id: "log-004", timestamp: "2026-08-02 14:25:00", actor: "Unknown",             role: "GUEST",           action: "AUTH_ATTEMPT",     target: "admin@nits.edu — 5x failed",           ip: "203.88.21.55",result: "Blocked", category: "Security" },
  { id: "log-005", timestamp: "2026-08-02 13:58:22", actor: "Ravi Mehta",          role: "Finance Officer", action: "EXPORT_DATA",      target: "Fee Report Q2-2026 (CSV, 3.2 MB)",    ip: "10.0.3.91",  result: "Success",  category: "Configuration" },
  { id: "log-006", timestamp: "2026-08-02 13:45:10", actor: "Neha Gupta",          role: "Registrar",       action: "BATCH_UPDATE",     target: "Semester Rollover: 412 students",      ip: "10.0.1.78",  result: "Success",  category: "System" },
  { id: "log-007", timestamp: "2026-08-02 13:30:00", actor: "System",              role: "SYSTEM",          action: "MAINTENANCE_START", target: "Scheduled: Redis rebalancing",         ip: "127.0.0.1",  result: "Warning",  category: "System" },
  { id: "log-008", timestamp: "2026-08-02 12:10:45", actor: "Suresh Patel",        role: "IT Admin",        action: "API_KEY_CREATE",   target: "API Key: canvas-sync-v2",              ip: "10.0.4.20",  result: "Success",  category: "Security" },
];

// ── Activity Logs ──────────────────────────────────────────────────────────────

export const MOCK_ACTIVITY_LOGS: ActivityLogEntry[] = [
  { id: "act-001", timestamp: "14:50:22", user: "Amaan Khan",       module: "Admissions",  action: "VIEWED",    detail: "Application #APP-2026-0412 — B.Tech CSE" },
  { id: "act-002", timestamp: "14:48:10", user: "Neha Gupta",       module: "Fees",        action: "COLLECTED", detail: "₹45,000 fee from Priya Sharma (B.Tech 2Y)" },
  { id: "act-003", timestamp: "14:45:33", user: "Ravi Mehta",       module: "Reports",     action: "GENERATED", detail: "Fee Collection Report — Q2 2026" },
  { id: "act-004", timestamp: "14:42:11", user: "Dr. Priya Sharma", module: "Settings",    action: "MODIFIED",  detail: "Role assigned: Finance Officer → Amaan K." },
  { id: "act-005", timestamp: "14:39:08", user: "Amaan Khan",       module: "Settings",    action: "TOGGLED",   detail: "Feature Flag: liquid_glass_ui enabled" },
  { id: "act-006", timestamp: "14:35:00", user: "Suresh Patel",     module: "Library",     action: "ISSUED",    detail: "Book: 'Clean Code' → Student ID 20CS042" },
  { id: "act-007", timestamp: "14:31:55", user: "System",           module: "Backups",     action: "STARTED",   detail: "Full Database Backup Job #B-0442" },
  { id: "act-008", timestamp: "14:28:40", user: "Meera Joshi",      module: "HR",          action: "UPDATED",   detail: "Payroll slip generated for Aug 2026" },
];

// ── Storage ────────────────────────────────────────────────────────────────────

export const MOCK_STORAGE_BUCKETS: StorageBucket[] = [
  { id: "bkt-uploads",  name: "Student Uploads",    usedGB: 42.3,  totalGB: 100,  category: "Uploads" },
  { id: "bkt-reports",  name: "Generated Reports",  usedGB: 18.7,  totalGB: 50,   category: "Reports" },
  { id: "bkt-media",    name: "Media & Images",     usedGB: 31.5,  totalGB: 80,   category: "Media" },
  { id: "bkt-logs",     name: "Application Logs",   usedGB: 9.2,   totalGB: 20,   category: "Logs" },
  { id: "bkt-backups",  name: "Backup Archives",    usedGB: 189.4, totalGB: 500,  category: "Backups" },
];

// ── Job Queue ──────────────────────────────────────────────────────────────────

export const MOCK_JOBS: JobEntry[] = [
  { id: "job-001", name: "Send Attendance Alert SMS",      queue: "sms",      status: "Running",   scheduledAt: "14:55:00", duration: "12s",  retries: 0 },
  { id: "job-002", name: "Generate Monthly Fee Report",   queue: "reports",  status: "Pending",   scheduledAt: "15:00:00", duration: "—",    retries: 0 },
  { id: "job-003", name: "Email: Exam Schedule Dispatch", queue: "email",    status: "Completed", scheduledAt: "14:00:00", duration: "1m 4s",retries: 0 },
  { id: "job-004", name: "AI Ranking — Admission Batch",  queue: "ai",       status: "Failed",    scheduledAt: "13:30:00", duration: "—",    retries: 3 },
  { id: "job-005", name: "Database Incremental Backup",   queue: "system",   status: "Running",   scheduledAt: "14:50:00", duration: "1m 48s",retries: 0 },
  { id: "job-006", name: "Sync Canvas LMS Grades",        queue: "integrations", status: "Pending",scheduledAt: "15:10:00",duration: "—",    retries: 0 },
  { id: "job-007", name: "Purge Expired Session Tokens",  queue: "system",   status: "Completed", scheduledAt: "14:45:00", duration: "3s",   retries: 0 },
];

// ── Cache ──────────────────────────────────────────────────────────────────────

export const MOCK_CACHE_STATS: CacheStat[] = [
  { key: "students:list",          hits: 12480, misses: 312,  sizeKB: 2048,  ttlSeconds: 300 },
  { key: "fees:dashboard:summary", hits: 8920,  misses: 88,   sizeKB: 512,   ttlSeconds: 60  },
  { key: "reports:q2-2026",        hits: 2240,  misses: 22,   sizeKB: 8192,  ttlSeconds: 3600 },
  { key: "auth:session:*",         hits: 98200, misses: 1800, sizeKB: 10240, ttlSeconds: 1800 },
  { key: "ai:embeddings:cache",    hits: 4410,  misses: 90,   sizeKB: 51200, ttlSeconds: 86400 },
];

// ── Database ───────────────────────────────────────────────────────────────────

export const MOCK_DB_TABLES: DbTableStat[] = [
  { name: "students",          rows: 12450,  sizeKB: 38400,  indexes: 8,  lastVacuum: "2h ago" },
  { name: "fee_transactions",  rows: 340200, sizeKB: 204800, indexes: 12, lastVacuum: "6h ago" },
  { name: "audit_logs",        rows: 1200000, sizeKB: 512000,indexes: 4,  lastVacuum: "1d ago" },
  { name: "course_enrollments",rows: 89400,  sizeKB: 56320,  indexes: 6,  lastVacuum: "12h ago" },
  { name: "exam_results",      rows: 48200,  sizeKB: 32768,  indexes: 5,  lastVacuum: "8h ago" },
  { name: "library_records",   rows: 14800,  sizeKB: 9216,   indexes: 4,  lastVacuum: "1d ago" },
];

// ── Disaster Recovery ──────────────────────────────────────────────────────────

export const MOCK_RECOVERY_CONTACTS: RecoveryContact[] = [
  { name: "Dr. Priya Sharma",  role: "CTO / Incident Commander",   phone: "+91-98765-43210", email: "cto@nits.edu" },
  { name: "Suresh Patel",      role: "Lead DevOps Engineer",        phone: "+91-91234-56789", email: "devops@nits.edu" },
  { name: "Amaan Khan",        role: "Database Administrator",      phone: "+91-88888-77777", email: "dba@nits.edu" },
  { name: "Ravi Mehta",        role: "Security Incident Response",  phone: "+91-99999-11111", email: "security@nits.edu" },
];

export const MOCK_RECOVERY_CHECKLIST: RecoveryChecklistItem[] = [
  { id: "rc-01", step: "Incident Declared",          description: "Activate incident bridge and notify recovery contacts.", done: false },
  { id: "rc-02", step: "System Snapshot",            description: "Take immediate snapshot of all running services and state.", done: false },
  { id: "rc-03", step: "Identify Recovery Point",    description: "Identify the most recent clean backup using Backup Center.", done: false },
  { id: "rc-04", step: "Enable Maintenance Mode",    description: "Lock public access and notify users via status page.", done: false },
  { id: "rc-05", step: "Execute Database Restore",   description: "Run restoration from selected recovery point via Restore Center.", done: false },
  { id: "rc-06", step: "Validate Data Integrity",    description: "Run post-restore validation queries and checksums.", done: false },
  { id: "rc-07", step: "Smoke Test All Services",    description: "Verify all health indicators return Healthy.", done: false },
  { id: "rc-08", step: "Disable Maintenance Mode",   description: "Re-enable public access after validation.", done: false },
  { id: "rc-09", step: "Incident Post-Mortem",       description: "Document RCA and update runbook within 24h.", done: false },
];

// ── Support Tickets ────────────────────────────────────────────────────────────

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: "TKT-0812", title: "Celery Worker Degradation — Late SMS Delivery", priority: "High",    status: "In Progress", assignedTo: "DevOps Team",    createdAt: "2 hours ago" },
  { id: "TKT-0811", title: "PDF Export fails for Reports > 10,000 rows",   priority: "Medium",  status: "Open",        assignedTo: "Unassigned",     createdAt: "5 hours ago" },
  { id: "TKT-0810", title: "Login Page flicker on Safari iOS 17",           priority: "Low",     status: "In Progress", assignedTo: "Frontend Team",  createdAt: "1 day ago" },
  { id: "TKT-0808", title: "Razorpay webhook signature mismatch (3 events)",priority: "Critical",status: "Resolved",    assignedTo: "Backend Team",   createdAt: "3 days ago" },
];
