import { FieldItem, BuilderTemplate } from "./types";

export const MOCK_BUILDER_FIELDS: FieldItem[] = [
  // Students
  { id: "f-stud-01", name: "Student Enrollment ID", category: "Student Profile", type: "string", module: "Students", isFavorite: true },
  { id: "f-stud-02", name: "Full Name", category: "Student Profile", type: "string", module: "Students", isRecent: true },
  { id: "f-stud-03", name: "Department", category: "Academics", type: "string", module: "Students", isFavorite: true },
  { id: "f-stud-04", name: "Semester", category: "Academics", type: "number", module: "Students" },
  { id: "f-stud-05", name: "CGPA / Grade Score", category: "Performance", type: "number", module: "Students", isFavorite: true },

  // Attendance
  { id: "f-att-01", name: "Attendance Date", category: "Logs", type: "date", module: "Attendance" },
  { id: "f-att-02", name: "Attendance Percentage (%)", category: "Metrics", type: "number", module: "Attendance", isFavorite: true },
  { id: "f-att-03", name: "Absence Count", category: "Metrics", type: "number", module: "Attendance" },
  { id: "f-att-04", name: "Medical Leave Approved", category: "Compliance", type: "boolean", module: "Attendance" },

  // Fees & Finance
  { id: "f-fee-01", name: "Invoice Number", category: "Transaction", type: "string", module: "Fees" },
  { id: "f-fee-02", name: "Total Fee Billed ($)", category: "Financials", type: "number", module: "Fees", isFavorite: true },
  { id: "f-fee-03", name: "Fee Collected ($)", category: "Financials", type: "number", module: "Fees" },
  { id: "f-fee-04", name: "Outstanding Balance ($)", category: "Financials", type: "number", module: "Fees", isFavorite: true },

  // Payroll & HR
  { id: "f-hr-01", name: "Employee Code", category: "Staff Profile", type: "string", module: "HR" },
  { id: "f-hr-02", name: "Designation", category: "Staff Profile", type: "string", module: "HR" },
  { id: "f-pay-01", name: "Base Salary ($)", category: "Payroll", type: "number", module: "Payroll" },
  { id: "f-pay-02", name: "Net Payout ($)", category: "Payroll", type: "number", module: "Payroll", isFavorite: true },

  // Library & Assets
  { id: "f-lib-01", name: "Book ISBN / Title", category: "Catalog", type: "string", module: "Library" },
  { id: "f-lib-02", name: "Fine Amount Due", category: "Fines", type: "number", module: "Library" },
  { id: "f-ast-01", name: "Asset Barcode Tag", category: "Equipment", type: "string", module: "Assets" },

  // Transport & Inventory
  { id: "f-tr-01", name: "Bus Route Code", category: "Transport", type: "string", module: "Transport" },
  { id: "f-inv-01", name: "Stock Item Code", category: "Warehouse", type: "string", module: "Inventory" },
  { id: "f-inv-02", name: "Quantity In Stock", category: "Warehouse", type: "number", module: "Inventory" },

  // AI Copilot
  { id: "f-ai-01", name: "Token Query Count", category: "AI Analytics", type: "number", module: "AI" },
];

