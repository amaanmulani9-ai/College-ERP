# REST API Overview & Endpoints

> **API Base URL**: `/api/v1/`  

---

## Primary API Endpoints

| Category | Route | Methods | Description |
|---|---|---|---|
| **Authentication** | `/api/v1/auth/login/` | `POST` | User authentication & JWT token issuance |
| **Admissions** | `/api/v1/admissions/applications/` | `GET`, `POST` | Student application processing |
| **Academics** | `/api/v1/academics/courses/` | `GET`, `POST` | Course catalog management |
| **Examinations** | `/api/v1/examinations/schedules/` | `GET`, `POST` | Exam schedule & grade entry |
| **Fees & Payments** | `/api/v1/fees/collections/` | `GET`, `POST` | Student fee ledger & payments |
| **Hostels** | `/api/v1/hostel/allocations/` | `GET`, `POST` | Room allocation & gate passes |
| **Library** | `/api/v1/library/borrowings/` | `GET`, `POST` | Book loans & fine tracking |
| **Transport** | `/api/v1/transport/routes/` | `GET`, `POST` | Bus route tracking & passes |
| **Reporting** | `/api/v1/reporting/generate/` | `POST` | Dynamic report compilation |
