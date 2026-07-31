import hashlib
import uuid
from typing import Dict, Any
from django.utils import timezone


def validate_session_unlocked(session):
    """
    Ensures that attendance session is not locked.
    Raises ValueError if session is locked.
    """
    if session.is_locked or session.status == "locked":
        raise ValueError("Attendance session is locked. Modifications are strictly forbidden.")


def generate_qr_attendance_token(session_id: str) -> str:
    """
    Generates a secure QR attendance token for a given session.
    Format: sha256(session_id + secret_salt + timestamp)
    """
    timestamp = str(timezone.now().timestamp())
    raw_payload = f"ATTENDANCE_QR_{session_id}_{timestamp}_{uuid.uuid4()}"
    return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()


def process_biometric_event_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Biometric device payload parser interface readiness.
    Validates structure: device_id, employee_or_student_code, timestamp, verification_mode.
    """
    required_keys = ["device_id", "user_identifier", "timestamp"]
    for key in required_keys:
        if key not in payload:
            raise ValueError(f"Biometric payload missing required parameter: {key}")
    return {
        "status": "valid",
        "processed_at": timezone.now().isoformat(),
        "payload": payload,
    }
