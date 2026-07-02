import csv
import json
from django.db.models import Count, Sum, Avg, Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from main_app.models import (
    Student, Staff, Course, Subject, Attendance, AttendanceReport,
    FeeRecord, FeePayment, PlacementDrive, PlacementRegistration,
    CustomUser, Session, StudentResult, IssuedBook, LeaveReportStaff, LeaveReportStudent
)

@login_required
def admin_analytics(request):
    # 1. Student Analytics
    total_students = Student.objects.count()
    male_students = CustomUser.objects.filter(user_type='3', gender='M').count()
    female_students = CustomUser.objects.filter(user_type='3', gender='F').count()
    
    # Students per course
    courses = Course.objects.all()
    students_per_course_labels = []
    students_per_course_data = []
    for course in courses:
        students_per_course_labels.append(course.name)
        students_per_course_data.append(Student.objects.filter(course=course).count())
        
    # Student results average score
    avg_test_score = StudentResult.objects.aggregate(Avg('test'))['test__avg'] or 0.0
    avg_exam_score = StudentResult.objects.aggregate(Avg('exam'))['exam__avg'] or 0.0
    pass_students = StudentResult.objects.filter(Q(test__gte=20) | Q(exam__gte=20)).count()
    fail_students = StudentResult.objects.exclude(Q(test__gte=20) | Q(exam__gte=20)).count()

    # Library usage
    total_books_issued = IssuedBook.objects.count()

    # 2. Staff (Teacher) Analytics
    total_staff = Staff.objects.count()
    staff_leave_approved = LeaveReportStaff.objects.filter(status=1).count()
    staff_leave_pending = LeaveReportStaff.objects.filter(status=0).count()
    staff_leave_rejected = LeaveReportStaff.objects.filter(status=-1).count()

    # Staff list performance details
    staff_list = Staff.objects.all()
    staff_performance = []
    for s in staff_list:
        subjects_count = Subject.objects.filter(staff=s).count()
        attendance_taken = Attendance.objects.filter(subject__staff=s).count()
        staff_performance.append({
            'name': s.admin.get_full_name(),
            'subjects': subjects_count,
            'attendance_taken': attendance_taken,
        })

    # 3. Finance Analytics
    total_expected_fees = FeeRecord.objects.aggregate(Sum('amount'))['amount__sum'] or 0.0
    total_collected_fees = FeeRecord.objects.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0.0
    total_pending_fees = total_expected_fees - total_collected_fees

    # Fees category breakdown
    fee_categories = FeeRecord.objects.values('category').annotate(
        total=Sum('amount'), paid=Sum('amount_paid')
    )
    finance_categories_labels = [c['category'] for c in fee_categories]
    finance_categories_expected = [c['total'] for c in fee_categories]
    finance_categories_collected = [c['paid'] for c in fee_categories]

    # Payment methods breakdown
    payment_methods = FeePayment.objects.values('payment_method').annotate(count=Count('id'))
    payment_method_labels = [p['payment_method'] for p in payment_methods]
    payment_method_data = [p['count'] for p in payment_methods]

    # 4. Placement Analytics
    total_drives = PlacementDrive.objects.count()
    active_drives = PlacementDrive.objects.filter(status='Active').count()
    completed_drives = PlacementDrive.objects.filter(status='Completed').count()
    
    # Registration statistics
    applied_count = PlacementRegistration.objects.filter(status='Applied').count()
    selected_count = PlacementRegistration.objects.filter(status='Selected').count()
    rejected_count = PlacementRegistration.objects.filter(status='Rejected').count()

    # Packages breakdown (mock or from job_role/package text)
    drives = PlacementDrive.objects.all()
    packages_data = []
    for d in drives:
        packages_data.append({
            'company': d.company_name,
            'role': d.job_role,
            'package': d.package
        })

    # 5. Attendance Trends
    # Monthly attendance trend (Present vs Absent)
    present_attendance = AttendanceReport.objects.filter(status=True).count()
    absent_attendance = AttendanceReport.objects.filter(status=False).count()
    total_attendance_records = present_attendance + absent_attendance
    attendance_rate = (present_attendance / total_attendance_records * 100) if total_attendance_records > 0 else 0.0

    # Subject-wise attendance rates
    subjects = Subject.objects.all()
    subject_attendance_labels = []
    subject_attendance_rates = []
    for sub in subjects:
        sub_attendances = Attendance.objects.filter(subject=sub)
        sub_present = AttendanceReport.objects.filter(attendance__in=sub_attendances, status=True).count()
        sub_total = AttendanceReport.objects.filter(attendance__in=sub_attendances).count()
        rate = (sub_present / sub_total * 100) if sub_total > 0 else 0.0
        subject_attendance_labels.append(sub.name)
        subject_attendance_rates.append(round(rate, 2))

    context = {
        'page_title': 'Advanced Analytics & Monitoring',
        # Student Analytics
        'total_students': total_students,
        'male_students': male_students,
        'female_students': female_students,
        'students_per_course_labels': json.dumps(students_per_course_labels),
        'students_per_course_data': json.dumps(students_per_course_data),
        'avg_test_score': avg_test_score,
        'avg_exam_score': avg_exam_score,
        'pass_students': pass_students,
        'fail_students': fail_students,
        'total_books_issued': total_books_issued,
        
        # Staff Analytics
        'total_staff': total_staff,
        'staff_leave_approved': staff_leave_approved,
        'staff_leave_pending': staff_leave_pending,
        'staff_leave_rejected': staff_leave_rejected,
        'staff_performance': staff_performance,
        
        # Finance Analytics
        'total_expected_fees': total_expected_fees,
        'total_collected_fees': total_collected_fees,
        'total_pending_fees': total_pending_fees,
        'finance_categories_labels': json.dumps(finance_categories_labels),
        'finance_categories_expected': json.dumps(finance_categories_expected),
        'finance_categories_collected': json.dumps(finance_categories_collected),
        'payment_method_labels': json.dumps(payment_method_labels),
        'payment_method_data': json.dumps(payment_method_data),
        
        # Placement Analytics
        'total_drives': total_drives,
        'active_drives': active_drives,
        'completed_drives': completed_drives,
        'applied_count': applied_count,
        'selected_count': selected_count,
        'rejected_count': rejected_count,
        'packages_data': packages_data,
        
        # Attendance Trends
        'present_attendance': present_attendance,
        'absent_attendance': absent_attendance,
        'attendance_rate': round(attendance_rate, 2),
        'subject_attendance_labels': json.dumps(subject_attendance_labels),
        'subject_attendance_rates': json.dumps(subject_attendance_rates),
    }
    
    return render(request, 'hod_template/analytics.html', context)

