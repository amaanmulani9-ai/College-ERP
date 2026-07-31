"""
Admissions Workflow Engine.
Encapsulates workflow state definitions, allowed forward & rollback state transitions,
and event publishing hooks.
"""
from typing import Dict, Set

# Workflow States
DRAFT = "draft"
SUBMITTED = "submitted"
UNDER_REVIEW = "under_review"
DOCUMENT_VERIFICATION = "document_verification"
ENTRANCE_TEST = "entrance_test"
INTERVIEW = "interview"
APPROVED = "approved"
REJECTED = "rejected"
WAITLISTED = "waitlisted"
ENROLLED = "enrolled"
CANCELLED = "cancelled"

WORKFLOW_STATES = [
    DRAFT,
    SUBMITTED,
    UNDER_REVIEW,
    DOCUMENT_VERIFICATION,
    ENTRANCE_TEST,
    INTERVIEW,
    APPROVED,
    REJECTED,
    WAITLISTED,
    ENROLLED,
    CANCELLED,
]

VALID_TRANSITIONS: Dict[str, Set[str]] = {
    DRAFT:                  {SUBMITTED, CANCELLED},
    SUBMITTED:              {UNDER_REVIEW, CANCELLED},
    UNDER_REVIEW:           {DOCUMENT_VERIFICATION, ENTRANCE_TEST, REJECTED, CANCELLED},
    DOCUMENT_VERIFICATION:  {ENTRANCE_TEST, INTERVIEW, APPROVED, REJECTED, CANCELLED},
    ENTRANCE_TEST:          {INTERVIEW, APPROVED, REJECTED, WAITLISTED, CANCELLED},
    INTERVIEW:              {APPROVED, REJECTED, WAITLISTED, CANCELLED},
    APPROVED:               {ENROLLED, CANCELLED},
    REJECTED:               set(),
    WAITLISTED:             {APPROVED, REJECTED, CANCELLED},
    ENROLLED:               set(),
    CANCELLED:              set(),
}


def is_valid_transition(current_state: str, target_state: str) -> bool:
    """Check if state transition is allowed in the forward state machine."""
    allowed = VALID_TRANSITIONS.get(current_state, set())
    return target_state in allowed
