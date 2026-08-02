# Fee Management System

## Overview

The Fee Management module handles the complete fee lifecycle for a college ERP — from defining fee structures and assigning fees to students, through collection with receipt generation, to outstanding reporting and fine calculation.

---

## Architecture

```
apps/fees/
├── models.py         – Data models
├── services.py       – Business logic (FeeService)
├── validators.py     – Fine calculation & duplicate checks
├── serializers.py    – DRF serializers & DTOs
├── permissions.py    – IsFeeOfficerOrAdmin
├── views.py          – ViewSets
├── urls.py           – URL routing
├── admin.py          – Django admin with inlines
├── signals.py        – Post-save balance sync
└── migrations/       – Database migrations
```

---

## Models

### FeeCategory
Defines type of fee (Tuition, Hostel, Library, etc.).
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | CharField | e.g., "Tuition Fee" |
| code | CharField | Unique, e.g., "TUITION" |
| is_active | BooleanField | Toggle visibility |

### FeeStructure
Maps fee amount to academic session, program, semester, and category.
| Field | Type | Notes |
|-------|------|-------|
| academic_session | FK(AcademicSession) | |
| program | FK(Program) | |
| semester | FK(Semester) | |
| category | FK(FeeCategory) | |
| amount | FloatField | Fee amount in INR |
| is_active | BooleanField | |

**Constraint**: `unique_together = (academic_session, program, semester, category)`

### StudentFee
Records fee assignment to a specific student.
| Field | Type | Notes |
|-------|------|-------|
| student | FK(Student) | |
| fee_structure | FK(FeeStructure) | PROTECT |
| total_amount | Float | Mirrors fee_structure.amount |
| waiver_amount | Float | Manual waiver |
| scholarship_amount | Float | Scholarship deduction |
| paid_amount | Float | Running paid sum |
| due_amount | Float | `total - waiver - scholarship - paid` |
| status | Choice | pending / partial / paid / overdue / waived |

**Net Total** = `total_amount - waiver_amount - scholarship_amount`

### FeeInstallment
Splits a StudentFee into n installments with independent due dates.
| Field | Type | Notes |
|-------|------|-------|
| student_fee | FK(StudentFee) | |
| installment_no | IntegerField | 1-indexed |
| amount | FloatField | Installment amount |
| due_date | DateField | Auto-calculated (30-day intervals) |
| fine_amount | FloatField | Calculated at payment time |
| status | Choice | pending / paid / overdue |

### FeeReceipt
Immutable payment record.
| Field | Type | Notes |
|-------|------|-------|
| receipt_number | CharField | Unique — `RCPT-{YEAR}-{HEX8}` |
| student | FK(Student) | |
| student_fee | FK(StudentFee) | |
| installment | FK(FeeInstallment) | Optional |
| payment_date | DateField | Auto set |
| amount | FloatField | Amount paid |
| payment_mode | Choice | cash / cheque / bank_transfer / upi / online / draft |
| status | Choice | success / cancelled / refunded |

### FeeAuditLog
Immutable audit trail for all fee events.

---

## Business Rules

1. **No duplicate assignment** — A student cannot have the same `FeeStructure` assigned twice.
2. **Net total** = `total_amount - waiver_amount - scholarship_amount`
3. **Fine calculation** — `amount × (fine_rate% / 100) × days_overdue`
4. **Overpayment blocked** — Payment cannot exceed `due_amount`.
5. **Receipt number** — Format: `RCPT-{YEAR}-{8-char-hex}`, guaranteed unique.
6. **Status auto-update** — Post-save signals sync `paid_amount`, `due_amount`, and `status` on `StudentFee` after every receipt.

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/fees/categories/` | List fee categories |
| POST | `/api/fees/categories/` | Create category |
| GET | `/api/fees/structures/` | List fee structures |
| POST | `/api/fees/structures/` | Create structure |
| POST | `/api/fees/assign/` | Assign fee to student |
| GET | `/api/fees/student/{id}/` | Student fee summary |
| POST | `/api/fees/pay/` | Collect fee & generate receipt |
| GET | `/api/fees/outstanding/` | Outstanding fees report |
| GET | `/api/fees/receipt/{id}/` | Get receipt detail |
| GET | `/api/fees/student-fees/` | List all student fees |
| GET | `/api/fees/installments/` | List installments |
| GET | `/api/fees/receipts/` | List receipts |

---

## Fee Assignment Request

```json
POST /api/fees/assign/
{
  "student_id": "uuid",
  "fee_structure_id": "uuid",
  "waiver_amount": 500.0,
  "scholarship_amount": 200.0,
  "num_installments": 3
}
```

---

## Fee Collection Request

```json
POST /api/fees/pay/
{
  "student_fee_id": "uuid",
  "amount": 5000.0,
  "payment_mode": "upi",
  "installment_id": "uuid",
  "remarks": "Semester 1 tuition"
}
```

---

## Fine Engine

Fine is calculated in `validators.calculate_fine()`:

```python
fine = amount × (fine_rate / 100) × days_overdue
```

- No fine if `today <= due_date`
- Default rate: 2% per day (configurable)

---

## Frontend Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/fees` | `FeeDashboardPage` | Stats + outstanding overview |
| `/fees/structure` | `FeeStructurePage` | Manage categories and structures |
| `/fees/collect` | `CollectFeePage` | Student search + payment collection |
| `/fees/outstanding` | `OutstandingReportPage` | Filterable report + CSV export |

---

## Permissions

`IsFeeOfficerOrAdmin` — requires `is_authenticated` AND (`is_staff` OR `is_superuser`).

---

## Tests

30 tests covering:
- Fine calculation edge cases
- Duplicate assignment prevention
- Overpayment blocking
- Serializer validation (positive amount)
- Receipt number uniqueness
- Signal logic
- Permission checks
- API view existence

Run: `pytest tests/test_fees.py -v`
