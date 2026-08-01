# Enterprise Dashboard — Personalization & Command System

**Version:** v0.20.3-ui-dashboard-final  
**Updated:** August 1, 2026

---

## 1. Dashboard Personalization

### Widget Visibility Panel

Accessed via the **Grid Icon** (⊞) in the top navbar.

- Toggle any widget visible or hidden using the Eye icon button.
- Widget order can be re-arranged (drag-to-reorder in v2).
- Preferences auto-saved to `localStorage` key: `dashboard_widget_config`.
- **Reset** button reverts all widgets to default visibility and order.

**Managed Widget IDs:**
| ID | Widget Label |
|----|-------------|
| `kpi-cards` | KPI Cards |
| `analytics-charts` | Analytics Charts |
| `activity-feed` | Activity Feed |
| `announcements` | Announcement Panel |
| `calendar` | Calendar Widget |
| `quick-notes` | Quick Notes |
| `pinned-shortcuts` | Pinned Shortcuts |
| `ai-insights` | AI Insights (Coming Soon) |

---

## 2. Command Palette (Ctrl+K / ⌘K)

Triggered by `Ctrl+K` (Windows/Linux) or `⌘K` (macOS), or by clicking:
- The search bar in the top navbar
- The floating purple **Command** button (bottom-right corner)

**Features:**
- Fuzzy search across Pages, Actions, Academics, Finance, Campus, Reports, Dashboards, and Settings.
- **Pinned Shortcuts:** Enroll Student, Collect Fee, View Reports — always visible without typing.
- **Recent Searches:** Last 5 searches auto-saved and shown on open.
- Grouped results by category with ChevronRight navigation hint.
- ESC to close.

---

## 3. Notification Center

Accessed via the **Bell Icon** (🔔) in the top navbar, showing an unread badge count.

**Categories:** Academic, Finance, Attendance, Library, Hostel, System  
**Features:**
- Category filter pills (All, Academic, Finance, etc.)
- Full-text search across notification titles and messages
- Mark all read / mark individual read (click to dismiss unread dot)
- Slide-in drawer with spring animation

---

## 4. Dashboard Settings Panel

Accessed via the **Settings Icon** (⚙) in the top navbar.

**Sections:**
- **Appearance Theme:** Light Mode / Dark Mode / System Default (persisted via `ThemeContext`)
- **Layout Density:** Comfortable / Compact (persisted to `localStorage` key: `dashboard_density`)
- **Language & Region:** English (India) — multi-language placeholder
- **Timezone:** Asia/Kolkata IST UTC+5:30 — auto-detected
- **Notification Preferences:** Toggle sliders per category

---

## 5. Quick Notes Widget

Persistent sticky notes saved to `localStorage` key: `dashboard_quick_notes`.  
- Press **Enter** or click **+** to add.  
- Color cycles through indigo → amber → emerald → purple.  
- Delete button on each note.

---

## 6. AI Insights Widget

Four **Coming Soon** placeholder cards:
1. **AI Attendance Predictor** — ML model to flag students at <75% attendance risk
2. **Fee Default Risk Scoring** — Intelligent pre-due-date risk scoring
3. **Student Academic Risk Alerts** — Multi-subject declining performance detection
4. **Institutional Trend Intelligence** — Admissions, retention, graduation prediction

Requires Gemini API integration. All cards labelled clearly with 🔒 Coming Soon badge.

---

## 7. Analytics Hub

6 backend-ready chart placeholder grids:
- Student Growth & Admissions
- Attendance Rate Analytics
- Fee Collection & Revenue
- Library Circulation Metrics
- Hostel Occupancy Trends
- Academic Result Distribution

---

## 8. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `⌘K` | Open Command Palette |
| `ESC` | Close any active overlay panel |

---

## 9. Accessibility (ARIA)

- `role="banner"` on top header
- `role="navigation"` + `aria-label` on sidebar
- `aria-label` on all icon-only buttons
- `aria-current="page"` on active sidebar links
- `role="dialog"` + `aria-modal="true"` on mobile nav drawer
- `id="main-content"` on main content area
- Focus management on Command Palette open (auto-focuses input)
