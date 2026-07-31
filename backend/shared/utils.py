"""Shared utility functions and helpers for backend modules."""

def format_tenant_schema_name(identifier: str) -> str:
    """Sanitizes college identifier for PostgreSQL schema name."""
    clean = "".join(c if c.isalnum() else "_" for c in identifier.lower())
    return f"tenant_{clean}"
