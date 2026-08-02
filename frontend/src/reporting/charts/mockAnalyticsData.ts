import { KPIMetric, SeriesData, DataPoint } from "./types";

export const MOCK_EXECUTIVE_KPIS: KPIMetric[] = [
  {
    id: "kpi-tot-stud",
    title: "Total Enrolled Students",
    value: "4,850",
    previousValue: "4,520",
    target: "5,000",
    unit: "Students",
    growthPercent: 7.3,
    isPositive: true,
    status: "good",
    achievementPercent: 97.0,
    variancePercent: -3.0,
    trendData: [4200, 4350, 4420, 4520, 4680, 4850],
  },
  {
    id: "kpi-tot-rev",
    title: "Annual Tuition & Fee Revenue",
    value: "$14.2M",
    previousValue: "$12.8M",
    target: "$15.0M",
    unit: "USD",
    growthPercent: 10.9,
    isPositive: true,
    status: "excellent",
    achievementPercent: 94.6,
    variancePercent: -5.4,
    trendData: [11.2, 11.8, 12.4, 12.8, 13.5, 14.2],
  },
  {
    id: "kpi-avg-att",
    title: "Institutional Attendance Rate",
    value: "91.8%",
    previousValue: "88.4%",
    target: "90.0%",
    unit: "%",
    growthPercent: 3.8,
    isPositive: true,
    status: "excellent",
    achievementPercent: 102.0,
    variancePercent: +2.0,
    trendData: [85, 87, 88, 89, 90, 91.8],
  },
  {
    id: "kpi-placement",
    title: "Campus Placement Rate",
    value: "89.4%",
    previousValue: "84.2%",
    target: "85.0%",
    unit: "%",
    growthPercent: 6.2,
    isPositive: true,
    status: "excellent",
    achievementPercent: 105.1,
    variancePercent: +5.1,
    trendData: [78, 80, 82, 84.2, 86, 89.4],
  },
  {
    id: "kpi-faculty-load",
    title: "Faculty-to-Student Ratio",
    value: "1 : 16",
    previousValue: "1 : 18",
    target: "1 : 15",
    unit: "Ratio",
    growthPercent: 11.1,
    isPositive: true,
    status: "good",
    achievementPercent: 93.7,
    variancePercent: -6.3,
    trendData: [20, 19, 18, 18, 17, 16],
  },
  {
    id: "kpi-ai-usage",
    title: "AI Copilot Monthly Queries",
    value: "38,420",
    previousValue: "24,100",
    target: "30,000",
    unit: "Queries",
    growthPercent: 59.4,
    isPositive: true,
    status: "excellent",
    achievementPercent: 128.0,
    variancePercent: +28.0,
    trendData: [12000, 16500, 21000, 24100, 31000, 38420],
  },
];

export const MOCK_LINE_SERIES: SeriesData[] = [
  {
    id: "series-current",
    name: "Current Academic Year (2026)",
    color: "#6366f1",
    data: [
      { label: "Jan", value: 65 },
      { label: "Feb", value: 72 },
      { label: "Mar", value: 85 },
      { label: "Apr", value: 78 },
      { label: "May", value: 92 },
      { label: "Jun", value: 88 },
      { label: "Jul", value: 96 },
      { label: "Aug", value: 104 },
    ],
  },
  {
    id: "series-previous",
    name: "Previous Academic Year (2025)",
    color: "#06b6d4",
    data: [
      { label: "Jan", value: 55 },
      { label: "Feb", value: 60 },
      { label: "Mar", value: 70 },
      { label: "Apr", value: 68 },
      { label: "May", value: 80 },
      { label: "Jun", value: 75 },
      { label: "Jul", value: 82 },
      { label: "Aug", value: 88 },
    ],
  },
];

