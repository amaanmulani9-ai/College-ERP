# Enterprise College ERP Suite

![Version](https://img.shields.io/badge/version-v1.0.0-indigo.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-emerald.svg?style=for-the-badge)
![Python](https://img.shields.io/badge/python-3.12-blue.svg?style=for-the-badge)
![Django](https://img.shields.io/badge/django-5.1-092E20.svg?style=for-the-badge)
![React](https://img.shields.io/badge/react-19.0-61DAFB.svg?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-5.7-3178C6.svg?style=for-the-badge)
![Vite](https://img.shields.io/badge/vite-6.0-646CFF.svg?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/postgresql-16.0-4169E1.svg?style=for-the-badge)

The **Enterprise College ERP Suite** is a modern, high-performance, multi-tenant SaaS platform built for higher education institutions, universities, and multi-campus collegiate systems.

---

## 🏛 Architecture Overview

```
                      +------------------------------------------+
                      |         Enterprise Web & PWA Client      |
                      |   React 19 · TypeScript 5.7 · Vite 6    |
                      +--------------------+---------------------+
                                           | REST API / JSON
                                           v
                      +--------------------+---------------------+
                      |         Django REST Framework API        |
                      |    Python 3.12 · Multi-Tenant Middleware |
                      +--------------------+---------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                 |                                 |
         v                                 v                                 v
+------------------+             +-------------------+             +-------------------+
|  PostgreSQL DB   |             |   Redis Cache &   |             |  Service Worker   |
| Multi-Tenancy    |             |  Celery Workers   |             |  Offline Action   |
| Schema Isolation |             |  Task Queues      |             |  PWA Queue        |
+------------------+             +-------------------+             +-------------------+
```

---

## 🚀 Key Modules & Capabilities

### 1. Backend ERP Core (30 Domain Applications)
- **Admissions & Enrollment**: Application tracking, document verification, entrance merit list calculation.
- **Academic Administration**: Departments, courses, curriculum trees, semester credits, prerequisites.
- **Examinations & Grading**: Exam scheduling, gradebook matrix, GPA/CGPA computation, transcript generation.
- **Finance & Fee Collection**: Fee structure configuration, online payment gateway, ledger entries, receipts.
- **Hostel & Housing**: Room allocation, warden management, mess billing, gate pass tracking.
- **Library Management**: Accession register, ISBN catalog, book issuance/returns, overdue fine calculation.
- **Faculty Load & HR**: Staff profiles, payroll processing, leave management, teaching workload distribution.
- **Transport & Logistics**: Vehicle fleet tracking, route management, student bus pass allocation.
- **IAM & Audit Trails**: Role-Based Access Control (RBAC), multi-tenancy isolation, detailed audit logs.

### 2. Desktop & Touch Workspace
- Touch-optimized tab workspace (`frontend/src/components/workspace/`).
- Docking side panels, recent items history, workspace favorites.
- Global Command Palette (<kbd>Ctrl+K</kbd> / <kbd>⌘K</kbd>) & Docked AI Assistant.

### 3. Reporting & Analytics
- Visual drag-and-drop report builder.
- Dynamic charts (Bar, Line, Pie, Area) with live filtering.
- Automated scheduled PDF, XLSX, and CSV report export & email distribution.

### 4. Progressive Web App (PWA) & Mobile Engine
- Standalone installable PWA (`frontend/src/mobile/pwa/`).
- Network RTT latency monitoring and offline banner notification.
- Offline action queue with automatic background synchronization upon reconnection.

### 5. Motion, State, & Accessibility Systems
- **Motion System** (`frontend/src/ux/motion/`): GPU-accelerated transition wrappers and micro-animations.
- **State System** (`frontend/src/ux/states/`): Standardized shimmer skeletons, empty states, and HTTP error recovery.
- **Accessibility System** (`frontend/src/ux/accessibility/`): WCAG 2.1 AA keyboard focus traps, ARIA live region announcements, and shortcut help overlays (<kbd>?</kbd>).

---

## ⚙️ Quick Start & Installation

### Prerequisites
- Python 3.12+
- Node.js 20+ & npm 10+
- PostgreSQL 16+ (or local SQLite for dev)

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
..\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup
```bash
npm install
npm run dev
```

---

## 🐳 Docker Deployment

```bash
# Build and launch complete stack with Docker Compose
docker-compose up --build -d
```

---

## 🧪 Testing & Verification

```bash
# Run Django backend checks & migrations test
cd backend
python manage.py check
python manage.py makemigrations --check

# Run Pytest suite (201 tests passing)
pytest

# Run Frontend TypeScript check & Production Build
cd ..
npx tsc --noEmit
npm run build
```

---

## 📄 License & Contributing

Distributed under the **MIT License**. See `LICENSE` for more information.

Contributions are welcome! Please read `CONTRIBUTING.md` and follow our `CODE_OF_CONDUCT.md`.
