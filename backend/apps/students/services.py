import datetime
from django.db import connection
from apps.authentication.services import log_audit_event
from .models import Student, StudentStatusHistory


def generate_student_code(program_code="GEN"):
    """Generates unique Student ID in format: ERP-{YEAR}-{PROGRAM_CODE}-{SEQUENCE:05d}."""
    current_year = datetime.date.today().year
    sanitized_program = "".join(filter(str.isalnum, program_code)).upper() or "GEN"
    prefix = f"ERP-{current_year}-{sanitized_program}-"

    last_student = Student.all_objects.filter(student_id__startswith=prefix).order_by("-student_id").first()
    if last_student:
        try:
            last_seq = int(last_student.student_id.split("-")[-1])
            seq = last_seq + 1
        except (ValueError, IndexError):
            seq = 1
    else:
        seq = 1

    return f"{prefix}{seq:05d}"


def transition_student_status(student, new_status, actor=None, reason="", request=None):
    if student.status == new_status:
        return student

    prev_status = student.status
    student.status = new_status
    student.save(update_fields=["status", "updated_at"])

    # Record status history
    StudentStatusHistory.objects.create(
        student=student,
        previous_status=prev_status,
        new_status=new_status,
        changed_by=actor,
        reason=reason,
    )

    if request:
        log_audit_event(
            request,
            event_type="student_status_changed",
            user=actor or request.user,
            details={
                "student_id": student.student_id,
                "previous_status": prev_status,
                "new_status": new_status,
                "reason": reason,
            },
        )
    return student


def suspend_student(student, reason, actor=None, request=None):
    return transition_student_status(student, "suspended", actor=actor, reason=reason, request=request)


def reinstate_student(student, actor=None, request=None):
    return transition_student_status(student, "active", actor=actor, reason="Reinstated active status", request=request)


def graduate_student(student, actor=None, request=None):
    return transition_student_status(student, "graduated", actor=actor, reason="Program completed & graduated", request=request)


def withdraw_student(student, reason, actor=None, request=None):
    return transition_student_status(student, "withdrawn", actor=actor, reason=reason, request=request)


def soft_delete_student(student, actor=None, request=None):
    student.is_deleted = True
    student.save(update_fields=["is_deleted", "updated_at"])
    if request:
        log_audit_event(request, event_type="student_deleted", user=actor or request.user, details={"student_id": student.student_id})
    return True


def restore_student(student, actor=None, request=None):
    student.is_deleted = False
    student.save(update_fields=["is_deleted", "updated_at"])
    if request:
        log_audit_event(request, event_type="student_restored", user=actor or request.user, details={"student_id": student.student_id})
    return student
