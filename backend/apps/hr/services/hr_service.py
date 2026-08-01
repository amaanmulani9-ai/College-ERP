import uuid
from datetime import date
from django.db import transaction
from django.db.models import Count, Q
from apps.hr.models import (
    Department,
    Designation,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    RecruitmentJob,
    JobApplication,
    OfferLetter,
    EmployeeOnboarding,
    PerformanceReview,
    TrainingProgram,
    TrainingEnrollment,
    Promotion,
    Transfer,
    Resignation,
    ExitInterview,
    DisciplinaryAction,
    HRAuditLog,
)
from apps.staff.models import Employee


class HRService:
    @staticmethod
    def log_audit_event(action: str, performed_by=None, details=None):
        return HRAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {},
        )

    @staticmethod
    @transaction.atomic
    def submit_leave_request(employee_id: str, leave_type_id: str, start_date, end_date, reason: str, performed_by=None) -> LeaveRequest:
        leave_req = LeaveRequest.objects.create(
            employee_id=employee_id,
            leave_type_id=leave_type_id,
            start_date=start_date,
            end_date=end_date,
            reason=reason,
            status="pending",
        )
        HRService.log_audit_event("submit_leave_request", performed_by, {"leave_request_id": str(leave_req.id)})
        return leave_req

    @staticmethod
    @transaction.atomic
    def approve_leave_request(leave_request_id: str, approved_by=None) -> LeaveRequest:
        leave_req = LeaveRequest.objects.get(id=leave_request_id)
        leave_req.status = "approved"
        leave_req.approved_by = approved_by
        leave_req.save()

        # Update balance
        balance, _ = LeaveBalance.objects.get_or_create(
            employee=leave_req.employee,
            leave_type=leave_req.leave_type,
            defaults={"total_allocated": leave_req.leave_type.max_days_per_year, "used": 0, "remaining": leave_req.leave_type.max_days_per_year},
        )
        days = (leave_req.end_date - leave_req.start_date).days + 1
        balance.used += days
        balance.remaining = max(0, balance.total_allocated - balance.used)
        balance.save()

        HRService.log_audit_event("approve_leave_request", approved_by, {"leave_request_id": leave_request_id})
        return leave_req

    @staticmethod
    @transaction.atomic
    def promote_employee(employee_id: str, new_designation_id: str, effective_date=None, reason: str = "", performed_by=None) -> Promotion:
        employee = Employee.objects.get(id=employee_id)
        old_desig = employee.designation if isinstance(employee.designation, Designation) else None
        new_desig = Designation.objects.get(id=new_designation_id)

        promotion = Promotion.objects.create(
            employee=employee,
            old_designation=old_desig,
            new_designation=new_desig,
            effective_date=effective_date or date.today(),
            reason=reason,
        )

        HRService.log_audit_event("promote_employee", performed_by, {"employee_id": employee_id, "new_designation": new_desig.title})
        return promotion

    @staticmethod
    @transaction.atomic
    def transfer_employee(employee_id: str, new_department_id: str, reason: str = "", performed_by=None) -> Transfer:
        employee = Employee.objects.get(id=employee_id)
        old_dept = employee.department if isinstance(employee.department, Department) else None
        new_dept = Department.objects.get(id=new_department_id)

        transfer = Transfer.objects.create(
            employee=employee,
            old_department=old_dept,
            new_department=new_dept,
            reason=reason,
        )

        HRService.log_audit_event("transfer_employee", performed_by, {"employee_id": employee_id, "new_department": new_dept.department_name})
        return transfer

    @staticmethod
    def get_hr_dashboard_kpis() -> dict:
        total_employees = Employee.objects.count()
        active_jobs = RecruitmentJob.objects.filter(status="open").count()
        pending_leaves = LeaveRequest.objects.filter(status="pending").count()
        onboarding_in_progress = EmployeeOnboarding.objects.filter(completion_status="in_progress").count()
        open_disciplinary_actions = DisciplinaryAction.objects.filter(status="open").count()
        trainings_conducted = TrainingProgram.objects.count()

        return {
            "total_employees": total_employees,
            "active_job_openings": active_jobs,
            "pending_leave_requests": pending_leaves,
            "onboarding_in_progress": onboarding_in_progress,
            "open_disciplinary_actions": open_disciplinary_actions,
            "trainings_conducted": trainings_conducted,
        }
