"""
Result Business Services (ResultService).
Handles marks entry, automatic grade point & credit point computation, SGPA & CGPA calculation,
batch rank generation, result publishing, and audit logging.
"""
from typing import List, Dict, Any
from django.db import transaction
from django.db.models import Sum
from apps.authentication.services import log_audit_event

from .models import ResultAuditLog, ResultScheme, SemesterResult, StudentResult
from .validators import calculate_grade_and_points, validate_marks_within_limits


class ResultService:
    @staticmethod
    def calculate_grade(total_marks: float, max_marks: float = 100.0):
        percentage = (total_marks / max_marks * 100.0) if max_marks > 0 else 0.0
        return calculate_grade_and_points(percentage)

    @staticmethod
    @transaction.atomic
    def enter_marks(data: dict, actor=None, request=None) -> StudentResult:
        student_id = str(data["student"].id) if hasattr(data["student"], "id") else str(data["student"])
        subject_id = str(data["subject"].id) if hasattr(data["subject"], "id") else str(data["subject"])

        # Fetch ResultScheme if available
        scheme = ResultScheme.objects.filter(subject_id=subject_id).first()
        validate_marks_within_limits(
            internal=data.get("internal_marks", 0.0),
            external=data.get("external_marks", 0.0),
            practical=data.get("practical_marks", 0.0),
            viva=data.get("viva_marks", 0.0),
            assignment=data.get("assignment_marks", 0.0),
            scheme=scheme,
        )

        total_marks = (
            data.get("internal_marks", 0.0)
            + data.get("external_marks", 0.0)
            + data.get("practical_marks", 0.0)
            + data.get("viva_marks", 0.0)
            + data.get("assignment_marks", 0.0)
            + data.get("grace_marks", 0.0)
        )

        max_possible = (
            (scheme.max_internal + scheme.max_external + scheme.max_practical + scheme.max_viva + scheme.max_assignment)
            if scheme
            else 100.0
        )
        grade, grade_point = ResultService.calculate_grade(total_marks, max_possible)

        subject = data["subject"] if hasattr(data["subject"], "credits") else scheme.subject if scheme else None
        subject_credits = subject.credits if subject and hasattr(subject, "credits") else 4
        credit_point = round(grade_point * subject_credits, 2)

        data.update({
            "total_marks": total_marks,
            "grade": grade,
            "grade_point": grade_point,
            "credit_point": credit_point,
        })

        exam_val = data.get("exam", None)
        result, created = StudentResult.objects.update_or_create(
            student_id=student_id,
            subject_id=subject_id,
            exam=exam_val,
            defaults=data,
        )

        _log_audit(
            student_result=result,
            actor=actor,
            event_type="marks_entered" if created else "marks_updated",
            description=f"Marks saved for student {student_id} in {result.subject.code}: Grade {grade} ({total_marks} marks)",
            request=request,
        )
        return result

    @staticmethod
    @transaction.atomic
    def calculate_sgpa(student_id: str, semester_id: str) -> SemesterResult:
        results = StudentResult.objects.filter(
            student_id=student_id,
            subject__semester_id=semester_id,
            is_deleted=False,
        ).select_related("subject")

        if not results.exists():
            sem_res, _ = SemesterResult.objects.get_or_create(student_id=student_id, semester_id=semester_id)
            return sem_res

        total_credit_points = sum(r.credit_point for r in results)
        total_credits = sum(r.subject.credits for r in results)

        sgpa = round((total_credit_points / total_credits), 2) if total_credits > 0 else 0.0
        has_failed = any(r.grade == "F" for r in results)

        sem_res, _ = SemesterResult.objects.update_or_create(
            student_id=student_id,
            semester_id=semester_id,
            defaults={
                "sgpa": sgpa,
                "credits_earned": sum(r.subject.credits for r in results if r.grade != "F"),
                "total_credits": total_credits,
                "result_status": "fail" if has_failed else "pass",
            },
        )

        cgpa = ResultService.calculate_cgpa(student_id)
        sem_res.cgpa = cgpa
        return sem_res

    @staticmethod
    @transaction.atomic
    def calculate_cgpa(student_id: str) -> float:
        sem_results = SemesterResult.objects.filter(student_id=student_id, is_deleted=False)
        if not sem_results.exists():
            return 0.0

        total_points = sum(sr.sgpa * sr.total_credits for sr in sem_results if sr.total_credits > 0)
        total_credits = sum(sr.total_credits for sr in sem_results)

        cgpa = round((total_points / total_credits), 2) if total_credits > 0 else 0.0
        sem_results.update(cgpa=cgpa)
        return cgpa

    @staticmethod
    @transaction.atomic
    def generate_rank(semester_id: str) -> List[SemesterResult]:
        sem_results = list(
            SemesterResult.objects.filter(semester_id=semester_id, is_deleted=False).order_by("-sgpa", "-credits_earned")
        )

        for rank_idx, sem_res in enumerate(sem_results, start=1):
            sem_res.rank = rank_idx
            sem_res.save(update_fields=["rank", "updated_at"])

        return sem_results

    @staticmethod
    @transaction.atomic
    def publish_result(semester_id: str, actor=None, request=None) -> int:
        updated = SemesterResult.objects.filter(semester_id=semester_id).update(
            is_published=True, result_status="published"
        )
        StudentResult.objects.filter(subject__semester_id=semester_id).update(status="published")

        if request:
            try:
                log_audit_event(request, event_type="results_published", details=f"Published {updated} semester results for semester {semester_id}")
            except Exception:
                pass

        return updated

    @staticmethod
    def student_result(student_id: str) -> List[StudentResult]:
        return (
            StudentResult.objects.filter(student_id=student_id, is_deleted=False)
            .select_related("subject", "exam")
            .order_by("subject__code")
        )

    @staticmethod
    def semester_result(student_id: str, semester_id: str = None) -> List[SemesterResult]:
        qs = SemesterResult.objects.filter(student_id=student_id, is_deleted=False)
        if semester_id:
            qs = qs.filter(semester_id=semester_id)
        return qs.select_related("semester").order_by("semester__semester_number")


def _log_audit(student_result, actor, event_type: str, description: str, metadata: dict = None, request=None):
    if request:
        try:
            log_audit_event(request, event_type=f"result_{event_type}", details=description)
        except Exception:
            pass

    return ResultAuditLog.objects.create(
        student_result=student_result,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