export const MOCK_BAR_DATA: DataPoint[] = [
  { label: "Computer Science", value: 1240, target: 1200, category: "CS" },
  { label: "Electronics & Comm", value: 850, target: 900, category: "ECE" },
  { label: "Mechanical Eng", value: 720, target: 800, category: "ME" },
  { label: "Civil Engineering", value: 510, target: 600, category: "CE" },
  { label: "Artificial Intelligence", value: 980, target: 850, category: "AI" },
  { label: "Business Admin", value: 550, target: 500, category: "MBA" },
];

export const MOCK_STACKED_BAR_DATA: DataPoint[] = [
  { label: "Semester 1", CS: 320, ECE: 210, ME: 180, AI: 250 },
  { label: "Semester 3", CS: 310, ECE: 220, ME: 175, AI: 240 },
  { label: "Semester 5", CS: 300, ECE: 205, ME: 185, AI: 245 },
  { label: "Semester 7", CS: 310, ECE: 215, ME: 180, AI: 245 },
];

export const MOCK_PIE_DATA: DataPoint[] = [
  { label: "Tuition Fees", value: 62, color: "#6366f1" },
  { label: "Hostel & Mess", value: 18, color: "#06b6d4" },
  { label: "Research Grants", value: 12, color: "#10b981" },
  { label: "Transport & Misc", value: 8, color: "#f59e0b" },
];

export const MOCK_RADAR_DATA: DataPoint[] = [
  { label: "Teaching Quality", value: 92, target: 85 },
  { label: "Research Impact", value: 84, target: 80 },
  { label: "Infrastructure", value: 95, target: 90 },
  { label: "Placement CTC", value: 88, target: 85 },
  { label: "Student Satisfaction", value: 90, target: 88 },
  { label: "Industry Collaboration", value: 82, target: 75 },
];

export const MOCK_SCATTER_DATA: DataPoint[] = [
  { label: "Student A", value: 88, secondaryValue: 92, category: "High Performing" },
  { label: "Student B", value: 75, secondaryValue: 80, category: "Average" },
  { label: "Student C", value: 95, secondaryValue: 98, category: "Top Tier" },
  { label: "Student D", value: 62, secondaryValue: 65, category: "Needs Support" },
  { label: "Student E", value: 82, secondaryValue: 86, category: "Good" },
  { label: "Student F", value: 91, secondaryValue: 94, category: "Top Tier" },
];

export const MOCK_HEATMAP_DATA = [
  { day: "Mon", h8: 45, h10: 92, h12: 85, h14: 78, h16: 60 },
  { day: "Tue", h8: 50, h10: 96, h12: 90, h14: 82, h16: 65 },
  { day: "Wed", h8: 48, h10: 94, h12: 88, h14: 80, h16: 62 },
  { day: "Thu", h8: 52, h10: 98, h12: 92, h14: 85, h16: 68 },
  { day: "Fri", h8: 42, h10: 88, h12: 82, h14: 72, h16: 55 },
];

export const MOCK_TREEMAP_DATA = [
  { label: "Computer Science Dept", value: 450, color: "#6366f1" },
  { label: "Electronics & Telecom", value: 320, color: "#06b6d4" },
  { label: "Mechanical Engineering", value: 280, color: "#10b981" },
  { label: "Artificial Intelligence", value: 240, color: "#a855f7" },
  { label: "Civil Infrastructure", value: 170, color: "#f59e0b" },
];

export const MOCK_PERFORMERS = [
  { name: "Department of Computer Science", score: "96.4%", subtitle: "Highest Pass Rate & Placements", rank: 1, isTop: true },
  { name: "Department of AI & Data Science", score: "94.8%", subtitle: "Top Research Publications", rank: 2, isTop: true },
  { name: "School of Management Studies", score: "91.2%", subtitle: "Best Student Satisfaction", rank: 3, isTop: true },
  { name: "Department of Civil Engineering", score: "74.5%", subtitle: "High Defaulter Rate in Sem 2", rank: 1, isTop: false },
  { name: "Department of Electrical Eng", score: "78.0%", subtitle: "Pending Fee Collections ($45k)", rank: 2, isTop: false },
];
