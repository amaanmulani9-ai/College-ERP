# Autonomous Loop Runbook

## Configuration

- **Pattern**: Sequential (Simple iterative pipeline)
- **Mode**: Safe (Strict quality gates and checkpoints)
- **Target Branch**: main
- **Repository State**: Clean

## Required Safety Checks (Safe Mode)

- [x] Version control clean state verified
- [ ] Tests pass before first loop iteration
- [ ] ECC_HOOK_PROFILE enabled
- [ ] Explicit stop condition defined

## Next Steps

To begin the loop execution, please define the **Target Goal** or **Stop Condition** (e.g., "Build the missing 'Manage Families' UI and stop when tests pass").

Once defined, we will begin the iterative `plan -> test -> implement -> review -> commit` cycle.
