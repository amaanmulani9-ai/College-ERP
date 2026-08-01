import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class EnterprisePasswordValidator:
    """Enforces enterprise password strength policy:
    - Minimum length: 8
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    - At least 1 special character
    """

    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(
                _("Password must be at least 8 characters long."),
                code="password_too_short",
            )
        if not re.search(r"[A-Z]", password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter (A-Z)."),
                code="password_no_upper",
            )
        if not re.search(r"[a-z]", password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter (a-z)."),
                code="password_no_lower",
            )
        if not re.search(r"[0-9]", password):
            raise ValidationError(
                _("Password must contain at least one numerical digit (0-9)."),
                code="password_no_number",
            )
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", password):
            raise ValidationError(
                _("Password must contain at least one special character."),
                code="password_no_symbol",
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 8 characters, including uppercase, lowercase, numbers, and special symbols."
        )
