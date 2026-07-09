import json
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Q, Sum
from .models import (
    Parent, Student, StudentResult, AttendanceReport,
    OnlineExamResult, FeeRecord, FeePayment, Timetable,
    LeaveReportStudent, FeedbackParent, Subject, Session, Course,
    IssuedBook, Assignment, AssignmentSubmission, NotificationStudent, StudentBehaviourRecord, Event, Exam
)


def parent_required(view_func):
    """Decorator to restrict access to parent users (user_type=4)."""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login_page')
        if request.user.user_type != '4':
            messages.error(request, "Access denied. Parent login required.")
            return redirect('login_page')
        return view_func(request, *args, **kwargs)
    return wrapper


@parent_required
def parent_home(request):
    parent = get_object_or_404(Parent, admin=request.user)
    student = parent.student

    # --- Attendance Stats ---
    total_attendance = AttendanceReport.objects.filter(student=student).count()
    attendance_present = AttendanceReport.objects.filter(student=student, status=True).count()
    attendance_absent = total_attendance - attendance_present
    attendance_pct = round((attendance_present / total_attendance * 100), 1) if total_attendance > 0 else 0

    # --- Results ---
    results = StudentResult.objects.filter(student=student).select_related('subject')
    online_results = OnlineExamResult.objects.filter(student=student).order_by('-submitted_at')[:5]

    # --- Fees ---
    fee_records = FeeRecord.objects.filter(student=student)
    total_fees = sum(f.amount for f in fee_records)
    total_paid = sum(f.amount_paid for f in fee_records)
    total_due = total_fees - total_paid

    # --- Timetable (today) ---
    today_day = timezone.now().weekday()  # 0=Mon, 5=Sat
    todays_timetable = Timetable.objects.filter(
        course=student.course, day_of_week=today_day
    ).select_related('subject').order_by('start_time')

    # --- Additional Dashboard Stats ---
    subjects_count = Subject.objects.filter(course=student.course).count()
    notices_count = NotificationStudent.objects.filter(student=student, is_read=False).count()
    exams_count = Exam.objects.filter(subject__course=student.course).count()
    online_exams_count = Exam.objects.filter(subject__course=student.course, is_active=True).count()
    
    # Total distinct teachers assigned to student's course subjects
    teachers_count = Subject.objects.filter(course=student.course).values('staff').distinct().count()
    
    # Library issued books count (checking both email and ID)
    issued_books_count = IssuedBook.objects.filter(
        Q(student_id=student.admin.email) | Q(student_id=str(student.id))
    ).count()
    
    # Pending homework count (assignments that don't have submissions from this student yet)
    submitted_assignment_ids = AssignmentSubmission.objects.filter(student=student).values_list('assignment_id', flat=True)
    pending_homework_count = Assignment.objects.filter(subject__course=student.course).exclude(id__in=submitted_assignment_ids).count()
    
    # Student behavior points sum
    behaviour_points = StudentBehaviourRecord.objects.filter(student=student).aggregate(total=Sum('incident__point'))['total'] or 0

    # --- Subject Results Chart Data ---
    chart_labels = [r.subject.name for r in results]
    chart_test = [r.test for r in results]
    chart_exam = [r.exam for r in results]

    context = {
        'page_title': 'Parent Dashboard',
        'student': student,
        'parent': parent,
        'total_attendance': total_attendance,
        'attendance_present': attendance_present,
        'attendance_absent': attendance_absent,
        'attendance_pct': attendance_pct,
        'results': results,
        'online_results': online_results,
        'fee_records': fee_records,
        'total_fees': total_fees,
        'total_paid': total_paid,
        'total_due': total_due,
        'todays_timetable': todays_timetable,
        
        # New Context Stats
        'subjects_count': subjects_count,
        'notices_count': notices_count,
        'exams_count': exams_count,
        'online_exams_count': online_exams_count,
        'teachers_count': teachers_count,
        'issued_books_count': issued_books_count,
        'pending_homework_count': pending_homework_count,
        'behaviour_points': behaviour_points,
        
        'chart_labels': json.dumps(chart_labels),
        'chart_test': json.dumps(chart_test),
        'chart_exam': json.dumps(chart_exam),
    }
    return render(request, 'parent_template/home_content.html', context)


