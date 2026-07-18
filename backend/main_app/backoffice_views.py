import json
from datetime import date, timedelta
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Count, Sum, Q, F
from .models import (
    CustomUser, Student, Staff, Course, Subject, Session,
    FeeRecord, FeePayment, CertificateRequest,
    LeaveReportStudent, LeaveReportStaff,
    Attendance, AttendanceReport, Backoffice,
    StudentRegistration, PlacementDrive, Parent, AdmissionQuery, Complaint
)


def backoffice_required(view_func):
    """Decorator to restrict access to Backoffice users (user_type=7)."""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login_page')
        if request.user.user_type != '7':
            messages.error(request, "Access denied. Backoffice login required.")
            return redirect('login_page')
        return view_func(request, *args, **kwargs)
    return wrapper


@backoffice_required
def backoffice_home(request):
    """Main Backoffice Dashboard with stats on students, fees, certificates, leaves."""

    # --- Core Stats ---
    total_students = Student.objects.count()
    total_staff = Staff.objects.count()
    total_courses = Course.objects.count()

    # New students this month
    today = date.today()
    month_start = today.replace(day=1)
    new_students_month = CustomUser.objects.filter(
        user_type='3',
        created_at__gte=month_start
    ).count()

    # --- Fee Stats ---
    fee_qs = FeeRecord.objects.all()
    total_fees_expected = fee_qs.aggregate(total=Sum('amount'))['total'] or 0
    total_fees_collected = fee_qs.aggregate(total=Sum('amount_paid'))['total'] or 0
    total_fees_pending = total_fees_expected - total_fees_collected
    paid_pct = round((total_fees_collected / total_fees_expected * 100), 1) if total_fees_expected > 0 else 0

    # Recent Payments
    recent_payments = FeePayment.objects.select_related('fee_record__student__admin').order_by('-payment_date')[:8]

    # --- Certificate Requests ---
    pending_certificates = CertificateRequest.objects.filter(status='Pending').select_related('student__admin').order_by('-created_at')[:6]
    total_cert_pending = CertificateRequest.objects.filter(status='Pending').count()
    total_cert_approved = CertificateRequest.objects.filter(status='Approved').count()

    # --- Leave Stats ---
    pending_student_leaves = LeaveReportStudent.objects.filter(status=0).count()
    pending_staff_leaves = LeaveReportStaff.objects.filter(status=0).count()

    # --- Fee Collection Chart (last 6 months - optimized to 1 query) ---
    from django.db.models.functions import TruncMonth
    months_labels = []
    months_collected = []
    start_date = (today.replace(day=1) - timedelta(days=150)).replace(day=1)
    
    payments_by_month = {
        p['month'].strftime('%Y-%m'): p['total'] or 0
        for p in FeePayment.objects.filter(payment_date__gte=start_date)
                                    .annotate(month=TruncMonth('payment_date'))
                                    .values('month')
                                    .annotate(total=Sum('amount_paid'))
    }
    
    for i in range(5, -1, -1):
        m = today.replace(day=1) - timedelta(days=30 * i)
        months_labels.append(m.strftime('%b %Y'))
        key = m.strftime('%Y-%m')
        months_collected.append(float(payments_by_month.get(key, 0)))

    # --- Course-wise Student Count ---
    course_data = Course.objects.annotate(student_count=Count('student')).values('name', 'student_count').order_by('-student_count')
    course_labels = json.dumps([c['name'] for c in course_data])
    course_counts = json.dumps([c['student_count'] for c in course_data])

    # --- Recent Students ---
    recent_students = Student.objects.select_related('admin', 'course', 'session').order_by('-admin__created_at')[:8]

    # --- CampusPro Receptionist Stats ---
    total_parents = Parent.objects.count()
    total_staffs = CustomUser.objects.filter(user_type='7').count()
    pending_queries = AdmissionQuery.objects.filter(status='Active').count()
    open_complaints = Complaint.objects.filter(action_taken__isnull=True).count()

    context = {
        'page_title': 'Backoffice Dashboard',
        'total_students': total_students,
        'total_staff': total_staff,
        'total_courses': total_courses,
        'new_students_month': new_students_month,
        'total_fees_expected': total_fees_expected,
        'total_fees_collected': total_fees_collected,
        'total_fees_pending': total_fees_pending,
        'paid_pct': paid_pct,
        'recent_payments': recent_payments,
        'pending_certificates': pending_certificates,
        'total_cert_pending': total_cert_pending,
        'total_cert_approved': total_cert_approved,
        'pending_student_leaves': pending_student_leaves,
        'pending_staff_leaves': pending_staff_leaves,
        'months_labels': json.dumps(months_labels),
        'months_collected': json.dumps(months_collected),
        'course_labels': course_labels,
        'course_counts': course_counts,
        'recent_students': recent_students,
        'total_parents': total_parents,
        'total_staffs': total_staffs,
        'pending_queries_count': pending_queries,
        'open_complaints_count': open_complaints,
    }
    return render(request, 'backoffice_template/home_content.html', context)


