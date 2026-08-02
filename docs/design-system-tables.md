# Enterprise Data Display & Table System — Documentation

**Version:** v0.21.0-design-system-part3  
**Updated:** August 1, 2026  
**Module:** `frontend/src/design-system/components/data/`

---

## 1. Overview

The Enterprise Data Display System provides a flexible, accessible, high-performance table and data display library supporting client and server-side pagination, column sorting, global search, expandable row details, bulk selection actions, density toggles, status badges, timelines, and loading skeletons.

---

## 2. Component Inventory

### Core Data Grid & Table (`DataTable.tsx`)
- `DataTable<T>` — Generic typed table supporting sorting, search, pagination, selection, expandable row detail panels, density settings, and empty/error states
- `DataGrid<T>` — Card grid wrapper with responsive columns

### Table Controls & Toolbar (`TableControls.tsx`)
- `TableToolbar` & `TableFilters` — Integrated search bar, filter triggers, column selector, export trigger, refresh action
- `TableSearch` — Clearable search field
- `TablePagination` — Page size selector, jump to page, first/prev/next/last navigation
- `TableColumnSelector` — Toggle visibility of table columns
- `TableExport` — Export CSV, Excel, PDF, and Print actions
- `BulkActionsBar` — Floating selection summary bar with bulk actions (e.g. Delete, Export Selected)

### Status Components (`Status.tsx`)
- `StatusBadge` — Success, Warning, Danger, Info, Neutral, Pending badges with animated status dots
- `ProgressBadge` — Percentage badge with mini progress bar
- `PriorityBadge` — Low, Medium, High, Critical badges
- `HealthBadge` — Service status indicator (Healthy, Degraded, Down, Maintenance)
- `VerificationBadge` — Shield indicator (Verified / Unverified)

### Loading & Empty States (`States.tsx`)
- `TableSkeleton` / `RowSkeleton` / `CellSkeleton` — Animated shimmer loaders
- `EmptyState` — Graphic container for no data available
- `NoResultsState` — Reset filter prompt container
- `ErrorState` — Network error retry container

### Data Lists & Timelines (`DataLists.tsx`)
- `StatList` — KPI summary row
- `KeyValueGrid` / `InfoList` — Key-value pair cards
- `Timeline` / `AuditTimeline` / `StatusTimeline` — Chronological log stream with actor avatars
- `ActivityTable` — Compact audit log grid

---

## 3. Server-Side Integration Example

```tsx
import { useState, useEffect } from "react";
import { DataTable, ColumnDef, StatusBadge } from "@/design-system";

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNo: string;
  status: "success" | "pending";
}

export const StudentTable = () => {
  const [data, setData] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const columns: ColumnDef<Student>[] = [
    { key: "enrollmentNo", header: "Enrollment #", sortable: true },
    { key: "name", header: "Student Name", sortable: true },
    { key: "email", header: "Email" },
    {
      key: "status",
      header: "Status",
      accessor: (row) => <StatusBadge label={row.status.toUpperCase()} variant={row.status} />,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/students?page=${page}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.results);
        setTotalRecords(res.count);
        setIsLoading(false);
      });
  }, [page, pageSize]);

  return (
    <DataTable
      title="Student Directory"
      data={data}
      columns={columns}
      keyExtractor={(r) => r.id}
      isLoading={isLoading}
      isServerSide
      currentPage={page}
      pageSize={pageSize}
      totalRecords={totalRecords}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      selectable
    />
  );
};
```
