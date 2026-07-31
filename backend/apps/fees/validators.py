"""
Fee Validators & Fine Rules Engine.
Enforces:
 - No duplicate fee assignment for student and fee structure
 - Fine calculation rules for overdue installments
"""
import datetime


def calculate_installment_fine(due_date: datetime.date, payment_date: datetime.date = None, fine_per_day: float = 5.0) -> float:
    """
    Calculates overdue fine amount based on days late past due date.
    """
    if not payment_date:
        payment_date = datetime.date.today()

    if payment_date > due_date:
        days_overdue = (payment_date - due_date).days
        return round(days_overdue * fine_per_day, 2)
    return 0.0


def validate_no_duplicate_assignment(student_id: str, fee_structure_id: str):
    from .models import StudentFee
    if StudentFee.objects.filter(student_id=student_id, fee_structure_id=fee_structure_id, is_deleted=False).exists():
        raise ValueError("Fee structure is already assigned to this student.")


def calculate_fine(amount: float, due_date: datetime.date, fine_rate: float = 2.0) -> float:
    """
    Calculates overdue fine amount based on percentage rate per day.
    fine = amount * (fine_rate / 100) * days_overdue
    """
    today = datetime.date.today()
    if today > due_date:
        days_overdue = (today - due_date).days
        return round(amount * (fine_rate / 100) * days_overdue, 2)
    return 0.0
