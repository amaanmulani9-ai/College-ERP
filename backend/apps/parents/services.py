import random
import string
from django.utils import timezone
from apps.authentication.services import log_audit_event
from .models import (
    Parent,
    ParentActivityLog,
    ParentCommunicationPreference,
    StudentParentLink,
)


# ---------------------------------------------------------------------------
# Code generation
# ---------------------------------------------------------------------------

def generate_parent_code() -> str:
    """Generate a unique PAR-XXXXXXXX code for a parent."""
    while True:
        suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        code = f"PAR-{suffix}"
        if not Parent.all_objects.filter(parent_code=code).exists():
            return code


# ---------------------------------------------------------------------------
# Parent lifecycle
# ---------------------------------------------------------------------------

def create_parent(profile, relationship_type="guardian", **kwargs) -> Parent:
    """Create a Parent record with auto-generated code and default comm prefs."""
    code = generate_parent_code()
    parent = Parent.objects.create(
        profile=profile,
        parent_code=code,
        relationship_type=relationship_type,
        **kwargs,
    )
    # Create default communication preferences
    ParentCommunicationPreference.objects.get_or_create(parent=parent)

    _log(parent, None, "created", "Parent profile created")
    return parent


def verify_parent(parent: Parent, actor, request=None) -> Parent:
    """Mark a parent as verified."""
    parent.is_verified = True
    parent.verified_at = timezone.now()
    parent.verified_by = actor
    parent.save(update_fields=["is_verified", "verified_at", "verified_by", "updated_at"])
    _log(parent, actor, "verified", f"Parent verified by {actor.email}", request=request)
    return parent


def soft_delete_parent(parent: Parent, actor=None, request=None) -> Parent:
    """Soft delete a parent."""
    parent.is_deleted = True
    parent.save(update_fields=["is_deleted", "updated_at"])
    _log(parent, actor, "deleted", "Parent profile soft deleted", request=request)
    return parent


def restore_parent(parent: Parent, actor=None, request=None) -> Parent:
    """Restore a soft-deleted parent."""
    parent.is_deleted = False
    parent.save(update_fields=["is_deleted", "updated_at"])
    _log(parent, actor, "restored", "Parent profile restored", request=request)
    return parent


# ---------------------------------------------------------------------------
# Student ↔ Parent links
# ---------------------------------------------------------------------------

def link_student_to_parent(
    parent: Parent,
    student,
    is_primary: bool = False,
    is_emergency: bool = False,
    can_pickup: bool = True,
    notes: str = "",
    actor=None,
    request=None,
) -> StudentParentLink:
    """Create or update a student–parent link."""
    link, created = StudentParentLink.objects.get_or_create(
        parent=parent,
        student=student,
        defaults={
            "is_primary_contact": is_primary,
            "is_emergency_contact": is_emergency,
            "can_pickup": can_pickup,
            "notes": notes,
        },
    )
    if not created:
        link.is_primary_contact = is_primary
        link.is_emergency_contact = is_emergency
        link.can_pickup = can_pickup
        link.notes = notes
        link.save()

    action = "link_added" if created else "link_added"
    _log(
        parent,
        actor,
        action,
        f"Student {student.student_id} linked to parent {parent.parent_code}",
        metadata={"student_id": str(student.id), "is_primary": is_primary},
        request=request,
    )
    return link


def unlink_student_from_parent(
    parent: Parent, student, actor=None, request=None
) -> None:
    """Remove a student–parent link."""
    StudentParentLink.objects.filter(parent=parent, student=student).delete()
    _log(
        parent,
        actor,
        "link_removed",
        f"Student {student.student_id} unlinked from parent {parent.parent_code}",
        metadata={"student_id": str(student.id)},
        request=request,
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _log(
    parent: Parent,
    actor,
    activity_type: str,
    description: str,
    metadata: dict | None = None,
    request=None,
) -> ParentActivityLog:
    ip = None
    if request:
        ip = _get_client_ip(request)
        try:
            log_audit_event(request, event_type=f"parent_{activity_type}", details=description)
        except Exception:
            pass

    return ParentActivityLog.objects.create(
        parent=parent,
        actor=actor,
        activity_type=activity_type,
        description=description,
        metadata=metadata or {},
        ip_address=ip,
    )


def _get_client_ip(request) -> str | None:
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
