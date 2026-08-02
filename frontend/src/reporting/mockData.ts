import { ReportItem } from "./types";

export const MOCK_REPORTS: ReportItem[] = [
  // Academic
  {
    id: "rep-acad-01",
    code: "ACAD-101",
    title: "Course Curriculum Breakdown & Credits",
    description: "Comprehensive summary of course structures, semester credit distributions, and elective offerings.",
    category: "Academic",
    module: "Academics",
    iconName: "BookOpen",
    isFavorite: true,
    isPinned: true,
    isRecent: true,
    lastAccessedAt: "2026-08-02T10:15:00Z",
    formatSupported: ["pdf", "excel", "csv"],
    parameters: [
      { id: "dept", name: "department", label: "Department", type: "select", options: [{ label: "All Departments", value: "ALL" }, { label: "Computer Science", value: "CS" }, { label: "Mechanical Eng", value: "ME" }] },
      { id: "sem", name: "semester", label: "Semester", type: "select", options: [{ label: "All Semesters", value: "ALL" }, { label: "Semester 1", value: "1" }, { label: "Semester 2", value: "2" }] }
    ]
  },
  {
    id: "rep-acad-02",
    code: "ACAD-102",
    title: "Subject Syllabus & Load Audit",
    description: "Detailed analysis of faculty teaching allocations, subject credit hours, and lab workload.",
    category: "Academic",
    module: "Academics",
    iconName: "FileText",
    formatSupported: ["pdf", "csv"]
  },

  // Admissions
  {
    id: "rep-adm-01",
    code: "ADM-201",
    title: "Admissions Funnel & Seat Allocation",
    description: "Conversion metrics from prospective leads to verified applications and final seat confirm.",
    category: "Admissions",
    module: "Admissions",
    iconName: "UserPlus",
    isFavorite: true,
    isRecent: true,
    lastAccessedAt: "2026-08-01T14:30:00Z",
    formatSupported: ["pdf", "excel", "csv", "json"],
    parameters: [
      { id: "session", name: "session", label: "Academic Session", type: "select", options: [{ label: "2026-2027", value: "2026" }, { label: "2025-2026", value: "2025" }] }
    ]
  },

  // Attendance
  {
    id: "rep-att-01",
    code: "ATT-301",
    title: "Monthly Student Defaulter Summary",
    description: "Identify students below minimum threshold (e.g. 75%) with medical leave adjustments.",
    category: "Attendance",
    module: "Attendance",
    iconName: "Calendar",
    isFavorite: true,
    isPinned: true,
    formatSupported: ["pdf", "excel", "csv"],
    parameters: [
      { id: "minAtt", name: "minAttendance", label: "Min Threshold (%)", type: "number", defaultValue: 75 }
    ]
  },

  // Examinations
  {
    id: "rep-exam-01",
    code: "EXAM-401",
    title: "Hall Ticket Verification & Exam Seating",
    description: "Room-wise seating arrangements, invigilator duty list, and hall ticket issuance report.",
    category: "Examinations",
    module: "Examinations",
    iconName: "Award",
    formatSupported: ["pdf", "excel"]
  },

  // Results
  {
    id: "rep-res-01",
    code: "RES-501",
    title: "Semester Grade Point Average (SGPA/CGPA) Analytics",
    description: "Distribution of student pass percentages, top rankers, and grade point averages.",
    category: "Results",
    module: "Results",
    iconName: "BarChart2",
    isFavorite: true,
    isRecent: true,
    lastAccessedAt: "2026-08-02T11:00:00Z",
    formatSupported: ["pdf", "excel", "csv", "json"]
  },

  // Students
  {
    id: "rep-stud-01",
    code: "STUD-601",
    title: "Demographic & Enrollment Master Directory",
    description: "Complete student profiles, category breakdown, domicile, blood group, and emergency contacts.",
    category: "Students",
    module: "Students",
    iconName: "Users",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Faculty
  {
    id: "rep-fac-01",
    code: "FAC-701",
    title: "Faculty Qualifications & Research Output",
    description: "Publication records, PhD certifications, patent grants, and research funding overview.",
    category: "Faculty",
    module: "Staff & Faculty",
    iconName: "Briefcase",
    formatSupported: ["pdf", "excel"]
  },

  // HR
  {
    id: "rep-hr-01",
    code: "HR-801",
    title: "Employee Leave & Performance Audit",
    description: "Annual leave balances, casual leave utilization, appraisal scores, and turnover rate.",
    category: "HR",
    module: "HR Management",
    iconName: "UserCheck",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Payroll
  {
    id: "rep-pay-01",
    code: "PAY-901",
    title: "Monthly Salary Register & Tax Ledger",
    description: "Gross salary, allowances, PF deductions, TDS withholding, and net payout summary.",
    category: "Payroll",
    module: "Payroll",
    iconName: "DollarSign",
    isFavorite: true,
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Finance
  {
    id: "rep-fin-01",
    code: "FIN-1001",
    title: "Institutional Balance Sheet & PnL Overview",
    description: "Revenue from tuition, grants, hostel, capital expenditure, operational expenditures.",
    category: "Finance",
    module: "Finance",
    iconName: "PieChart",
    formatSupported: ["pdf", "excel"]
  },

  // Fees
  {
    id: "rep-fee-01",
    code: "FEE-1101",
    title: "Outstanding Dues & Defaulter Ledger",
    description: "Quarterly fee collections, pending balances, fine waivers, and installment schedules.",
    category: "Fees",
    module: "Fee Management",
    iconName: "CreditCard",
    isPinned: true,
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Payments
  {
    id: "rep-pmt-01",
    code: "PMT-1201",
    title: "Online Gateway Transaction Audit",
    description: "Settlement logs, gateway fee deductions, failed payment reconciliations, and chargebacks.",
    category: "Payments",
    module: "Payment Gateway",
    iconName: "ShieldCheck",
    formatSupported: ["excel", "csv", "json"]
  },

  // Transport
  {
    id: "rep-tr-01",
    code: "TR-1301",
    title: "Vehicle Fuel & Maintenance Efficiency",
    description: "Bus route occupancy, mileage tracking, fuel log verification, and driver shift hours.",
    category: "Transport",
    module: "Transport",
    iconName: "Truck",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Library
  {
    id: "rep-lib-01",
    code: "LIB-1401",
    title: "Book Circulation & Fine Collection Audit",
    description: "Top issued titles, overdue return notices, digital journal accesses, and fine receipts.",
    category: "Library",
    module: "Library",
    iconName: "Book",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Hostel
  {
    id: "rep-host-01",
    code: "HOST-1501",
    title: "Room Occupancy & Maintenance Log",
    description: "Bed allocation status per block, mess fee collection, warden inspection reports.",
    category: "Hostel",
    module: "Hostel",
    iconName: "Home",
    formatSupported: ["pdf", "excel"]
  },

  // Inventory
  {
    id: "rep-inv-01",
    code: "INV-1601",
    title: "Stock Reorder & Valuation Summary",
    description: "Warehouse stock levels, fast-moving items, safety thresholds, and aging analysis.",
    category: "Inventory",
    module: "Inventory",
    iconName: "Archive",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Procurement
  {
    id: "rep-proc-01",
    code: "PROC-1701",
    title: "Purchase Requisition & PO Lifecycle",
    description: "RFQ comparison matrices, vendor lead times, contract compliance, and invoice status.",
    category: "Procurement",
    module: "Procurement",
    iconName: "ShoppingBag",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Assets
  {
    id: "rep-ast-01",
    code: "AST-1801",
    title: "Fixed Asset Depreciation & Audit Log",
    description: "Asset allocation to labs/departments, straight-line depreciation, AMC coverage status.",
    category: "Assets",
    module: "Enterprise Assets",
    iconName: "Cpu",
    formatSupported: ["pdf", "excel"]
  },

  // Placement
  {
    id: "rep-plc-01",
    code: "PLC-1901",
    title: "Campus Recruitment & Offer Letter Statistics",
    description: "Highest package, average CTC, domain-wise company visits, and student eligibility pool.",
    category: "Placement",
    module: "Placement",
    iconName: "TrendingUp",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // Alumni
  {
    id: "rep-alm-01",
    code: "ALM-2001",
    title: "Alumni Engagement & Contribution Directory",
    description: "Global alumni distribution, mentorship hours logged, fundraising campaign donations.",
    category: "Alumni",
    module: "Alumni",
    iconName: "Globe",
    formatSupported: ["pdf", "excel"]
  },

  // Visitor
  {
    id: "rep-vis-01",
    code: "VIS-2101",
    title: "Campus Security & Gate Pass Access Log",
    description: "Daily visitor counts, contractor badge logs, vehicle permits, and security alerts.",
    category: "Visitor",
    module: "Visitor Management",
    iconName: "Eye",
    formatSupported: ["pdf", "excel", "csv"]
  },

  // AI
  {
    id: "rep-ai-01",
    code: "AI-2201",
    title: "AI Token Usage & Query Analytics",
    description: "Copilot token consumption by department, query latency, model cost distribution.",
    category: "AI",
    module: "AI Assistant",
    iconName: "Sparkles",
    isFavorite: true,
    formatSupported: ["pdf", "json", "csv"]
  },

  // System
  {
    id: "rep-sys-01",
    code: "SYS-2301",
    title: "System Audit Logs & Security Traces",
    description: "User login histories, permission modifications, API error spikes, and active sessions.",
    category: "System",
    module: "System Security",
    iconName: "Server",
    formatSupported: ["pdf", "json", "csv"]
  }
];
