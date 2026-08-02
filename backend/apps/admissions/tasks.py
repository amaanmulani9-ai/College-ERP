"""
Admissions Background Tasks & Notification Event Hooks.
Defines placeholder event publishers for admission lifecycle milestones.
Do not send real emails/SMS yet; only publish event payloads to logs/event bus.
"""

import logging

logger = logging.getLogger("apps.admissions")


def publish_admission_event(event_type: str, application_id: str, payload: dict | None = None):
    """
    Publish an event hook for admissions milestones.
    Supported events:
      - admission_submitted
      - admission_approved
      - admission_rejected
      - admission_enrolled
    """
    logger.info(
        f"[ADMISSION_EVENT_HOOK] Event: {event_type} | Application ID: {application_id} | Payload: {payload or {}}"
    )
    return {
        "event_type": event_type,
        "application_id": application_id,
        "payload": payload or {},
        "status": "published",
    }