@login_required
def export_analytics_report(request, report_type):
    response = HttpResponse(content_type='text/csv')
    
    if report_type == 'student':
        response['Content-Disposition'] = 'attachment; filename="student_academic_analytics.csv"'
        writer = csv.writer(response)
        writer.writerow(['Student Name', 'Course', 'Email', 'Gender', 'Total Books Issued'])
        students = Student.objects.all()
        for s in students:
            books_count = IssuedBook.objects.filter(student_id=str(s.id)).count()
            writer.writerow([
                s.admin.get_full_name(),
                s.course.name if s.course else 'N/A',
                s.admin.email,
                s.admin.get_gender_display(),
                books_count
            ])
            
    elif report_type == 'finance':
        response['Content-Disposition'] = 'attachment; filename="fee_financial_analytics.csv"'
        writer = csv.writer(response)
        writer.writerow(['Student Name', 'Category', 'Expected Amount', 'Amount Paid', 'Outstanding Balance', 'Status'])
        records = FeeRecord.objects.all()
        for r in records:
            writer.writerow([
                r.student.admin.get_full_name(),
                r.category,
                r.amount,
                r.amount_paid,
                r.balance,
                r.status
            ])
            
    elif report_type == 'placement':
        response['Content-Disposition'] = 'attachment; filename="placement_drive_analytics.csv"'
        writer = csv.writer(response)
        writer.writerow(['Company Name', 'Job Role', 'Package', 'Eligible Requirements', 'Applied Students', 'Selected Students'])
        drives = PlacementDrive.objects.all()
        for d in drives:
            applied = PlacementRegistration.objects.filter(drive=d, status='Applied').count()
            selected = PlacementRegistration.objects.filter(drive=d, status='Selected').count()
            writer.writerow([
                d.company_name,
                d.job_role,
                d.package,
                d.eligibility,
                applied,
                selected
            ])
    else:
        return HttpResponse("Invalid Report Type", status=400)
        
    return response

