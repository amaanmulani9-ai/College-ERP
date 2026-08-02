# Enterprise Visual Analytics Library (v0.33.0 Part 2)

## Overview

The **Enterprise Visual Analytics Library** (`frontend/src/reporting/charts/`) provides a reusable, interactive SVG/Canvas-powered analytics system for all ERP reports, executive dashboards, and module analytics. It delivers 17 custom visualization chart primitives, 7 analytics widgets, responsive chart controls, date period selectors, and 8 pre-built executive dashboard templates.

---

## Directory & Component Architecture

```
frontend/src/reporting/charts/
├── types.ts                   # Data types for charts, metrics, periods, themes & dashboards
├── mockAnalyticsData.ts        # Mock datasets for all 20 modules & dashboard templates
├── ChartContainer.tsx          # Card container with expand, collapse, fullscreen & theme support
├── ChartToolbar.tsx            # Period selector (1W, 1M, 1Q, 1Y, Custom), trend comparison & refresh
├── ChartLegend.tsx             # Interactive series visibility toggling legends
├── ChartTooltip.tsx            # Positioned hover data tooltip
├── ChartEmptyState.tsx         # Accessible empty visualization state
├── ChartExportMenu.tsx         # Export menu for PNG, SVG, CSV, and JSON
├── AnalyticsDashboard.tsx      # Executive template dashboard renderer (8 pre-built templates)
├── index.ts                    # Master barrel export
│
├── [Chart Library Primitives]
│   ├── LineChart.tsx           # Multi-series spline line graph with glow & hover points
│   ├── AreaChart.tsx           # Gradient area chart with threshold lines
│   ├── BarChart.tsx           # Vertical column chart with target lines
│   ├── StackedBarChart.tsx     # Multi-category stacked bar chart
│   ├── HorizontalBarChart.tsx   # Progress bar chart with values
│   ├── PieChart.tsx            # SVG slice pie chart with percent labels
│   ├── DonutChart.tsx          # Donut chart with center metric display
│   ├── RadarChart.tsx          # Multi-axis radar polygon chart with grid background
│   ├── ScatterChart.tsx        # XY scatter plot chart
│   ├── BubbleChart.tsx         # Proportional bubble plot chart
│   ├── GaugeChart.tsx          # Speedometer / dial gauge meter
│   ├── ProgressRing.tsx        # Circular radial progress ring
│   ├── HeatMapChart.tsx        # Time-grid heat matrix chart
│   ├── TreemapChart.tsx        # Proportional rectangular block chart
│   ├── Sparkline.tsx           # Inline mini trend sparkline graph
│   ├── MiniTrend.tsx           # Compact metric badge with trend sparkline
│   └── KPITrendCard.tsx        # KPI card with value, target & achievement stats
│
└── [Analytics Widgets]
    ├── KPIGrid.tsx             # Responsive grid of 6 executive KPI cards
    ├── TrendComparison.tsx     # Current vs Previous period trend comparison bar
    ├── GrowthIndicator.tsx     # Percentage growth counter pill
    ├── PerformanceCard.tsx     # Score ring & status indicator card
    ├── ModuleSummaryCard.tsx   # High-level module summary card
    ├── TopPerformers.tsx       # Department & student leaderboard
    └── LowPerformers.tsx       # Defaulters & needs-attention risk list
```

---

## 8 Pre-Built Executive Dashboard Templates

1. **Executive Overview**: High-level institutional KPIs, revenue vs operating cost, quality radar, top/low performers.
2. **Academic Analytics**: Branch & semester student breakdown, credit hour load, lab attendance heatmap.
3. **Finance Analytics**: Monthly fee collection, outstanding dues, fee type share, target collection gauge.
4. **HR Analytics**: Employee leave days, staff designation donut, performance appraisal scores.
5. **Library Analytics**: Book circulation trends, top issued categories, overdue fine collection.
6. **Transport Analytics**: Daily bus route occupancy, fuel log consumption tracking.
7. **Inventory Analytics**: Warehouse stock valuation treemap, safety reorder thresholds.
8. **AI Usage Analytics**: Copilot query trends, prompt category share, token latency.

---

## 20 Supported ERP Modules

- Admissions, Students, Attendance, Academics, Results, Fees, Payments, Payroll, HR, Library, Hostel, Transport, Inventory, Procurement, Assets, Placement, Alumni, Visitor, AI, System.

---

## Verification & Build Compliance

- TypeScript Compilation: Verified with **0 errors** (`npx tsc --noEmit`)
- Vite Production Build: Passed (`npm run build`)
- Git Tag: `v0.33.0-ui-reporting-part2`
