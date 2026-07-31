# Git Workflow & Release Strategy

This document outlines the standard Git branching, commit, tagging, release, and rollback workflows enforced for the Enterprise College ERP repository.

---

## 1. Branching Strategy

We follow a modified **Git Flow / GitHub Flow** model:

- **`main`**: Production-ready release branch. Every commit on `main` must pass all verification test suites.
- **`develop`**: Integration branch for ongoing feature modules.
- **`feature/<task-id>-<description>`**: Short-lived feature branches (e.g. `feature/task-009-admissions`).
- **`bugfix/<issue-id>-<description>`**: Patch branches for bug fixes.
- **`release/vX.Y.Z`**: Release preparation branch.

---

## 2. Commit Message Conventions

Commit messages must follow the **Conventional Commits** standard:

```
<type>(<scope>): <description>

[optional body]
```

### Types:
- `feat`: A new feature module or business capability.
- `fix`: A bug fix.
- `docs`: Documentation updates only.
- `style`: Code style changes (formatting, missing semi-colons, etc.).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing unit/integration tests or updating existing tests.
- `chore`: Build process, dependencies, or auxiliary tool updates.

**Example**:
```bash
git commit -m "feat(students): implement student status history audit trail"
```

---

## 3. Tagging & Release Conventions

Release tags follow **Semantic Versioning (`vMAJOR.MINOR.PATCH`)**:

- **Major (`v1.0.0`)**: Production release with complete core ERP modules.
- **Minor (`v0.8.0`)**: Milestone milestone containing new modules.
- **Patch (`v0.8.1`)**: Critical hotfix or security patch.

### Tag Creation Command:
```bash
git tag -a v0.8.0 -m "Enterprise ERP Foundation Release"
git push origin v0.8.0
```

---

## 4. Rollback Strategy

If a critical issue is discovered post-deployment:

1. **Hotfix Rollback**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
2. **Tag Rollback**:
   Re-deploy the previous tagged stable release (e.g., `v0.7.0`) via CI/CD pipeline while preparing a patch release (`v0.8.1`).

---

## 5. Pull Request Checklist

Before submitting a Pull Request (PR):

- [ ] All automated unit & integration test suites pass (`pytest`, `verify_taskX.py`).
- [ ] No hardcoded secrets or credentials (`.env` ignored).
- [ ] Code follows project coding standards (flake8 / prettier).
- [ ] Relevant documentation updated in `docs/`.
