# Contributing to Enterprise College ERP

Thank you for contributing to the Enterprise College ERP platform! Please read these guidelines before submitting code.

---

## 1. Coding Standards

### Python / Django:
- Adhere to **PEP 8** standards.
- Keep business logic in `services.py`, NOT inside DRF views.
- Use explicit type annotations and docstrings for public functions.
- Enforce soft-deletion integrity (`is_deleted=True`) where appropriate.

### TypeScript / React:
- Use functional components with explicit TypeScript interfaces.
- Follow component-driven architecture with atomic styles (Tailwind CSS).
- Avoid inline `any` types. Define models in `services/`.

---

## 2. Folder Structure

```
College-ERP/
├── backend/
│   ├── apps/
│   │   ├── academics/
│   │   ├── authentication/
│   │   ├── core/
│   │   ├── profiles/
│   │   ├── rbac/
│   │   ├── staff/
│   │   ├── students/
│   │   └── tenancy/
│   └── config/
├── frontend/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       └── services/
├── docs/
├── scripts/
└── tests/
```

---

## 3. Branch & Commit Guidelines

- **Branch Naming**: `feat/feature-name` or `fix/bug-description`.
- **Commit Format**: Conventional commits (`feat: ...`, `fix: ...`, `docs: ...`).

---

## 4. Testing Requirements

- Maintain **80%+ test coverage** across all modules.
- Run `pytest` and specific module verification scripts before opening PRs:
  ```bash
  python -m pytest tests/
  python scripts/verify_task8.py
  ```
