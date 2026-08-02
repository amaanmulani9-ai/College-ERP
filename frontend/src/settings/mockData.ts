import { SettingPageItem } from "./types";

export const MOCK_SETTINGS_PAGES: SettingPageItem[] = [
  // General & Institution
  { id: "set-gen-01", code: "SET-GEN-01", title: "General Platform Preferences", category: "General", description: "System timezone, default language, date formats, and currency settings.", iconName: "Sliders", route: "/settings/general", isFavorite: true, isPinned: true, lastModified: "2 hours ago" },
  { id: "set-inst-01", code: "SET-INST-01", title: "Institutional Profile & Accreditation", category: "Institution", description: "College name, affiliation IDs, NAAC/NIRF registration, and campus addresses.", iconName: "Building", route: "/settings/institution", isFavorite: true, lastModified: "1 day ago" },
  
  // Academics & Users
  { id: "set-acad-01", code: "SET-ACAD-01", title: "Academic Term & Grading Rules", category: "Academic", description: "Semester calendars, credit hour limits, GPA evaluation scales, and passing marks.", iconName: "GraduationCap", route: "/settings/academic", isPinned: true, lastModified: "3 days ago" },
  { id: "set-usr-01", code: "SET-USR-01", title: "User Account Provisioning", category: "Users", description: "Manage staff, faculty, student, and parent user directory accounts.", iconName: "Users", route: "/settings/users", isFavorite: true, lastModified: "Just now" },

  // Roles & Security
  { id: "set-role-01", code: "SET-ROLE-01", title: "Role-Based Access Control (RBAC)", category: "Roles & Permissions", description: "Define custom permission matrices, role hierarchies, and module access grants.", iconName: "ShieldCheck", route: "/settings/roles", isFavorite: true, isPinned: true, lastModified: "4 hours ago" },
  { id: "set-auth-01", code: "SET-AUTH-01", title: "Authentication & SSO (SAML/OAuth)", category: "Authentication", description: "Configure Google Workspace, Microsoft Entra ID, 2FA, and password policies.", iconName: "Lock", route: "/settings/auth", lastModified: "5 days ago" },
  { id: "set-sec-01", code: "SET-SEC-01", title: "Security Governance & IP Whitelisting", category: "Security", description: "API keys, CORS origins, session timeouts, and IP firewall restrictions.", iconName: "ShieldAlert", route: "/settings/security", lastModified: "1 week ago" },

  // Notifications & Finance
  { id: "set-notif-01", code: "SET-NOTIF-01", title: "Notification Gateway & SMTP Email", category: "Notifications", description: "Twilio SMS, Firebase Push, SMTP email credentials, and alert templates.", iconName: "Bell", route: "/settings/notifications", lastModified: "2 days ago" },
  { id: "set-fin-01", code: "SET-FIN-01", title: "Financial Ledger & Fiscal Year", category: "Finance", description: "Chart of accounts, fiscal year definitions, tax rates, and bank accounts.", iconName: "DollarSign", route: "/settings/finance", lastModified: "3 days ago" },
  { id: "set-fee-01", code: "SET-FEE-01", title: "Fee Structures & Payment Gateways", category: "Fees", description: "Razorpay, Stripe, UPI integration, late fee fines, and installment rules.", iconName: "CreditCard", route: "/settings/fees", isFavorite: true, lastModified: "5 hours ago" },

  // Payroll, Library, Hostel, Transport
  { id: "set-pay-01", code: "SET-PAY-01", title: "Payroll Compensation & Tax Slabs", category: "Payroll", description: "Base salary bands, provident fund (PF), ESI deductions, and payslip templates.", iconName: "FileSpreadsheet", route: "/settings/payroll", lastModified: "4 days ago" },
  { id: "set-lib-01", code: "SET-LIB-01", title: "Library Circulation & Fine Rules", category: "Library", description: "Max book checkout limits, loan period days, and overdue fine rates per day.", iconName: "BookOpen", route: "/settings/library", lastModified: "6 days ago" },
  { id: "set-hst-01", code: "SET-HST-01", title: "Hostel Allocation & Mess Pricing", category: "Hostel", description: "Room capacities, warden assignments, and monthly mess meal rates.", iconName: "Home", route: "/settings/hostel", lastModified: "1 week ago" },
  { id: "set-tr-01", code: "SET-TR-01", title: "Transport Fleet & Route Rates", category: "Transport", description: "Bus stop pricing slabs, GPS tracker API endpoints, and driver rosters.", iconName: "Bus", route: "/settings/transport", lastModified: "2 weeks ago" },

  // Inventory, Procurement, Assets, HR
  { id: "set-inv-01", code: "SET-INV-01", title: "Inventory Warehouses & Reorder Caps", category: "Inventory", description: "Stock locations, SKU categories, and automatic safety reorder thresholds.", iconName: "Boxes", route: "/settings/inventory", lastModified: "3 days ago" },
  { id: "set-proc-01", code: "SET-PROC-01", title: "Procurement Vendor & PO Approvals", category: "Procurement", description: "Purchase order approval workflows, vendor ratings, and RFQ thresholds.", iconName: "ShoppingCart", route: "/settings/procurement", lastModified: "5 days ago" },
  { id: "set-ast-01", code: "SET-AST-01", title: "Fixed Asset Tagging & Depreciation", category: "Assets", description: "Straight-line depreciation rates, QR code asset tagging, and AMC schedules.", iconName: "QrCode", route: "/settings/assets", lastModified: "1 week ago" },
  { id: "set-hr-01", code: "SET-HR-01", title: "HR Staff Designation & Leave Policy", category: "HR", description: "Earned leave days, casual leave caps, appraisal metrics, and shift timings.", iconName: "UserCheck", route: "/settings/hr", lastModified: "2 days ago" },

  // Placement, Alumni, Visitor, AI
  { id: "set-plc-01", code: "SET-PLC-01", title: "Placement Drive & Recruiter Portal", category: "Placement", description: "Eligible CGPA cutoffs, company tier classifications, and CTC tracking.", iconName: "Briefcase", route: "/settings/placement", lastModified: "4 days ago" },
  { id: "set-alm-01", code: "SET-ALM-01", title: "Alumni Network & Donation Funds", category: "Alumni", description: "Alumni portal registration, membership tiers, and donation gateways.", iconName: "Heart", route: "/settings/alumni", lastModified: "2 weeks ago" },
  { id: "set-vis-01", code: "SET-VIS-01", title: "Visitor Gate Pass & Security Rules", category: "Visitor", description: "Badge printing, host approval triggers, and VIP pre-registrations.", iconName: "UserPlus", route: "/settings/visitor", lastModified: "1 week ago" },
  { id: "set-ai-01", code: "SET-AI-01", title: "AI Copilot & LLM Token Quotas", category: "AI", description: "Anthropic/OpenAI API keys, model routing, monthly token caps, and prompt rules.", iconName: "Sparkles", route: "/settings/ai", isFavorite: true, isPinned: true, lastModified: "Just now" },

  // Branding, Integrations, System, Audit, Backups
  { id: "set-brd-01", code: "SET-BRD-01", title: "Branding, Logo & Custom CSS", category: "Branding", description: "College logos, favicon, primary brand colors, and custom CSS overrides.", iconName: "Palette", route: "/settings/branding", lastModified: "1 month ago" },
  { id: "set-int-01", code: "SET-INT-01", title: "Third-Party API Integrations", category: "Integrations", description: "WhatsApp Business API, Google Classroom, Canvas LMS, and Zoom Webhooks.", iconName: "Plug", route: "/settings/integrations", lastModified: "3 days ago" },
  { id: "set-sys-01", code: "SET-SYS-01", title: "System Maintenance & Health", category: "System", description: "Cache purge, database indexing, background worker status, and log levels.", iconName: "Server", route: "/settings/system", isPinned: true, lastModified: "Yesterday" },
  { id: "set-log-01", code: "SET-LOG-01", title: "System Audit Logs & Security Trace", category: "Audit Logs", description: "Immutable admin action audit logs, IP access history, and change tracking.", iconName: "History", route: "/settings/audit-logs", lastModified: "1 hour ago" },
  { id: "set-bk-01", code: "SET-BK-01", title: "Database Backup & Disaster Recovery", category: "Backups", description: "Automated AWS S3 backups, PostgreSQL dumps, and point-in-time restore.", iconName: "Database", route: "/settings/backups", isFavorite: true, lastModified: "6 hours ago" },
];
