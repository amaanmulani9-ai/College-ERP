"""
Scholarship Validators
======================
- Duplicate application check (1 per type per student per session)
- Income eligibility check
- CGPA eligibility check
"""

import decimal
from typing import Optional


def validate_no_duplicate_application(student_id: str, scholarship_type_id: str, academic_session_id: str) -> None:
    """Ensure student hasn't already applied for the same scholarship type in this session."""
    from .models import ScholarshipApplication

    exists = ScholarshipApplication.objects.filter(
        student_id=student_id,
        scholarship_type_id=scholarship_type_id,
        academic_session_id=academic_session_id,
        status__in=["submitted", "under_review", "approved"],
    ).exists()
    if exists:
        raise ValueError("Student has already applied for this scholarship in the active session.")


def validate_no_duplicate_scholarship(student_id: str, scholarship_type_id: str, academic_session_id: str) -> None:
    """Ensure student doesn't have an active scholarship of this type in this session."""
    from .models import Scholarship

    exists = Scholarship.objects.filter(
        student_id=student_id,
        scholarship_type_id=scholarship_type_id,
        academic_session_id=academic_session_id,
        status="active",
    ).exists()
    if exists:
        raise ValueError("Student already holds an active scholarship of this type for this academic session.")


def validate_eligibility(
    cgpa: float,
    min_cgpa_req: float,
    family_income: Optional[decimal.Decimal] = None,
    max_income_req: Optional[decimal.Decimal] = None,
) -> None:
    """Verify CGPA and family income eligibility criteria."""
    if min_cgpa_req > 0 and cgpa < min_cgpa_req:
        raise ValueError(f"CGPA ({cgpa}) does not meet the minimum requirement of {min_cgpa_req}.")

    if max_income_req is not None and family_income is not None:
        if family_income > max_income_req:
            raise ValueError(f"Family income ({family_income}) exceeds the maximum cap of {max_income_req}.")
