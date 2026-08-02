import datetime

from apps.authentication.services import log_audit_event

from .models import Employee, EmployeeStatusHistory


def generate_employee_code():
    """Generates unique Employee ID in format: EMP-{YEAR}-{SEQUENCE:05d}."""
    current_year = datetime.date.today().year
    prefix = f"EMP-{current_year}-"

    last_employee = Employee.all_objects.filter(employee_id__startswith=prefix).order_by("-employee_id").first()
    if last_employee:
        try:
            last_seq = int(last_employee.employee_id.split("-")[-1])
            seq = last_seq + 1
        except (ValueError, IndexError):
            seq = 1
    else:
        seq = 1

    return f"{prefix}{seq:05d}"


def transition_employee_status(employee, new_status, actor=None, reason="", request=None):
    if employee.employment_status == new_status:
        return employee

    prev_status = employee.employment_status
    employee.employment_status = new_status
    employee.save(update_fields=["employment_status", "updated_at"])

    # Record status history
    EmployeeStatusHistory.objects.create(
        employee=employee,
        previous_status=prev_status,
        new_status=new_status,
        changed_by=actor,
        reason=reason,
    )

    if request:
        log_audit_event(
            request,
            event_type="employee_status_changed",
            user=actor or request.user,
            details={
                "employee_id": employee.employee_id,
                "previous_status": prev_status,
                "new_status": new_status,
                "reason": reason,
            },
        )
    return employee


def suspend_employee(employee, reason, actor=None, request=None):
    return transition_employee_status(employee, "suspended", actor=actor, reason=reason, request=request)


def reinstate_employee(employee, actor=None, request=None):
    return transition_employee_status(employee, "active", actor=actor, reason="Reinstated active duty", request=request)


def resign_employee(employee, reason, actor=None, request=None):
    return transition_employee_status(employee, "resigned", actor=actor, reason=reason, request=request)


def retire_employee(employee, actor=None, request=None):
    return transition_employee_status(
        employee, "retired", actor=actor, reason="Superannuation retirement", request=request
    )


def terminate_employee(employee, reason, actor=None, request=None):
    return transition_employee_status(employee, "terminated", actor=actor, reason=reason, request=request)


def soft_delete_employee(employee, actor=None, request=None):
    employee.is_deleted = True
    employee.save(update_fields=["is_deleted", "updated_at"])
    if request:
        log_audit_event(
            request,
            event_type="employee_deleted",
            user=actor or request.user,
            details={"employee_id": employee.employee_id},
        )
    return True


def restore_employee(employee, actor=None, request=None):
    employee.is_deleted = False
    employee.save(update_fields=["is_deleted", "updated_at"])
    if request:
        log_audit_event(
            request,
            event_type="employee_restored",
            user=actor or request.user,
            details={"employee_id": employee.employee_id},
        )
    return employee