@backoffice_required
def backoffice_admissions(request):
    """Manage student registrations and admissions."""
    query = request.GET.get('q', '')
    course_filter = request.GET.get('course', '')
    status_filter = request.GET.get('status', '')

    students = Student.objects.select_related('admin', 'course', 'session').order_by('-admin__created_at')

    if query:
        students = students.filter(
            Q(admin__first_name__icontains=query) |
            Q(admin__last_name__icontains=query) |
            Q(admin__email__icontains=query)
        )
    if course_filter:
        students = students.filter(course__id=course_filter)

    courses = Course.objects.all()
    sessions = Session.objects.all().order_by('-start_year')

    context = {
        'page_title': 'Admissions Management',
        'students': students,
        'courses': courses,
        'sessions': sessions,
        'query': query,
        'course_filter': course_filter,
        'total_students': students.count(),
    }
    return render(request, 'backoffice_template/admissions.html', context)


@backoffice_required
def backoffice_fees(request):
    """Fee collection and management dashboard."""
    course_filter = request.GET.get('course', '')
    status_filter = request.GET.get('status', '')

    fee_qs = FeeRecord.objects.select_related('student__admin', 'student__course').order_by('-created_at')

    if course_filter:
        fee_qs = fee_qs.filter(student__course__id=course_filter)
    if status_filter:
        fee_qs = fee_qs.filter(status=status_filter)

    total_expected = fee_qs.aggregate(total=Sum('amount'))['total'] or 0
    total_collected = fee_qs.aggregate(total=Sum('amount_paid'))['total'] or 0
    total_pending = total_expected - total_collected

    recent_payments = FeePayment.objects.select_related(
        'fee_record__student__admin'
    ).order_by('-payment_date')[:15]

    courses = Course.objects.all()

    context = {
        'page_title': 'Fee Management',
        'fee_records': fee_qs[:50],
        'courses': courses,
        'course_filter': course_filter,
        'status_filter': status_filter,
        'total_expected': total_expected,
        'total_collected': total_collected,
        'total_pending': total_pending,
        'recent_payments': recent_payments,
    }
    return render(request, 'backoffice_template/fees.html', context)


@backoffice_required
def backoffice_certificates(request):
    """Certificate request management."""
    status_filter = request.GET.get('status', '')

    cert_qs = CertificateRequest.objects.select_related('student__admin').order_by('-created_at')
    if status_filter:
        cert_qs = cert_qs.filter(status=status_filter)

    context = {
        'page_title': 'Certificate Requests',
        'certificates': cert_qs,
        'status_filter': status_filter,
        'pending_count': CertificateRequest.objects.filter(status='Pending').count(),
        'approved_count': CertificateRequest.objects.filter(status='Approved').count(),
        'rejected_count': CertificateRequest.objects.filter(status='Rejected').count(),
    }
    return render(request, 'backoffice_template/certificates.html', context)


@backoffice_required
@csrf_exempt
def backoffice_update_certificate(request, cert_id):
    """Approve or reject a certificate request."""
    cert = get_object_or_404(CertificateRequest, id=cert_id)
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'approve':
            cert.status = 'Approved'
            cert.approved_date = date.today()
            cert.save()
            messages.success(request, f"Certificate approved for {cert.student.admin.get_full_name()}.")
        elif action == 'reject':
            cert.status = 'Rejected'
            cert.save()
            messages.warning(request, f"Certificate rejected for {cert.student.admin.get_full_name()}.")
    return redirect('backoffice_certificates')


@backoffice_required
def backoffice_leaves(request):
    """View and manage student and staff leave requests."""
    student_leaves = LeaveReportStudent.objects.select_related('student__admin').order_by('-created_at')
    staff_leaves = LeaveReportStaff.objects.select_related('staff__admin').order_by('-created_at')

    context = {
        'page_title': 'Leave Management',
        'student_leaves': student_leaves,
        'staff_leaves': staff_leaves,
        'pending_student': student_leaves.filter(status=0).count(),
        'pending_staff': staff_leaves.filter(status=0).count(),
    }
    return render(request, 'backoffice_template/leaves.html', context)


@backoffice_required
def backoffice_reports(request):
    """Reports and analytics view."""
    # Fee summary per course
    course_fee_data = Course.objects.annotate(
        students=Count('student'),
        expected=Sum('student__feerecord__amount'),
        collected=Sum('student__feerecord__amount_paid'),
    ).values('name', 'students', 'expected', 'collected')

    context = {
        'page_title': 'Reports & Analytics',
        'course_fee_data': course_fee_data,
    }
    return render(request, 'backoffice_template/reports.html', context)


@backoffice_required
def backoffice_profile(request):
    """Backoffice staff profile page."""
    backoffice = get_object_or_404(Backoffice, admin=request.user)

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        department = request.POST.get('department', '').strip()

        if first_name:
            request.user.first_name = first_name
        if last_name:
            request.user.last_name = last_name
        request.user.save()

        if department:
            backoffice.department = department
            backoffice.save()
        messages.success(request, "Profile updated successfully!")

    context = {
        'page_title': 'My Profile',
        'backoffice': backoffice,
    }
    return render(request, 'backoffice_template/profile.html', context)
