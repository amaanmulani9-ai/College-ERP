"""
Admissions service layer — application lifecycle, workflow transitions,
document review, seat allocation, and enrollment orchestration.

All business logic lives here.  Views are thin wrappers.
"""
import datetime

from django.db import transaction
from django.utils import timezone

from apps.authentication.models import User
from apps.authentication.services import log_audit_event
from apps.profiles.models import UserProfile
from apps.students.models import Student
from apps.students.services import generate_student_code
from apps.parents.services import create_parent, link_student_to_parent

from .models import (
    AdmissionApplication,
    AdmissionAuditLog,
    AdmissionDocument,
    ApplicationStatusHistory,
    SeatMatrix,
)


# ──────────────────────────────────────────────────────────────────────────────
# Valid workflow transitions  (from → {to, …})
# ──────────────────────────────────────────────────────────────────────────────

VALID_TRANSITIONS: dict[str, set[str]] = {
    "draft":                  {"submitted", "cancelled"},
    "submitted":              {"under_review", "cancelled"},
    "under_review":           {"document_verification", "rejected", "cancelled"},
    "document_verification":  {"interview", "approved", "rejected", "cancelled"},
    "interview":              {"approved", "rejected", "waitlisted", "cancelled"},
    "approved":               {"enrolled", "cancelled"},
    "rejected":               set(),
    "waitlisted":             {"approved", "rejected", "cancelled"},
    "enrolled":               set(),
    "cancelled":              set(),
}


# ──────────────────────────────────────────────────────────────────────────────
# Application number generation
# ──────────────────────────────────────────────────────────────────────────────

def generate_application_number() -> str:
    """Generate ADM-{YEAR}-{SEQUENCE:06d}."""
    year = datetime.date.today().year
    prefix = f"ADM-{year}-"
    last = (
        AdmissionApplication.all_objects
        .filter(application_number__startswith=prefix)
        .order_by("-application_number")
        .first()
    )
    if last:
        try:
            seq = int(last.application_number.split("-")[-1]) + 1
        except (ValueError, IndexError):
            seq = 1
    else:
        seq = 1
    return f"{prefix}{seq:06d}"


# ──────────────────────────────────────────────────────────────────────────────
# CRUD helpers
# ──────────────────────────────────────────────────────────────────────────────

def create_application(data: dict, actor=None, request=None) -> AdmissionApplication:
    """Create a new admission application with auto-generated number."""
    app_number = generate_application_number()
    application = AdmissionApplication.objects.create(
        application_number=app_number,
        **data,
    )
    _audit(application, actor, "application_created",
           f"Application {app_number} created", request=request)
    return application


def soft_delete_application(application, actor=None, request=None):
    application.is_deleted = True
    application.save(update_fields=["is_deleted", "updated_at"])
    _audit(application, actor, "application_deleted",
           f"Application {application.application_number} soft-deleted", request=request)


def restore_application(application, actor=None, request=None):
    application.is_deleted = False
    application.save(update_fields=["is_deleted", "updated_at"])
    _audit(application, actor, "application_restored",
           f"Application {application.application_number} restored", request=request)
    return application


# ──────────────────────────────────────────────────────────────────────────────
# Workflow transitions
# ──────────────────────────────────────────────────────────────────────────────

def transition_application(
    application: AdmissionApplication,
    new_status: str,
    actor=None,
    remarks: str = "",
    request=None,
) -> AdmissionApplication:
    """Advance the application through the state machine.

    Raises ValueError on illegal transitions.
    """
    current = application.status
    allowed = VALID_TRANSITIONS.get(current, set())
    if new_status not in allowed:
        raise ValueError(
            f"Cannot transition from '{current}' to '{new_status}'. "
            f"Allowed targets: {allowed or '(none — terminal state)'}."
        )

    prev = current
    application.status = new_status
    application.save(update_fields=["status", "updated_at"])

    ApplicationStatusHistory.objects.create(
        application=application,
        previous_status=prev,
        new_status=new_status,
        changed_by=actor,
        remarks=remarks,
    )

    event = "status_changed"
    if new_status == "approved":
        event = "application_approved"
    elif new_status == "rejected":
        event = "application_rejected"

    _audit(application, actor, event,
           f"{application.application_number}: {prev} → {new_status}",
           metadata={"prev": prev, "new": new_status, "remarks": remarks},
           request=request)

    return application


