# No-Code Enterprise Report Builder (v0.33.0 Part 3)

## Overview

The **No-Code Enterprise Report Builder** (`frontend/src/reporting/builder/`) allows non-technical administrators, principal officers, HODs, accountants, and staff to build custom, dynamic report layouts using drag-and-drop elements and data-binding field explorers.

Inspired by industry tools such as **Power BI**, **Tableau**, **Metabase**, **Looker Studio**, and **SAP Analytics Cloud**, it features a 12-column snap-grid layout canvas, real-time previewing, calculated field formulas, and pre-built report templates.

---

## Directory & Component Architecture

```
frontend/src/reporting/builder/
├── types.ts                     # Data types for elements, templates, builder state & devices
├── mockFieldsAndTemplates.ts    # Module fields dataset & 10 pre-built report templates
├── FieldExplorer.tsx            # Module data source explorer with search & category tree
├── BuilderToolbar.tsx           # Toolbar with Undo/Redo, Device switcher, Preview & Save
├── BuilderSidebar.tsx           # Palette sidebar with Fields, Elements & Templates tabs
├── BuilderProperties.tsx        # Element inspector for grid span, data binding & formulas
├── BuilderNavigator.tsx         # Canvas outline hierarchy tree with reordering & duplication
├── BuilderCanvas.tsx            # 12-Column snap-grid interactive drop canvas
├── BuilderPreview.tsx           # Live responsive previewer (Desktop, Tablet, Mobile, Print)
├── ReportBuilder.tsx            # Main container with state management & LocalStorage auto-save
└── index.ts                     # Master barrel export
```

---

## Supported Report Elements (16 Component Palette)

1. **Section Header**: Printable section titles & subtitle descriptions.
2. **KPI Card**: Metric value, target, achievement, and variance indicator.
3. **Data Table**: Tabular dataset view with column sorting & group headers.
4. **Line Chart**: Multi-series spline graph for trend analysis.
5. **Area Chart**: Gradient area chart with threshold lines.
6. **Bar Chart**: Column chart for comparative data.
7. **Pie Chart**: Circular slice chart for percentage distribution.
8. **Donut Chart**: Donut slice chart with center metrics.
9. **Gauge Meter**: Speedometer dial gauge for compliance scores.
10. **Progress Ring**: Radial progress circle.
11. **Heatmap Matrix**: Hour/day intensity grid.
12. **Treemap Chart**: Hierarchical rectangular proportion blocks.
13. **Filter Panel**: Execution date range & parameter input bar.
14. **Text Block**: Free-text paragraph annotation.
15. **Image Placeholder**: Institutional logo & watermark container.
16. **Divider**: Structural separator line.

---

## Data Binding & Calculated Formulas

- **Supported Modules**: Students, Attendance, Fees, Payroll, HR, Library, Transport, Assets, Inventory, Placement, AI.
- **Calculated Aggregations**: Sum, Average, Count, Percentage (%), Growth Rate (% YoY), Variance Index.
- **Sorting & Grouping**: Ascending / Descending order; Grouping by Department, Course, Faculty, Batch, or Semester.

---

## 10 Pre-Built Report Templates

1. **Executive Overview Report**
2. **Academic Performance Report**
3. **Student Attendance & Defaulter Audit**
4. **Finance & Fee Collection Report**
5. **Payroll & Salary Register**
6. **HR Employee & Leave Audit**
7. **Library Circulation Report**
8. **Transport Route & Fuel Audit**
9. **Inventory Valuation & Reorder Report**
10. **Blank Canvas Report**

---

## Verification & Build Compliance

- TypeScript Compilation: Passed with **0 errors** (`npx tsc --noEmit`)
- Vite Production Build: Verified (`npm run build`)
- Git Tag: `v0.33.0-ui-reporting-part3`
