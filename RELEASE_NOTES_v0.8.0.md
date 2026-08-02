# Release Notes: Enterprise College ERP v0.8.0

We are proud to announce the official **v0.8.0 Foundation Release** of the Enterprise College ERP platform! This milestone completes the core platform foundation, tenant isolation, authentication, RBAC authorization, profile management, academic structure modeling, student directory, and staff management system.

---

## 🌟 Highlights

- **Schema-Based Multi-Tenancy**: Built with `django-tenants` for complete PostgreSQL schema isolation per educational institution.
- **Enterprise Authentication & Security**: JWT token rotation, 5-attempt brute force lockout protection, token blacklisting, and audit logging.
- **Dynamic RBAC Engine**: 14 default institutional roles seeded automatically per tenant with Redis permission caching.
- **Academic Structure Engine**: Multi-tiered hierarchy modeling (Faculty -> Department -> Program -> Semester -> Subject -> Subject Offering) with soft deletion safeguards.
- **Student Management System**: Automated Student ID formula (`ERP-YEAR-PROGRAM-SEQUENCE`), status transition history, and academic mapping.
- **Staff & HR Management**: Automated Employee ID formula (`EMP-YEAR-SEQUENCE`), designation rank management, and employment status auditing.

---

## 🔒 Security & Architecture Improvements

- **Input Validation & File Upload Safeguards**: MultiPart profile avatar upload validation restricting files to 5MB max and strictly checking MIME types.
- **Cross-Tenant Access Prevention**: Enforced schema-level separation prohibiting cross-tenant data leakage.
- **Soft Delete Integrity Protection**: Parent entities with active child records cannot be accidentally deleted.

---

## 🚀 Module Overview

### 1. Security & Authentication (`apps/authentication` & `apps/rbac`)
- JWT Access & Refresh token rotation
- Permission matrix endpoints and Redis caching layer

### 2. Identity & User Profile (`apps/profiles`)
- Centralized identity profile with preferences, contact info, and dynamic completion percentage calculation

### 3. Academic Engine (`apps/academics`)
- Faculties, Departments, Degree Programs, Academic Sessions, Semesters, Subjects Catalog, and Session Offerings

### 4. Student Management (`apps/students`)
- Student onboarding, auto ID generation, guardian contacts, and status lifecycle auditing (`applicant`, `active`, `suspended`, `graduated`, `withdrawn`, `alumni`)

### 5. Staff Management (`apps/staff`)
- Employee onboarding, designation rank catalog, work contact info, and status lifecycle auditing (`active`, `on_leave`, `suspended`, `resigned`, `retired`, `terminated`)

---

## 📌 Known Limitations & Next Milestone

- **Bulk Import/Export**: Currently provides API endpoints and UI placeholders for CSV batch operations; full streaming CSV parser will be connected in TASK-009.
- **Next Milestone (v0.9.0)**: TASK-009 Admissions Workflow & Application Processing Engine.