# Convenience wrappers

def submit_application(app, actor=None, request=None):
    return transition_application(app, "submitted", actor=actor, remarks="Application submitted", request=request)

def start_review(app, actor=None, request=None):
    return transition_application(app, "under_review", actor=actor, remarks="Review started", request=request)

def start_document_verification(app, actor=None, request=None):
    return transition_application(app, "document_verification", actor=actor, remarks="Document verification started", request=request)

def schedule_interview(app, actor=None, request=None):
    return transition_application(app, "interview", actor=actor, remarks="Interview scheduled", request=request)

def approve_application(app, actor=None, remarks="", request=None):
    return transition_application(app, "approved", actor=actor, remarks=remarks or "Application approved", request=request)

def reject_application(app, actor=None, remarks="", request=None):
    return transition_application(app, "rejected", actor=actor, remarks=remarks or "Application rejected", request=request)

def waitlist_application(app, actor=None, remarks="", request=None):
    return transition_application(app, "waitlisted", actor=actor, remarks=remarks or "Placed on waitlist", request=request)

def cancel_application(app, actor=None, remarks="", request=None):
    return transition_application(app, "cancelled", actor=actor, remarks=remarks or "Application cancelled", request=request)


# ──────────────────────────────────────────────────────────────────────────────
# Document review
# ──────────────────────────────────────────────────────────────────────────────

def review_document(
    document: AdmissionDocument,
    new_status: str,
    actor=None,
    remarks: str = "",
    request=None,
) -> AdmissionDocument:
    document.review_status = new_status
    document.reviewed_by = actor
    document.review_remarks = remarks
    document.reviewed_at = timezone.now()
    document.save(update_fields=[
        "review_status", "reviewed_by", "review_remarks", "reviewed_at",
    ])

    event = "document_approved" if new_status == "approved" else "document_rejected"
    _audit(document.application, actor, event,
           f"{document.get_document_type_display()} {new_status}",
           metadata={"document_id": str(document.id), "remarks": remarks},
           request=request)

    return document


# ──────────────────────────────────────────────────────────────────────────────
# Seat allocation
# ──────────────────────────────────────────────────────────────────────────────

def check_seat_availability(program, academic_session, category: str) -> int:
    """Return available seats for the given combination, or -1 if no matrix."""
    try:
        matrix = SeatMatrix.objects.get(
            program=program, academic_session=academic_session, category=category,
        )
        return matrix.available_seats
    except SeatMatrix.DoesNotExist:
        return -1  # no matrix → unlimited (institution hasn't configured limits)


def allocate_seat(application: AdmissionApplication, actor=None, request=None) -> bool:
    """Decrement available seats.  Returns True on success, raises ValueError if full."""
    try:
        matrix = SeatMatrix.objects.select_for_update().get(
            program=application.program,
            academic_session=application.academic_session,
            category=application.category,
        )
    except SeatMatrix.DoesNotExist:
        # No matrix configured → treat as unlimited
        return True

    if matrix.available_seats <= 0:
        raise ValueError("No available seats for this program/session/category combination.")

    matrix.occupied_seats += 1
    matrix.save(update_fields=["occupied_seats"])

    _audit(application, actor, "seat_allocated",
           f"Seat allocated in {matrix}",
           metadata={"matrix_id": str(matrix.id), "occupied": matrix.occupied_seats},
           request=request)

    return True


# ──────────────────────────────────────────────────────────────────────────────
# Enrollment workflow  (the big one)
# ──────────────────────────────────────────────────────────────────────────────