def prometheus_metrics(request):
    # Returns telemetry in standard Prometheus format
    lines = []
    
    # 1. User counts
    lines.append('# HELP erp_users_total Total number of registered users in ERP.')
    lines.append('# TYPE erp_users_total gauge')
    lines.append(f'erp_users_total{{role="admin"}} {CustomUser.objects.filter(user_type="1").count()}')
    lines.append(f'erp_users_total{{role="staff"}} {Staff.objects.count()}')
    lines.append(f'erp_users_total{{role="student"}} {Student.objects.count()}')
    lines.append(f'erp_users_total{{role="parent"}} {CustomUser.objects.filter(user_type="4").count()}')
    
    # 2. Financial Metrics
    total_expected = FeeRecord.objects.aggregate(Sum('amount'))['amount__sum'] or 0.0
    total_collected = FeeRecord.objects.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0.0
    lines.append('# HELP erp_fees_expected_total Total expected fee amount.')
    lines.append('# TYPE erp_fees_expected_total gauge')
    lines.append(f'erp_fees_expected_total {total_expected}')
    lines.append('# HELP erp_fees_collected_total Total collected fee amount.')
    lines.append('# TYPE erp_fees_collected_total gauge')
    lines.append(f'erp_fees_collected_total {total_collected}')
    
    # 3. Placement Metrics
    lines.append('# HELP erp_placements_total Total number of placement drives.')
    lines.append('# TYPE erp_placements_total gauge')
    lines.append(f'erp_placements_total{{status="active"}} {PlacementDrive.objects.filter(status="Active").count()}')
    lines.append(f'erp_placements_total{{status="completed"}} {PlacementDrive.objects.filter(status="Completed").count()}')
    lines.append(f'erp_placement_registrations_total{{status="applied"}} {PlacementRegistration.objects.filter(status="Applied").count()}')
    lines.append(f'erp_placement_registrations_total{{status="selected"}} {PlacementRegistration.objects.filter(status="Selected").count()}')
    lines.append(f'erp_placement_registrations_total{{status="rejected"}} {PlacementRegistration.objects.filter(status="Rejected").count()}')
    
    # 4. Attendance Metrics
    present = AttendanceReport.objects.filter(status=True).count()
    total_att = AttendanceReport.objects.count()
    lines.append('# HELP erp_attendance_records_total Total number of attendance records.')
    lines.append('# TYPE erp_attendance_records_total gauge')
    lines.append(f'erp_attendance_records_total{{status="present"}} {present}')
    lines.append(f'erp_attendance_records_total{{status="total"}} {total_att}')
    
    # 5. Library Metrics
    lines.append('# HELP erp_library_issued_books_total Total number of currently issued books.')
    lines.append('# TYPE erp_library_issued_books_total gauge')
    lines.append(f'erp_library_issued_books_total {IssuedBook.objects.count()}')

    # 6. Leave Metrics
    lines.append('# HELP erp_leave_reports_total Total count of leave reports.')
    lines.append('# TYPE erp_leave_reports_total gauge')
    lines.append(f'erp_leave_reports_total{{role="staff",status="approved"}} {LeaveReportStaff.objects.filter(status=1).count()}')
    lines.append(f'erp_leave_reports_total{{role="staff",status="pending"}} {LeaveReportStaff.objects.filter(status=0).count()}')
    lines.append(f'erp_leave_reports_total{{role="student",status="approved"}} {LeaveReportStudent.objects.filter(status=1).count()}')
    lines.append(f'erp_leave_reports_total{{role="student",status="pending"}} {LeaveReportStudent.objects.filter(status=0).count()}')
    
    output = "\n".join(lines) + "\n"
    return HttpResponse(output, content_type="text/plain; version=0.0.4; charset=utf-8")
