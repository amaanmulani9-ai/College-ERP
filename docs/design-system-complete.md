# Complete Enterprise Design System — Architecture & Specification

**Version:** v0.21.0-design-system-final  
**Updated:** August 1, 2026  
**Module:** `frontend/src/design-system/`

---

## 1. System Architecture

The College ERP Design System is structured into five core sub-packages:

```
frontend/src/design-system/
├── tokens/            # Design System Tokens (colors, typography, spacing, shadows, animations, breakpoints, zIndex)
├── components/        # UI Component Library (Buttons, Typography, Forms, Data, Feedback, Navigation, Charts, Layout, Utils)
├── hooks/             # Custom React Hooks (useBreakpoint, useMediaQuery, useClickOutside, useKeyPress, useLocalStorage, useDebounce, etc.)
├── providers/         # DesignSystemProvider context for theme and accessibility state
├── utils/             # Formatters, class mergers, string/color/DOM/array utilities
└── index.ts           # Master Barrel Export
```

---

## 2. Token System

- **Colors:** Primary Indigo, Secondary Purple, Success Emerald, Warning Amber, Danger Red, Info Sky, Neutral Slate + Dark/Light Theme tokens.
- **Typography:** Font families (Outfit Display, Inter Body, JetBrains Mono Code), sizes (2xs-7xl), weights, line heights, letter spacing.
- **Spacing & Layout:** 4px grid scale, border radiuses (sm-4xl, full), container widths (xs-2xl), component heights.
- **Shadows & Glass:** Elevation scale (xs-xl), brand glows, glassmorphism, focus rings.
- **Animations:** Duration scale, CSS/Framer Motion easing curves, spring configs, fade/slide/scale/stagger variants.
- **Breakpoints & Z-Index:** Screen size scale (320px-1920px), media queries, strict z-index layering hierarchy.

---

## 3. Component Suite

- **Buttons:** Base `Button` + 8 variants + 5 sizes + loading state + icons + 9 shorthand buttons.
- **Typography:** `Heading` (`H1`-`H6`) with gradient text, `Text`, `Label`, `Caption`, `Overline`, `Code`, `Kbd`, `TruncatedText`.
- **Forms:** `TextInput`, `EmailInput`, `PasswordInput`, `NumberInput`, `PhoneInput`, `SearchInput`, `URLInput`, `CurrencyInput`, `OTPInput`, `Textarea`, `Select`, `SearchableSelect`, `MultiSelect`, `Checkbox`, `Radio`, `Switch`, `ToggleGroup`, `DatePicker`, `TimePicker`, `DateTimePicker`, `DateRangePicker`, `AcademicYearPicker`, `SemesterPicker`, `FileUpload`, `ImageUpload`, `TagInput`, `RichTextEditor`, `Slider`, `Rating`, `ColorPicker`, `FormField`.
- **Data Display:** `DataTable<T>`, `DataGrid<T>`, `TableToolbar`, `TablePagination`, `TableColumnSelector`, `TableExport`, `BulkActionsBar`, `StatusBadge`, `ProgressBadge`, `PriorityBadge`, `HealthBadge`, `VerificationBadge`, `TableSkeleton`, `EmptyState`, `NoResultsState`, `ErrorState`, `StatList`, `KeyValueGrid`, `Timeline`, `ActivityTable`.
- **Feedback & Overlays:** `Modal`, `ConfirmationModal`, `AlertModal`, `WizardModal`, `ImagePreviewModal`, `PDFPreviewModal`, `DeleteConfirmationDialog`, `ArchiveConfirmationDialog`, `RestoreConfirmationDialog`, `UnsavedChangesDialog`, `LogoutConfirmationDialog`, `SessionExpiredDialog`, `PermissionDialog`, `Drawer`, `RightDrawer`, `LeftDrawer`, `BottomDrawer`, `FilterDrawer`, `DetailsDrawer`, `ToastProvider`, `useToast()`, `InlineAlert`, `Banner`, `NotificationCard`, `EmptyNotification`, `LinearProgress`, `CircularProgress`, `StepperProgress`, `Spinner`, `PageLoader`, `SectionLoader`, `OverlayLoader`, `SkeletonLoader`, `SuccessScreen`, `ErrorScreen`, `WarningScreen`, `MaintenanceScreen`, `ComingSoonScreen`, `AccessRestrictedScreen`.
- **Navigation:** `Tabs`, `VerticalTabs`, `Breadcrumb`, `PageHeader`, `SectionHeader`, `Accordion`, `Collapse`, `TreeView`, `MegaMenu`, `ContextMenu`, `DropdownMenu`, `CommandMenu`, `SidebarMenu`, `Stepper`.
- **Charts:** `LineChart`, `AreaChart`, `BarChart`, `HorizontalBarChart`, `PieChart`, `DonutChart`, `RadarChart`, `ScatterChart`, `HeatmapPlaceholder`, `GaugeChart`, `Sparkline`, `MiniTrendChart`.
- **Layout & Utils:** `PageContainer`, `ContentContainer`, `Section`, `Grid`, `Stack`, `Flex`, `Divider`, `Spacer`, `AspectRatio`, `ScrollArea`, `ResizablePanel`, `Tooltip`, `Popover`, `HoverCard`, `CopyButton`, `Clipboard`, `CodeBlock`, `JSONViewer`, `MarkdownViewer`, `MetricComparisonCard`, `StatisticGroup`, `FeatureComparisonTable`.