@transaction.atomic
def enroll_application(
    application: AdmissionApplication,
    actor=None,
    request=None,
) -> Student:
    """
    Orchestrates the full enrollment pipeline:
      1. Validate application is in 'approved' state
      2. Check seat availability
      3. Allocate seat
      4. Create User account
      5. Create UserProfile
      6. Create Student record
      7. Optionally create Parent & link
      8. Transition to 'enrolled'
    Uses existing services — no duplicate logic.
    """
    if application.status != "approved":
        raise ValueError("Only 'approved' applications can be enrolled.")

    if application.enrolled_student is not None:
        raise ValueError("Application is already enrolled.")

    # ── Seat check ──
    allocate_seat(application, actor=actor, request=request)

    # ── 1. Create User ──
    user = User.objects.create_user(
        email=application.email,
        password="StudentPassword123!",
        first_name=application.first_name,
        last_name=application.last_name,
    )

    # ── 2. Create Profile ──
    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            "first_name": application.first_name,
            "middle_name": application.middle_name,
            "last_name": application.last_name,
            "gender": application.gender,
            "date_of_birth": application.date_of_birth,
            "nationality": application.nationality,
        },
    )

    # ── 3. Create Student  ──
    # Resolve the first semester of the program
    first_semester = application.program.semesters.order_by("semester_number").first()
    if first_semester is None:
        raise ValueError(
            f"Program '{application.program.name}' has no semesters defined. "
            "Cannot create student without a semester."
        )

    student_id = generate_student_code(program_code=application.program.code)
    student = Student.objects.create(
        student_id=student_id,
        enrollment_number=application.application_number,
        profile=profile,
        program=application.program,
        department=application.department,
        current_semester=first_semester,
        academic_session=application.academic_session,
        admission_date=datetime.date.today(),
        status="active",
        category=application.category,
        nationality=application.nationality,
        guardian_name=application.guardian_name,
        guardian_phone=application.guardian_phone,
    )

    _audit(application, actor, "student_created",
           f"Student {student.student_id} created from {application.application_number}",
           metadata={"student_pk": str(student.id)},
           request=request)

    # ── 4. Create Parent & link (if guardian data provided) ──
    if application.guardian_email:
        try:
            parent_user = User.objects.create_user(
                email=application.guardian_email,
                password="ParentPassword123!",
                first_name=application.guardian_name.split()[0] if application.guardian_name else "Guardian",
                last_name=application.guardian_name.split()[-1] if application.guardian_name and " " in application.guardian_name else "",
            )
            parent_profile, _ = UserProfile.objects.get_or_create(
                user=parent_user,
                defaults={
                    "first_name": parent_user.first_name,
                    "last_name": parent_user.last_name,
                },
            )
            parent = create_parent(
                profile=parent_profile,
                relationship_type=application.guardian_relationship or "guardian",
            )
            link_student_to_parent(
                parent=parent,
                student=student,
                is_primary=True,
                is_emergency=True,
                actor=actor,
                request=request,
            )
            _audit(application, actor, "parent_linked",
                   f"Parent {parent.parent_code} linked to {student.student_id}",
                   metadata={"parent_pk": str(parent.id)},
                   request=request)
        except Exception:
            pass  # Guardian creation is best-effort — don't block enrollment

    # ── 5. Mark enrolled ──
    application.enrolled_student = student
    application.save(update_fields=["enrolled_student", "updated_at"])
    transition_application(application, "enrolled", actor=actor,
                           remarks="Enrollment completed", request=request)

    _audit(application, actor, "enrollment_completed",
           f"Enrollment completed: {application.application_number} → {student.student_id}",
           metadata={"student_id": student.student_id},
           request=request)

    return student


# ──────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ──────────────────────────────────────────────────────────────────────────────

def _audit(
    application: AdmissionApplication,
    actor,
    event_type: str,
    description: str,
    metadata: dict | None = None,
    request=None,
) -> AdmissionAuditLog:
    ip = None
    if request:
        ip = _get_ip(request)
        try:
            log_audit_event(request, event_type=f"admission_{event_type}", details=description)
        except Exception:
            pass

    return AdmissionAuditLog.objects.create(
        application=application,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
        ip_address=ip,
    )


def _get_ip(request) -> str | None:
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
