"""
Result Validators & Grade Rule Calculations.
Enforces:
 - Marks do not exceed maximum values in scheme
 - Results cannot be published prior to verification
"""

from typing import Tuple


def calculate_grade_and_points(percentage: float) -> Tuple[str, float]:
    """
    Standard Grading System:
     >= 90% -> A+ (10.0)
     >= 80% -> A  (9.0)
     >= 70% -> B+ (8.0)
     >= 60% -> B  (7.0)
     >= 50% -> C  (6.0)
     >= 40% -> D  (5.0)
     < 40%  -> F  (0.0)
    """
    if percentage >= 90.0:
        return "A+", 10.0
    elif percentage >= 80.0:
        return "A", 9.0
    elif percentage >= 70.0:
        return "B+", 8.0
    elif percentage >= 60.0:
        return "B", 7.0
    elif percentage >= 50.0:
        return "C", 6.0
    elif percentage >= 40.0:
        return "D", 5.0
    else:
        return "F", 0.0


def validate_marks_within_limits(
    internal: float,
    external: float,
    practical: float = 0.0,
    viva: float = 0.0,
    assignment: float = 0.0,
    scheme=None,
):
    """
    Validates that entered marks do not exceed scheme maximum boundaries.
    """
    if scheme:
        if internal > scheme.max_internal:
            raise ValueError(f"Internal marks ({internal}) exceed maximum ({scheme.max_internal}).")
        if external > scheme.max_external:
            raise ValueError(f"External marks ({external}) exceed maximum ({scheme.max_external}).")
        if practical > scheme.max_practical:
            raise ValueError(f"Practical marks ({practical}) exceed maximum ({scheme.max_practical}).")
        if viva > scheme.max_viva:
            raise ValueError(f"Viva marks ({viva}) exceed maximum ({scheme.max_viva}).")
        if assignment > scheme.max_assignment:
            raise ValueError(f"Assignment marks ({assignment}) exceed maximum ({scheme.max_assignment}).")
