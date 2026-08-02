import {
  UserAccountItem,
  SecurityRoleItem,
  PermissionDefinition,
  APIKeyItem,
  IPWhitelistItem,
  SecurityAuditLogItem,
  ActiveDeviceItem,
} from "./types";

export const MOCK_USER_ACCOUNTS: UserAccountItem[] = [
  { id: "usr-01", name: "Dr. Robert Vance", email: "r.vance@nits.edu", department: "Computer Science", role: "Super Admin", status: "Active", lastLogin: "10 mins ago" },
  { id: "usr-02", name: "Prof. Alan Turing", email: "a.turing@nits.edu", department: "Computer Science", role: "HOD / Faculty", status: "Active", lastLogin: "2 hours ago" },
  { id: "usr-03", name: "Sarah Jenkins", email: "s.jenkins@nits.edu", department: "Finance & Accounts", role: "Finance Manager", status: "Active", lastLogin: "Yesterday" },
  { id: "usr-04", name: "Michael Vance", email: "m.vance@student.nits.edu", department: "B.Tech CS 3rd Sem", role: "Student", status: "Active", lastLogin: "5 mins ago" },
  { id: "usr-05", name: "Temp Contract User", email: "temp.guest@external.com", department: "Procurement", role: "Guest Auditor", status: "Deactivated", lastLogin: "3 weeks ago" },
];

export const MOCK_SECURITY_ROLES: SecurityRoleItem[] = [
  { id: "role-superadmin", name: "Super Admin", type: "System", colorBadge: "bg-indigo-950 text-indigo-300 border-indigo-800", assignedUsersCount: 3, description: "Unrestricted root administrative access across all 30 ERP modules." },
  { id: "role-principal", name: "Principal / Registrar", type: "System", colorBadge: "bg-purple-950 text-purple-300 border-purple-800", assignedUsersCount: 5, description: "Executive oversight, institutional reports approval, and governance." },
  { id: "role-hod", name: "Head of Department (HOD)", type: "System", colorBadge: "bg-cyan-950 text-cyan-300 border-cyan-800", assignedUsersCount: 18, description: "Departmental academic management, faculty schedules, and grade sign-offs." },
  { id: "role-faculty", name: "Faculty / Professor", type: "System", colorBadge: "bg-emerald-950 text-emerald-300 border-emerald-800", assignedUsersCount: 140, description: "Attendance entry, course grading, syllabus tracking, and exam submission." },
  { id: "role-student", name: "Student", type: "System", colorBadge: "bg-slate-800 text-slate-300 border-slate-700", assignedUsersCount: 4200, description: "Student portal access to LMS, fee payment, grades, and library." },
];

export const MOCK_PERMISSIONS: PermissionDefinition[] = [
  { id: "perm-adm-create", module: "Admissions", action: "Create", code: "admissions:create" },
  { id: "perm-adm-approve", module: "Admissions", action: "Approve", code: "admissions:approve" },
  { id: "perm-fin-export", module: "Finance & Fees", action: "Export", code: "finance:export" },
  { id: "perm-ai-copilot", module: "AI Assistant", action: "AI", code: "ai:copilot_execute" },
];

export const MOCK_API_KEYS: APIKeyItem[] = [
  { id: "key-01", name: "LMS Canvas Webhook Key", prefix: "nits_live_pk_99...", type: "System", scopes: ["students:read", "courses:read"], expiresAt: "2027-01-01" },
  { id: "key-02", name: "Razorpay Production Webhook", prefix: "nits_live_rz_41...", type: "System", scopes: ["fees:write", "payments:read"], expiresAt: "2026-12-31" },
];

export const MOCK_IP_WHITELIST: IPWhitelistItem[] = [
  { id: "ip-01", ipAddress: "192.168.1.0/24", type: "Allowed", description: "Campus Subnet Gateway Range", addedAt: "2026-01-10" },
  { id: "ip-02", ipAddress: "203.0.113.50", type: "Blocked", description: "Malicious Brute Force IP Filter", addedAt: "2026-07-28" },
];

export const MOCK_SECURITY_AUDIT: SecurityAuditLogItem[] = [
  { id: "log-01", timestamp: "2026-08-02 19:42:10", actor: "r.vance@nits.edu", action: "ROLE_PERMISSION_UPDATE", target: "HOD Role Matrix", ipAddress: "192.168.1.105", status: "Success" },
  { id: "log-02", timestamp: "2026-08-02 18:15:00", actor: "unknown_user", action: "FAILED_LOGIN_ATTEMPT", target: "Admin Login Portal", ipAddress: "203.0.113.50", status: "Failed" },
];

export const MOCK_ACTIVE_DEVICES: ActiveDeviceItem[] = [
  { id: "dev-01", deviceType: "Desktop Workstation", browser: "Chrome 127.0", platform: "Windows 11 Enterprise", location: "Innovation City, US", ipAddress: "192.168.1.105", lastActive: "Just now", isCurrent: true },
  { id: "dev-02", deviceType: "Apple iPhone 15 Pro", browser: "Mobile Safari 17.5", platform: "iOS 17.5", location: "San Jose, US", ipAddress: "172.56.21.9", lastActive: "3 hours ago", isCurrent: false },
];