export const MOCK_BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: "tmpl-exec",
    name: "Executive Overview Report",
    description: "High-level summary template with KPI cards, revenue charts, and department performance.",
    category: "Executive",
    module: "Fees",
    elements: [
      { id: "el-header", type: "section-header", title: "Institutional Executive Summary", gridSpan: 12, content: "Comprehensive overview of operations, academics, and finances." },
      { id: "el-kpi-1", type: "kpi-card", title: "Total Student Enrollment", gridSpan: 4 },
      { id: "el-kpi-2", type: "kpi-card", title: "Annual Tuition Collected", gridSpan: 4 },
      { id: "el-kpi-3", type: "kpi-card", title: "Overall Pass Rate", gridSpan: 4 },
      { id: "el-chart-1", type: "line-chart", title: "Monthly Revenue vs Expenses", gridSpan: 8 },
      { id: "el-chart-2", type: "pie-chart", title: "Fee Collection Share", gridSpan: 4 },
      { id: "el-table-1", type: "table", title: "Departmental Performance Audit", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-acad",
    name: "Academic Performance Report",
    description: "Course enrollment breakdown, semester grade metrics, and subject load audit.",
    category: "Academics",
    module: "Students",
    elements: [
      { id: "el-acad-header", type: "section-header", title: "Academic & Course Analytics", gridSpan: 12 },
      { id: "el-acad-bar", type: "bar-chart", title: "Semester Credit Hours by Branch", gridSpan: 6 },
      { id: "el-acad-radar", type: "radar-chart", title: "Teaching Quality Index", gridSpan: 6 },
      { id: "el-acad-table", type: "table", title: "Student Pass / Fail Summary", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-att",
    name: "Student Attendance & Defaulter Audit",
    description: "Monthly attendance threshold tracking and defaulters list.",
    category: "Attendance",
    module: "Attendance",
    elements: [
      { id: "el-att-header", type: "section-header", title: "Attendance & Defaulters Summary", gridSpan: 12 },
      { id: "el-att-filter", type: "filter-panel", title: "Filter Parameters", gridSpan: 12 },
      { id: "el-att-gauge", type: "gauge", title: "Average Institutional Attendance", gridSpan: 4 },
      { id: "el-att-heat", type: "heatmap", title: "Hourly Class Attendance Density", gridSpan: 8 },
      { id: "el-att-table", type: "table", title: "Defaulters Below 75% Threshold", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-fin",
    name: "Finance & Fee Collection Report",
    description: "Tuition collections, pending balances, and gateway reconciliations.",
    category: "Finance",
    module: "Fees",
    elements: [
      { id: "el-fin-header", type: "section-header", title: "Financial Collections & Dues", gridSpan: 12 },
      { id: "el-fin-area", type: "area-chart", title: "Cash Flow Accumulation", gridSpan: 8 },
      { id: "el-fin-donut", type: "donut-chart", title: "Fee Category Split", gridSpan: 4 },
      { id: "el-fin-table", type: "table", title: "Pending Dues Ledger", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-pay",
    name: "Payroll & Salary Register",
    description: "Employee monthly gross pay, tax deductions, and net payouts.",
    category: "Payroll",
    module: "Payroll",
    elements: [
      { id: "el-pay-header", type: "section-header", title: "Monthly Payroll Register", gridSpan: 12 },
      { id: "el-pay-bar", type: "bar-chart", title: "Departmental Salary Expense", gridSpan: 6 },
      { id: "el-pay-ring", type: "progress-ring", title: "Tax Withholding Rate", gridSpan: 6 },
      { id: "el-pay-table", type: "table", title: "Employee Payslip Summary", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-hr",
    name: "HR Employee & Leave Audit",
    description: "Staff designations, leave balances, and appraisal scores.",
    category: "HR",
    module: "HR",
    elements: [
      { id: "el-hr-header", type: "section-header", title: "Staff Leave & Performance Report", gridSpan: 12 },
      { id: "el-hr-kpi", type: "kpi-card", title: "Active Staff Count", gridSpan: 4 },
      { id: "el-hr-table", type: "table", title: "Employee Leave Balances", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-lib",
    name: "Library Circulation Report",
    description: "Book issue logs, overdue returns, and fine collections.",
    category: "Library",
    module: "Library",
    elements: [
      { id: "el-lib-header", type: "section-header", title: "Library Book Circulation", gridSpan: 12 },
      { id: "el-lib-line", type: "line-chart", title: "Monthly Borrowing Trends", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-tr",
    name: "Transport Route & Fuel Audit",
    description: "Bus occupancy, route efficiency, and fuel logs.",
    category: "Transport",
    module: "Transport",
    elements: [
      { id: "el-tr-header", type: "section-header", title: "Transport System Efficiency", gridSpan: 12 },
      { id: "el-tr-table", type: "table", title: "Bus Route Occupancy Rates", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-inv",
    name: "Inventory Valuation & Reorder Report",
    description: "Warehouse stock levels, safety thresholds, and aging analysis.",
    category: "Inventory",
    module: "Inventory",
    elements: [
      { id: "el-inv-header", type: "section-header", title: "Inventory Valuation Summary", gridSpan: 12 },
      { id: "el-inv-tree", type: "treemap", title: "Category Stock Value Share", gridSpan: 12 },
    ],
  },
  {
    id: "tmpl-blank",
    name: "Blank Canvas Report",
    description: "Start from scratch with a blank canvas grid.",
    category: "Custom",
    module: "Students",
    elements: [
      { id: "el-blank-header", type: "section-header", title: "Custom Custom Report", gridSpan: 12 },
    ],
  },
];