@parent_required
def parent_attendance_detail(request):
    parent = get_object_or_404(Parent, admin=request.user)
    student = parent.student

    attendance_data = AttendanceReport.objects.filter(
        student=student
    ).select_related('attendance__subject').order_by('-attendance__date')

    # Group by subject for summary
    from collections import defaultdict
    subject_stats = defaultdict(lambda: {'present': 0, 'absent': 0})
    for ar in attendance_data:
        sub = ar.attendance.subject.name
        if ar.status:
            subject_stats[sub]['present'] += 1
        else:
            subject_stats[sub]['absent'] += 1

    subject_summary = [
        {
            'subject': sub,
            'present': stats['present'],
            'absent': stats['absent'],
            'total': stats['present'] + stats['absent'],
            'pct': round(stats['present'] / (stats['present'] + stats['absent']) * 100, 1) if (stats['present'] + stats['absent']) > 0 else 0
        }
        for sub, stats in subject_stats.items()
    ]

    context = {
        'page_title': 'Attendance Details',
        'student': student,
        'attendance_data': attendance_data,
        'subject_summary': subject_summary,
    }
    return render(request, 'parent_template/attendance_detail.html', context)


@parent_required
def parent_fee_view(request):
    parent = get_object_or_404(Parent, admin=request.user)
    student = parent.student

    fee_records = FeeRecord.objects.filter(student=student).order_by('-created_at')
    payments = FeePayment.objects.filter(fee_record__student=student).order_by('-payment_date')

    total_fees = sum(f.amount for f in fee_records)
    total_paid = sum(f.amount_paid for f in fee_records)
    total_due = total_fees - total_paid

    context = {
        'page_title': 'Fee Statement',
        'student': student,
        'fee_records': fee_records,
        'payments': payments,
        'total_fees': total_fees,
        'total_paid': total_paid,
        'total_due': total_due,
    }
    return render(request, 'parent_template/fee_view.html', context)


@parent_required
def parent_results_view(request):
    parent = get_object_or_404(Parent, admin=request.user)
    student = parent.student

    results = StudentResult.objects.filter(student=student).select_related('subject')
    online_results = OnlineExamResult.objects.filter(student=student).order_by('-submitted_at')

    total_test = sum(r.test for r in results)
    total_exam = sum(r.exam for r in results)

    context = {
        'page_title': 'Exam Results',
        'student': student,
        'results': results,
        'online_results': online_results,
        'total_test': total_test,
        'total_exam': total_exam,
    }
    return render(request, 'parent_template/results_view.html', context)


@parent_required
def parent_timetable(request):
    parent = get_object_or_404(Parent, admin=request.user)
    student = parent.student

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    timetable_by_day = {}
    for i, day in enumerate(days):
        slots = Timetable.objects.filter(
            course=student.course, day_of_week=i
        ).select_related('subject').order_by('start_time')
        if slots.exists():
            timetable_by_day[day] = slots

    context = {
        'page_title': 'Child Timetable',
        'student': student,
        'timetable_by_day': timetable_by_day,
        'today': days[timezone.now().weekday()] if timezone.now().weekday() < 6 else None,
    }
    return render(request, 'parent_template/timetable.html', context)


@parent_required
def parent_feedback(request):
    parent = get_object_or_404(Parent, admin=request.user)

    if request.method == 'POST':
        feedback_text = request.POST.get('feedback', '').strip()
        if feedback_text:
            FeedbackParent.objects.create(parent=parent, feedback=feedback_text)
            messages.success(request, "Your feedback has been submitted successfully!")
        else:
            messages.error(request, "Please enter feedback before submitting.")

    feedbacks = FeedbackParent.objects.filter(parent=parent).order_by('-created_at')
    context = {
        'page_title': 'Feedback',
        'parent': parent,
        'feedbacks': feedbacks,
    }
    return render(request, 'parent_template/feedback.html', context)


@parent_required
def parent_profile(request):
    parent = get_object_or_404(Parent, admin=request.user)

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        mobile = request.POST.get('mobile_number', '').strip()

        if first_name:
            request.user.first_name = first_name
        if last_name:
            request.user.last_name = last_name
        request.user.save()

        parent.mobile_number = mobile
        parent.save()
        messages.success(request, "Profile updated successfully!")

    context = {
        'page_title': 'My Profile',
        'parent': parent,
    }
    return render(request, 'parent_template/profile.html', context)
