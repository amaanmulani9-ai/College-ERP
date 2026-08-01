"""
NAAC & NIRF Accreditation Data Aggregation Engine for College ERP.
Aggregates key metrics required for NAAC Criteria 1-7 and NIRF Ranking data submissions.
"""

from main_app.models import (
    Course, Student, Staff, Subject, Session, Book, IssuedBook,
    PlacementDrive, PlacementRegistration, OnlineExamResult,
    CertificateRequest, StudentRegistration, CollegeEvent, FeeRecord
)
from django.db.models import Sum


def generate_naac_nirf_data():
    """
    Computes comprehensive statistics aligned with NAAC Criteria 1-7 and NIRF metrics.
    Returns a dictionary of aggregated metrics.
    """
    total_students = Student.objects.count()
    total_staff = Staff.objects.count()
    total_courses = Course.objects.count()
    total_subjects = Subject.objects.count()
    total_books = Book.objects.count()
    
    # -------------------------------------------------------------
    # NAAC Criteria 1: Curricular Aspects
    # -------------------------------------------------------------
    courses_data = list(Course.objects.values('name', 'degree_level', 'total_semesters', 'monthly_fees'))
    sessions_count = Session.objects.count()
    
    # -------------------------------------------------------------
    # NAAC Criteria 2: Teaching-Learning & Evaluation
    # -------------------------------------------------------------
    male_students = Student.objects.filter(admin__gender='M').count()
    female_students = Student.objects.filter(admin__gender='F').count()
    
    student_faculty_ratio = round(total_students / total_staff, 2) if total_staff > 0 else 0
    
    # Pass Percentage Calculation from Online Exam Results
    exam_results = OnlineExamResult.objects.all()
    total_exams_taken = exam_results.count()
    passed_exams = 0
    if total_exams_taken > 0:
        passed_exams = exam_results.filter(score__gte=0.4 * models_total_marks_expr()).count() if hasattr(OnlineExamResult, 'total_marks') else 0
    
    # Fallback to general exam pass rate
    passed_students_count = Student.objects.filter(is_passed_out=True).count()
    
    # -------------------------------------------------------------
    # NAAC Criteria 3: Research, Innovations & Extension
    # -------------------------------------------------------------
    # Track LMS digital course resources uploaded by faculty
    from main_app.models import VideoCourse
    total_video_courses = VideoCourse.objects.count()
    
    # -------------------------------------------------------------
    # NAAC Criteria 4: Infrastructure & Learning Resources
    # -------------------------------------------------------------
    issued_books_count = IssuedBook.objects.count()
    available_books_count = max(0, total_books - issued_books_count)
    
    # Device & Connectivity statistics from StudentRegistration
    registrations = StudentRegistration.objects.all()
    reg_count = registrations.count() or 1
    has_device_count = registrations.filter(has_device__iexact='YES').count()
    has_internet_count = registrations.filter(has_internet__iexact='YES').count()
    
    # -------------------------------------------------------------
    # NAAC Criteria 5: Student Support & Progression
    # -------------------------------------------------------------
    total_drives = PlacementDrive.objects.count()
    total_placements_selected = PlacementRegistration.objects.filter(status='Selected').count()
    placement_rate = round((total_placements_selected / total_students) * 100, 2) if total_students > 0 else 0
    
    total_certificates_approved = CertificateRequest.objects.filter(status='Approved').count()
    students_with_scholarship = Student.objects.filter(discount_in_fee__gt=0).count()
    
    # -------------------------------------------------------------
    # NAAC Criteria 6: Governance, Leadership & Management
    # -------------------------------------------------------------
    total_fee_collected = FeeRecord.objects.aggregate(total=Sum('amount_paid'))['total'] or 0.0
    total_fee_due = FeeRecord.objects.aggregate(total=Sum('amount'))['total'] or 0.0
    fee_recovery_rate = round((total_fee_collected / total_fee_due) * 100, 2) if total_fee_due > 0 else 0.0
    
    # -------------------------------------------------------------
    # NAAC Criteria 7: Institutional Values & Best Practices
    # -------------------------------------------------------------
    events_count = CollegeEvent.objects.count()
    gender_diversity_index = round((female_students / total_students) * 100, 2) if total_students > 0 else 0
    
    return {
        "summary": {
            "total_students": total_students,
            "total_staff": total_staff,
            "total_courses": total_courses,
            "total_subjects": total_subjects,
            "student_faculty_ratio": f"{student_faculty_ratio}:1",
            "gender_diversity_index": f"{gender_diversity_index}%",
        },
        "criteria_1_curricular": {
            "title": "Criteria 1: Curricular Aspects",
            "total_programs": total_courses,
            "total_academic_sessions": sessions_count,
            "courses_list": courses_data,
        },
        "criteria_2_teaching_learning": {
            "title": "Criteria 2: Teaching-Learning & Evaluation",
            "enrolled_male": male_students,
            "enrolled_female": female_students,
            "total_faculty": total_staff,
            "student_faculty_ratio": student_faculty_ratio,
            "graduated_passed_out_students": passed_students_count,
        },
        "criteria_3_research": {
            "title": "Criteria 3: Research, Innovations & Extension",
            "total_video_learning_modules": total_video_courses,
        },
        "criteria_4_infrastructure": {
            "title": "Criteria 4: Infrastructure & Learning Resources",
            "total_library_books": total_books,
            "issued_books": issued_books_count,
            "available_books": available_books_count,
            "students_with_digital_devices_pct": round((has_device_count / reg_count) * 100, 1),
            "students_with_internet_access_pct": round((has_internet_count / reg_count) * 100, 1),
        },
        "criteria_5_student_support": {
            "title": "Criteria 5: Student Support & Progression",
            "placement_drives_conducted": total_drives,
            "students_placed": total_placements_selected,
            "placement_rate_pct": placement_rate,
            "certificates_issued": total_certificates_approved,
            "fee_concession_recipients": students_with_scholarship,
        },
        "criteria_6_governance": {
            "title": "Criteria 6: Governance, Leadership & Management",
            "total_fee_collected": round(total_fee_collected, 2),
            "total_fee_demanded": round(total_fee_due, 2),
            "fee_recovery_rate_pct": fee_recovery_rate,
        },
        "criteria_7_institutional_values": {
            "title": "Criteria 7: Institutional Values & Best Practices",
            "college_events_conducted": events_count,
            "female_enrollment_percentage": gender_diversity_index,
        }
    }


def models_total_marks_expr():
    return 100
