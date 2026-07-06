from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from .decorators import admin_required, staff_required, student_required
import json
import os
import csv
import io
import time
import random
import string
import mimetypes
import datetime
from django.conf import settings
import requests
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, JsonResponse
from django.shortcuts import (HttpResponse, HttpResponseRedirect,
                              get_object_or_404, redirect, render)
from django.templatetags.static import static
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import UpdateView

from .forms import *
from django.db.models import Sum, Count, Q, F, Avg
from django.db.models.functions import TruncMonth
import calendar
from datetime import date, timedelta


@login_required(login_url='/')
@admin_required
def admin_home(request):
    total_staff = Staff.objects.all().count()
    total_students = Student.objects.all().count()
    subjects = Subject.objects.all()
    total_subject = subjects.count()
    total_course = Course.objects.all().count()
    attendance_list = Attendance.objects.filter(subject__in=subjects)
    total_attendance = attendance_list.count()
    attendance_list = []
    subject_list = []
    for subject in subjects:
        attendance_count = Attendance.objects.filter(subject=subject).count()
        subject_list.append(subject.name[:7])
        attendance_list.append(attendance_count)
    # Total Subjects and students in Each Course
    courses_with_counts = Course.objects.annotate(
        subject_count=Count('subject', distinct=True),
        student_count=Count('student', distinct=True)
    )
    course_name_list = [course.name for course in courses_with_counts]
    subject_count_list = [course.subject_count for course in courses_with_counts]
    student_count_list_in_course = [course.student_count for course in courses_with_counts]
    
    subjects_with_counts = Subject.objects.select_related('course').annotate(
        student_count=Count('course__student', distinct=True)
    )
    subject_list = [subject.name for subject in subjects_with_counts]
    student_count_list_in_subject = [subject.student_count for subject in subjects_with_counts]


    # For Students
    students_with_attendance = Student.objects.annotate(
        present_count=Count('attendancereport', filter=Q(attendancereport__status=True), distinct=True),
        absent_count=Count('attendancereport', filter=Q(attendancereport__status=False), distinct=True),
        leave_count=Count('leavereportstudent', filter=Q(leavereportstudent__status=1), distinct=True)
    ).select_related('admin')

    student_attendance_present_list=[]
    student_attendance_leave_list=[]
    student_name_list=[]

    for student in students_with_attendance:
        student_attendance_present_list.append(student.present_count)
        student_attendance_leave_list.append(student.leave_count + student.absent_count)
        student_name_list.append(student.admin.first_name)
        
    # --- Fee Collection ---
    total_fee_collected = FeeRecord.objects.aggregate(total=Sum('amount_paid'))['total'] or 0
    total_fee_pending = FeeRecord.objects.aggregate(total=Sum(F('amount') - F('amount_paid')))['total'] or 0
    
    # --- Pass/Fail Ratio ---
    results = StudentResult.objects.select_related('student__admin', 'subject').all()
    pass_count = 0
    fail_count = 0
    for r in results:
        if (r.test + r.exam) >= 40:
            pass_count += 1
        else:
            fail_count += 1
            
    # --- Monthly Enrollment Trend ---
    enrollments = CustomUser.objects.filter(user_type='3').annotate(month=TruncMonth('date_joined')).values('month').annotate(count=Count('id')).order_by('month')
    months = []
    monthly_enrollments = []
    for e in enrollments:
        if e['month']:
            months.append(e['month'].strftime('%b %Y'))
            monthly_enrollments.append(e['count'])
            
    # --- Staff Performance Analytics ---
    staff_analytics = []
    staff_with_stats = Staff.objects.select_related('admin', 'course').annotate(
        subjects_taught_count=Count('subject', distinct=True),
        attendance_taken_count=Count('subject__attendance', distinct=True),
        results_published_count=Count('subject__studentresult', distinct=True)
    )
    for staff in staff_with_stats:
        staff_analytics.append({
            'name': staff.admin.get_full_name(),
            'department': staff.course.name if staff.course else "N/A",
            'subjects': staff.subjects_taught_count,
            'attendance_taken': staff.attendance_taken_count,
            'results_published': staff.results_published_count,
        })

    # ─────────── NEW DASHBOARD PANELS DATA ───────────

    today = date.today()

    # 1. Pending Leaves
    pending_student_leaves = LeaveReportStudent.objects.filter(status=0).count()
    pending_staff_leaves = LeaveReportStaff.objects.filter(status=0).count()

    # 2. Pending Feedbacks (no reply yet)
    pending_student_feedbacks = FeedbackStudent.objects.filter(reply='').count()
    pending_staff_feedbacks = FeedbackStaff.objects.filter(reply='').count()
    total_pending_feedbacks = pending_student_feedbacks + pending_staff_feedbacks

    # 3. Pending Certificate Requests
    try:
        pending_certs = CertificateRequest.objects.filter(status='Pending').count()
    except Exception:
        pending_certs = 0

    # 4. Recent Students (last 8 admissions)
    recent_students = Student.objects.select_related(
        'admin', 'course', 'session'
    ).order_by('-admin__created_at')[:8]

    # 5. Recent Fee Payments (last 6)
    try:
        recent_payments = FeePayment.objects.select_related(
            'fee_record__student__admin'
        ).order_by('-payment_date')[:6]
    except Exception:
        recent_payments = []

    # 6. Today's Events & Upcoming Events
    try:
        today_events = CollegeEvent.objects.filter(date=today).order_by('date')
        upcoming_events = CollegeEvent.objects.filter(date__gte=today).order_by('date')[:6]
    except Exception:
        today_events = []
        upcoming_events = []

    # 7. Monthly Fee Collection (last 6 months)
    fee_months_labels = []
    fee_months_collected = []
    for i in range(5, -1, -1):
        m_date = today.replace(day=1) - timedelta(days=30 * i)
        fee_months_labels.append(m_date.strftime('%b %y'))
        try:
            collected = FeePayment.objects.filter(
                payment_date__year=m_date.year,
                payment_date__month=m_date.month
            ).aggregate(total=Sum('amount_paid'))['total'] or 0
        except Exception:
            collected = 0
        fee_months_collected.append(float(collected))

    # 8. Gender Distribution
    male_students = CustomUser.objects.filter(user_type='3', gender='M').count()
    female_students = CustomUser.objects.filter(user_type='3', gender='F').count()

    # 9. Today's Attendance Sessions
    today_attendance_sessions = Attendance.objects.filter(date=today).count()

    # 10. Total Parents
    total_parents = Parent.objects.count()

    # 12. Recent Notifications (Noticeboard / Communications)
    try:
        notif_students = list(NotificationStudent.objects.select_related('student__admin').order_by('-created_at')[:4])
        notif_staff = list(NotificationStaff.objects.select_related('staff__admin').order_by('-created_at')[:4])
        recent_notifs = []
        for n in notif_students:
            recent_notifs.append({
                'recipient': f"Student: {n.student.admin.first_name} {n.student.admin.last_name}",
                'message': n.message,
                'created_at': n.created_at,
                'type': 'student'
            })
        for n in notif_staff:
            recent_notifs.append({
                'recipient': f"Staff: {n.staff.admin.first_name} {n.staff.admin.last_name}",
                'message': n.message,
                'created_at': n.created_at,
                'type': 'staff'
            })
        recent_notifs.sort(key=lambda x: getattr(x, 'created_at', None) or today, reverse=True)
        recent_notifs = recent_notifs[:5]
    except Exception:
        recent_notifs = []

    course_stats = courses_with_counts

    context = {
        'page_title': "Administrative Dashboard",
        # core stats
        'total_students': total_students,
        'total_staff': total_staff,
        'total_course': total_course,
        'total_subject': total_subject,
        'total_parents': total_parents,
        'total_attendance': total_attendance,
        # chart data
        'subject_list': subject_list,
        'attendance_list': attendance_list,
        'student_attendance_present_list': student_attendance_present_list,
        'student_attendance_leave_list': student_attendance_leave_list,
        "student_name_list": student_name_list,
        "student_count_list_in_subject": student_count_list_in_subject,
        "student_count_list_in_course": student_count_list_in_course,
        "course_name_list": course_name_list,
        # Analytics Additions
        "total_fee_collected": total_fee_collected,
        "total_fee_pending": total_fee_pending,
        "pass_count": pass_count,
        "fail_count": fail_count,
        "enrollment_months": json.dumps(months),
        "enrollment_counts": json.dumps(monthly_enrollments),
        "staff_analytics": staff_analytics,
        # Action & Activity Lists
        "pending_student_leaves": pending_student_leaves,
        "pending_staff_leaves": pending_staff_leaves,
        "total_pending_feedbacks": total_pending_feedbacks,
        "pending_certs": pending_certs,
        "recent_students": recent_students,
        "recent_payments": recent_payments,
        "today_events": today_events,
        "upcoming_events": upcoming_events,
        "course_stats": course_stats,
        "fee_months_labels": json.dumps(fee_months_labels),
        "fee_months_collected": json.dumps(fee_months_collected),
        "male_students": male_students,
        "female_students": female_students,
        "today_attendance_sessions": today_attendance_sessions,
        "recent_notifs": recent_notifs,
    }
    return render(request, 'hod_template/home_content.html', context)

@login_required(login_url='/')
@admin_required
def export_staff_analytics(request):
    import csv
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="staff_performance_analytics.csv"'

    writer = csv.writer(response)
    writer.writerow(['Staff Name', 'Department', 'Subjects Taught', 'Attendance Sessions Taken', 'Results Published'])

    all_staff = Staff.objects.all()
    for staff in all_staff:
        subjects_taught = Subject.objects.filter(staff=staff).count()
        attendance_taken = Attendance.objects.filter(subject__staff=staff).count()
        results_published = StudentResult.objects.filter(subject__staff=staff).count()
        department = staff.course.name if staff.course else "N/A"
        
        writer.writerow([
            staff.admin.get_full_name(),
            department,
            subjects_taught,
            attendance_taken,
            results_published
        ])

    return response


@login_required(login_url='/')
@admin_required
def add_staff(request):
    form = StaffForm(request.POST or None, request.FILES or None)
    context = {'form': form, 'page_title': 'Add Staff'}
    if request.method == 'POST':
        if form.is_valid():
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name') or ''
            address = form.cleaned_data.get('address')
            email = form.cleaned_data.get('email')
            gender = form.cleaned_data.get('gender')
            password = form.cleaned_data.get('password') or 'staff123'
            course = form.cleaned_data.get('course')
            passport = request.FILES.get('profile_pic')
            fs = FileSystemStorage()
            filename = fs.save(passport.name, passport) if passport else None
            passport_url = fs.url(filename) if filename else None
            try:
                user = CustomUser.objects.create_user(
                    email=email, password=password, user_type=2, first_name=first_name, last_name=last_name)
                user.gender = gender
                user.address = address
                if passport_url:
                    user.profile_pic = passport_url
                user.save()
                
                # Save additional custom fields
                staff = user.staff
                staff.course = course
                staff.monthly_salary = request.POST.get('monthly_salary') or 0.00
                staff.experience = request.POST.get('experience') or 0
                staff.religion = request.POST.get('religion', '')
                staff.blood_group = request.POST.get('blood_group', '')
                doj = request.POST.get('date_of_joining')
                if doj:
                    staff.date_of_joining = doj
                staff.save()
                
                messages.success(request, "Successfully Added")
                return redirect(reverse('add_staff'))

            except Exception as e:
                messages.error(request, "Could Not Add " + str(e))
        else:
            error_details = ' '.join([f"{f}: {e}" for f, e in form.errors.items()])
            messages.error(request, f"Please fulfil all requirements. {error_details}")

    return render(request, 'hod_template/add_staff_template.html', context)


@login_required(login_url='/')
@admin_required
def add_student(request):
    student_form = StudentForm(request.POST or None, request.FILES or None)
    context = {'form': student_form, 'page_title': 'Add Student'}
    if request.method == 'POST':
        if student_form.is_valid():
            first_name = student_form.cleaned_data.get('first_name')
            last_name = student_form.cleaned_data.get('last_name')
            address = student_form.cleaned_data.get('address')
            email = student_form.cleaned_data.get('email')
            gender = student_form.cleaned_data.get('gender')
            password = student_form.cleaned_data.get('password')
            course = student_form.cleaned_data.get('course')
            session = student_form.cleaned_data.get('session')
            passport = request.FILES.get('profile_pic')
            try:
                user = CustomUser.objects.create_user(
                    email=email, password=password, user_type=3, first_name=first_name, last_name=last_name)
                user.gender = gender
                user.address = address
                if passport:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    user.profile_pic = fs.url(filename)
                user.save()

                # Map new fields to Student profile
                student = user.student
                student.session = session
                student.course = course
                student.current_semester = student_form.cleaned_data.get('current_semester') or 1
                student.division = student_form.cleaned_data.get('division')
                
                # eSkooly student admission fields
                student.registration_no = student_form.cleaned_data.get('registration_no')
                student.discount_in_fee = student_form.cleaned_data.get('discount_in_fee') or 0
                student.mobile = student_form.cleaned_data.get('mobile')
                student.dob = student_form.cleaned_data.get('dob')
                student.cnic = student_form.cleaned_data.get('cnic')
                student.orphan = student_form.cleaned_data.get('orphan') or 'No'
                student.cast = student_form.cleaned_data.get('cast')
                student.osc = student_form.cleaned_data.get('osc') or 'No'
                student.identification_mark = student_form.cleaned_data.get('identification_mark')
                student.previous_school = student_form.cleaned_data.get('previous_school')
                student.religion = student_form.cleaned_data.get('religion')
                student.blood_group = student_form.cleaned_data.get('blood_group')
                student.previous_roll_no = student_form.cleaned_data.get('previous_roll_no')
                student.disease = student_form.cleaned_data.get('disease')
                student.additional_note = student_form.cleaned_data.get('additional_note')
                student.siblings = student_form.cleaned_data.get('siblings') or 0
                
                # Father/Guardian Details
                student.father_name = student_form.cleaned_data.get('father_name')
                student.father_nic = student_form.cleaned_data.get('father_nic')
                student.father_occupation = student_form.cleaned_data.get('father_occupation')
                student.father_education = student_form.cleaned_data.get('father_education')
                student.father_mobile = student_form.cleaned_data.get('father_mobile')
                student.father_profession = student_form.cleaned_data.get('father_profession')
                student.father_income = student_form.cleaned_data.get('father_income')
                
                # Mother Details
                student.mother_name = student_form.cleaned_data.get('mother_name')
                student.mother_nic = student_form.cleaned_data.get('mother_nic')
                student.mother_occupation = student_form.cleaned_data.get('mother_occupation')
                student.mother_education = student_form.cleaned_data.get('mother_education')
                student.mother_mobile = student_form.cleaned_data.get('mother_mobile')
                student.mother_profession = student_form.cleaned_data.get('mother_profession')
                student.mother_income = student_form.cleaned_data.get('mother_income')
                
                student.save()

                messages.success(request, "Successfully Added")
                return redirect(reverse('add_student'))
            except Exception as e:
                messages.error(request, "Could Not Add: " + str(e))
        else:
            messages.error(request, "Could Not Add: Form is invalid")
    return render(request, 'hod_template/add_student_template.html', context)


@login_required(login_url='/')
@admin_required
def add_course(request):
    form = CourseForm(request.POST or None)
    context = {
        'form': form,
        'page_title': 'Add Course',
        'teacher_count': Staff.objects.count(),
        'teachers': Staff.objects.select_related('admin').all()
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            monthly_fees = form.cleaned_data.get('monthly_fees')
            class_teacher = form.cleaned_data.get('class_teacher')
            try:
                course = Course()
                course.name = name
                course.monthly_fees = monthly_fees
                course.class_teacher = class_teacher
                course.save()
                messages.success(request, "Successfully Added")
                return redirect(reverse('add_course'))
            except Exception as e:
                messages.error(request, f"Could Not Add: {str(e)}")
        else:
            messages.error(request, "Could Not Add")
    return render(request, 'hod_template/add_course_template.html', context)


@login_required(login_url='/')
@admin_required
def add_subject(request):
    courses = Course.objects.all()
    teachers = Staff.objects.select_related('admin').all()
    context = {
        'courses': courses,
        'teachers': teachers,
        'page_title': 'Add Subject'
    }
    if request.method == 'POST':
        course_id = request.POST.get('course')
        subject_names = request.POST.getlist('subject_name[]')
        marks_list = request.POST.getlist('marks[]')
        staff_ids = request.POST.getlist('staff[]')
        
        try:
            course = Course.objects.get(id=course_id)
            for i in range(len(subject_names)):
                name = subject_names[i]
                marks = int(marks_list[i]) if i < len(marks_list) and marks_list[i].isdigit() else 100
                staff_id = staff_ids[i] if i < len(staff_ids) else None
                if name and staff_id:
                    staff = Staff.objects.get(id=staff_id)
                    Subject.objects.create(name=name, marks=marks, staff=staff, course=course)
            
            messages.success(request, "Successfully Added Subjects")
            return redirect(reverse('manage_subject'))
        except Exception as e:
            messages.error(request, f"Could Not Add: {str(e)}")
            
    return render(request, 'hod_template/add_subject_template.html', context)


@login_required(login_url='/')
@admin_required
def manage_staff(request):
    allStaff = CustomUser.objects.filter(user_type=2)
    context = {
        'allStaff': allStaff,
        'page_title': 'Manage Staff'
    }
    return render(request, "hod_template/manage_staff.html", context)


@login_required(login_url='/')
@admin_required
def manage_student(request):
    students = CustomUser.objects.filter(user_type=3).select_related('student', 'student__course', 'student__session')
    courses  = Course.objects.all()
    sessions = Session.objects.all()
    
    course_filter = request.GET.get('course', '')
    session_filter = request.GET.get('session', '')
    semester_filter = request.GET.get('semester', '')
    division_filter = request.GET.get('division', '')
    
    if course_filter:
        students = students.filter(student__course_id=course_filter)
    if session_filter:
        students = students.filter(student__session_id=session_filter)
    if semester_filter:
        students = students.filter(student__current_semester=semester_filter)
    if division_filter:
        students = students.filter(student__division__iexact=division_filter)
        
    context = {
        'students': students,
        'courses': courses,
        'sessions': sessions,
        'selected_course': course_filter,
        'selected_session': session_filter,
        'selected_semester': semester_filter,
        'selected_division': division_filter,
        'page_title': 'Manage Students'
    }
    return render(request, "hod_template/manage_student.html", context)


@login_required(login_url='/')
@admin_required
def manage_course(request):
    # Annotate each course with total students and gender distribution
    courses = Course.objects.all().annotate(
        total_students=Count('student'),
        boys=Count('student', filter=Q(student__admin__gender='M')),
        girls=Count('student', filter=Q(student__admin__gender='F')),
        na=Count('student', filter=~Q(student__admin__gender__in=['M', 'F']))
    )
    for course in courses:
        total = course.total_students
        if total > 0:
            course.boys_pct = int(round((course.boys / total) * 100))
            course.girls_pct = int(round((course.girls / total) * 100))
            course.na_pct = int(round((course.na / total) * 100))
        else:
            course.boys_pct = course.girls_pct = course.na_pct = 0
    context = {
        'courses': courses,
        'page_title': 'Manage Courses'
    }
    return render(request, "hod_template/manage_course.html", context)


@login_required(login_url='/')
@admin_required
def manage_subject(request):
    subjects = Subject.objects.select_related('course', 'staff').all()
    # Group subjects by course for card layout
    courses_dict = {}
    for subject in subjects:
        course = subject.course
        if course.id not in courses_dict:
            courses_dict[course.id] = {
                'course': course,
                'subjects': [],
                'count': 0,
            }
        courses_dict[course.id]['subjects'].append(subject)
        courses_dict[course.id]['count'] += 1
    # Calculate total marks
    for data in courses_dict.values():
        data['total_marks'] = sum(s.marks for s in data['subjects'])
    course_groups = list(courses_dict.values())
    context = {
        'subjects': subjects,
        'course_groups': course_groups,
        'page_title': 'Manage Subjects'
    }
    return render(request, "hod_template/manage_subject.html", context)


@login_required(login_url='/')
@admin_required
def edit_staff(request, staff_id):
    staff = get_object_or_404(Staff, id=staff_id)
    form = StaffForm(request.POST or None, instance=staff)
    context = {
        'form': form,
        'staff_id': staff_id,
        'page_title': 'Edit Staff'
    }
    if request.method == 'POST':
        if form.is_valid():
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name')
            address = form.cleaned_data.get('address')
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            gender = form.cleaned_data.get('gender')
            password = form.cleaned_data.get('password') or None
            course = form.cleaned_data.get('course')
            passport = request.FILES.get('profile_pic') or None
            try:
                user = CustomUser.objects.get(id=staff.admin.id)
                user.username = username
                user.email = email
                if password != None:
                    user.set_password(password)
                if passport != None:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    passport_url = fs.url(filename)
                    user.profile_pic = passport_url
                user.first_name = first_name
                user.last_name = last_name
                user.gender = gender
                user.address = address
                staff.course = course
                user.save()
                staff.save()
                messages.success(request, "Successfully Updated")
                return redirect(reverse('edit_staff', args=[staff_id]))
            except Exception as e:
                messages.error(request, "Could Not Update " + str(e))
        else:
            messages.error(request, "Please fill form properly")
    
    return render(request, "hod_template/edit_staff_template.html", context)


@login_required(login_url='/')
@admin_required
def edit_student(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    form = StudentForm(request.POST or None, instance=student)
    context = {
        'form': form,
        'student_id': student_id,
        'page_title': 'Edit Student'
    }
    if request.method == 'POST':
        if form.is_valid():
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name')
            address = form.cleaned_data.get('address')
            email = form.cleaned_data.get('email')
            gender = form.cleaned_data.get('gender')
            password = form.cleaned_data.get('password') or None
            course = form.cleaned_data.get('course')
            session = form.cleaned_data.get('session')
            passport = request.FILES.get('profile_pic') or None
            try:
                user = CustomUser.objects.get(id=student.admin.id)
                if passport != None:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    passport_url = fs.url(filename)
                    user.profile_pic = passport_url
                user.email = email
                if password != None:
                    user.set_password(password)
                user.first_name = first_name
                user.last_name = last_name
                user.gender = gender
                user.address = address
                user.save()

                student.session = session
                student.course = course
                student.current_semester = form.cleaned_data.get('current_semester') or student.current_semester
                student.division = form.cleaned_data.get('division') or student.division
                
                # eSkooly student admission fields
                student.registration_no = form.cleaned_data.get('registration_no')
                student.discount_in_fee = form.cleaned_data.get('discount_in_fee') or 0
                student.mobile = form.cleaned_data.get('mobile')
                student.dob = form.cleaned_data.get('dob')
                student.cnic = form.cleaned_data.get('cnic')
                student.orphan = form.cleaned_data.get('orphan') or 'No'
                student.cast = form.cleaned_data.get('cast')
                student.osc = form.cleaned_data.get('osc') or 'No'
                student.identification_mark = form.cleaned_data.get('identification_mark')
                student.previous_school = form.cleaned_data.get('previous_school')
                student.religion = form.cleaned_data.get('religion')
                student.blood_group = form.cleaned_data.get('blood_group')
                student.previous_roll_no = form.cleaned_data.get('previous_roll_no')
                student.disease = form.cleaned_data.get('disease')
                student.additional_note = form.cleaned_data.get('additional_note')
                student.siblings = form.cleaned_data.get('siblings') or 0
                
                # Father/Guardian Details
                student.father_name = form.cleaned_data.get('father_name')
                student.father_nic = form.cleaned_data.get('father_nic')
                student.father_occupation = form.cleaned_data.get('father_occupation')
                student.father_education = form.cleaned_data.get('father_education')
                student.father_mobile = form.cleaned_data.get('father_mobile')
                student.father_profession = form.cleaned_data.get('father_profession')
                student.father_income = form.cleaned_data.get('father_income')
                
                # Mother Details
                student.mother_name = form.cleaned_data.get('mother_name')
                student.mother_nic = form.cleaned_data.get('mother_nic')
                student.mother_occupation = form.cleaned_data.get('mother_occupation')
                student.mother_education = form.cleaned_data.get('mother_education')
                student.mother_mobile = form.cleaned_data.get('mother_mobile')
                student.mother_profession = form.cleaned_data.get('mother_profession')
                student.mother_income = form.cleaned_data.get('mother_income')

                student.save()
                messages.success(request, "Successfully Updated")
                return redirect(reverse('edit_student', args=[student_id]))
            except Exception as e:
                messages.error(request, "Could Not Update " + str(e))
        else:
            messages.error(request, "Please Fill Form Properly!")
            
    return render(request, "hod_template/edit_student_template.html", context)


@login_required(login_url='/')
@admin_required
def admin_view_student_report(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    subjects = Subject.objects.filter(course=student.course)
    context = {
        'student': student,
        'subjects': subjects,
        'page_title': 'Student Report'
    }
    return render(request, "hod_template/student_report_template.html", context)


@login_required(login_url='/')
@admin_required
def edit_course(request, course_id):
    instance = get_object_or_404(Course, id=course_id)
    form = CourseForm(request.POST or None, instance=instance)
    context = {
        'form': form,
        'course_id': course_id,
        'page_title': 'Edit Course',
        'teachers': Staff.objects.select_related('admin').all()
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            monthly_fees = form.cleaned_data.get('monthly_fees')
            class_teacher = form.cleaned_data.get('class_teacher')
            try:
                course = Course.objects.get(id=course_id)
                course.name = name
                course.monthly_fees = monthly_fees
                course.class_teacher = class_teacher
                course.save()
                messages.success(request, "Successfully Updated")
            except Exception as e:
                messages.error(request, f"Could Not Update: {str(e)}")
        else:
            messages.error(request, "Could Not Update")

    return render(request, 'hod_template/edit_course_template.html', context)


@login_required(login_url='/')
@admin_required
def edit_subject(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    subjects = Subject.objects.filter(course=course)
    teachers = Staff.objects.select_related('admin').all()
    context = {
        'course': course,
        'subjects': subjects,
        'teachers': teachers,
        'page_title': f'Update Subjects - {course.name}'
    }
    if request.method == 'POST':
        subject_names = request.POST.getlist('subject_name[]')
        marks_list = request.POST.getlist('marks[]')
        staff_ids = request.POST.getlist('staff[]')
        subject_ids = request.POST.getlist('subject_id[]')
        
        try:
            # We can delete existing subjects that are no longer present
            existing_ids = [int(id) for id in subject_ids if id]
            Subject.objects.filter(course=course).exclude(id__in=existing_ids).delete()
            
            for i in range(len(subject_names)):
                name = subject_names[i]
                marks = int(marks_list[i]) if i < len(marks_list) and marks_list[i].isdigit() else 100
                staff_id = staff_ids[i] if i < len(staff_ids) else None
                s_id = subject_ids[i] if i < len(subject_ids) else None
                
                if name and staff_id:
                    staff = Staff.objects.get(id=staff_id)
                    if s_id:
                        # Update existing
                        subject = Subject.objects.get(id=s_id)
                        subject.name = name
                        subject.marks = marks
                        subject.staff = staff
                        subject.save()
                    else:
                        # Create new
                        Subject.objects.create(name=name, marks=marks, staff=staff, course=course)
                        
            messages.success(request, "Successfully Updated Subjects")
            return redirect(reverse('manage_subject'))
        except Exception as e:
            messages.error(request, f"Could Not Update: {str(e)}")

    return render(request, 'hod_template/edit_subject_template.html', context)


@login_required(login_url='/')
@admin_required
def add_session(request):
    form = SessionForm(request.POST or None)
    context = {'form': form, 'page_title': 'Add Session'}
    if request.method == 'POST':
        if form.is_valid():
            try:
                form.save()
                messages.success(request, "Session Created")
                return redirect(reverse('add_session'))
            except Exception as e:
                messages.error(request, 'Could Not Add ' + str(e))
        else:
            messages.error(request, 'Fill Form Properly ')
    return render(request, "hod_template/add_session_template.html", context)


@login_required(login_url='/')
@admin_required
def manage_session(request):
    sessions = Session.objects.all()
    context = {'sessions': sessions, 'page_title': 'Manage Sessions'}
    return render(request, "hod_template/manage_session.html", context)


@login_required(login_url='/')
@admin_required
def edit_session(request, session_id):
    instance = get_object_or_404(Session, id=session_id)
    form = SessionForm(request.POST or None, instance=instance)
    context = {'form': form, 'session_id': session_id,
               'page_title': 'Edit Session'}
    if request.method == 'POST':
        if form.is_valid():
            try:
                form.save()
                messages.success(request, "Session Updated")
                return redirect(reverse('edit_session', args=[session_id]))
            except Exception as e:
                messages.error(
                    request, "Session Could Not Be Updated " + str(e))
                return render(request, "hod_template/edit_session_template.html", context)
        else:
            messages.error(request, "Invalid Form Submitted ")
            return render(request, "hod_template/edit_session_template.html", context)

    else:
        return render(request, "hod_template/edit_session_template.html", context)


@csrf_exempt
@login_required(login_url='/')
@admin_required
def check_email_availability(request):
    email = request.POST.get("email")
    try:
        user = CustomUser.objects.filter(email=email).exists()
        if user:
            return HttpResponse(True)
        return HttpResponse(False)
    except Exception as e:
        return HttpResponse(False)


@csrf_exempt
@login_required(login_url='/')
@admin_required
def student_feedback_message(request):
    if request.method != 'POST':
        feedbacks = FeedbackStudent.objects.select_related('student__admin').all()
        context = {
            'feedbacks': feedbacks,
            'page_title': 'Student Feedback Messages'
        }
        return render(request, 'hod_template/student_feedback_template.html', context)
    else:
        feedback_id = request.POST.get('id')
        try:
            feedback = get_object_or_404(FeedbackStudent, id=feedback_id)
            reply = request.POST.get('reply')
            feedback.reply = reply
            feedback.save()
            return HttpResponse(True)
        except Exception as e:
            return HttpResponse(False)


@csrf_exempt
@login_required(login_url='/')
@admin_required
def staff_feedback_message(request):
    if request.method != 'POST':
        feedbacks = FeedbackStaff.objects.all()
        context = {
            'feedbacks': feedbacks,
            'page_title': 'Staff Feedback Messages'
        }
        return render(request, 'hod_template/staff_feedback_template.html', context)
    else:
        feedback_id = request.POST.get('id')
        try:
            feedback = get_object_or_404(FeedbackStaff, id=feedback_id)
            reply = request.POST.get('reply')
            feedback.reply = reply
            feedback.save()
            return HttpResponse(True)
        except Exception as e:
            return HttpResponse(False)


@csrf_exempt
@login_required(login_url='/')
@admin_required
def view_staff_leave(request):
    if request.method != 'POST':
        allLeave = LeaveReportStaff.objects.all()
        context = {
            'allLeave': allLeave,
            'page_title': 'Leave Applications From Staff'
        }
        return render(request, "hod_template/staff_leave_view.html", context)
    else:
        id = request.POST.get('id')
        status = request.POST.get('status')
        if (status == '1'):
            status = 1
        else:
            status = -1
        try:
            leave = get_object_or_404(LeaveReportStaff, id=id)
            leave.status = status
            leave.save()
            
            # Send Email Notification for Staff Leave
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                status_text = "Approved" if status == 1 else "Rejected"
                subject_text = f"Leave Application {status_text}"
                message = f"Hello {leave.staff.admin.first_name},\n\nYour leave application from {leave.date} has been {status_text}.\n\nRegards,\nCollege ERP System"
                send_mail(subject_text, message, settings.EMAIL_HOST_USER, [leave.staff.admin.email])
            except Exception as e:
                print("Email error:", e)
                
            return HttpResponse(True)
        except Exception as e:
            return HttpResponse("False")


@csrf_exempt
@login_required(login_url='/')
@admin_required
def view_student_leave(request):
    if request.method != 'POST':
        allLeave = LeaveReportStudent.objects.select_related('student__admin').all()
        context = {
            'allLeave': allLeave,
            'page_title': 'Leave Applications From Students'
        }
        return render(request, "hod_template/student_leave_view.html", context)
    else:
        id = request.POST.get('id')
        status = request.POST.get('status')
        if (status == '1'):
            status = 1
        else:
            status = -1
        try:
            leave = get_object_or_404(LeaveReportStudent, id=id)
            leave.status = status
            leave.save()
            
            # Send Email Notification for Student Leave
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                status_text = "Approved" if status == 1 else "Rejected"
                subject_text = f"Leave Application {status_text}"
                message = f"Hello {leave.student.admin.first_name},\n\nYour leave application from {leave.date} has been {status_text}.\n\nRegards,\nCollege ERP System"
                send_mail(subject_text, message, settings.EMAIL_HOST_USER, [leave.student.admin.email])
            except Exception as e:
                print("Email error:", e)
                
            return HttpResponse(True)
        except Exception as e:
            return HttpResponse("False")


@login_required(login_url='/')
@admin_required
def admin_view_attendance(request):
    subjects = Subject.objects.all()
    sessions = Session.objects.all()
    context = {
        'subjects': subjects,
        'sessions': sessions,
        'page_title': 'View Attendance'
    }

    return render(request, "hod_template/admin_view_attendance.html", context)


@csrf_exempt
@login_required(login_url='/')
@admin_required
def get_admin_attendance(request):
    subject_id = request.POST.get('subject')
    session_id = request.POST.get('session')
    attendance_date_id = request.POST.get('attendance_date_id')
    try:
        subject = get_object_or_404(Subject, id=subject_id)
        session = get_object_or_404(Session, id=session_id)
        attendance = get_object_or_404(
            Attendance, id=attendance_date_id, session=session)
        attendance_reports = AttendanceReport.objects.filter(
            attendance=attendance)
        json_data = []
        for report in attendance_reports:
            data = {
                "status":  str(report.status),
                "name": str(report.student)
            }
            json_data.append(data)
        return JsonResponse(json.dumps(json_data), safe=False)
    except Exception as e:
        return JsonResponse(json.dumps([]), safe=False)


@login_required(login_url='/')
@admin_required
def admin_view_profile(request):
    admin = get_object_or_404(Admin, admin=request.user)
    form = AdminForm(request.POST or None, request.FILES or None,
                     instance=admin)
    context = {'form': form,
               'page_title': 'View/Edit Profile'
               }
    if request.method == 'POST':
        try:
            if form.is_valid():
                first_name = form.cleaned_data.get('first_name')
                last_name = form.cleaned_data.get('last_name')
                password = form.cleaned_data.get('password') or None
                passport = request.FILES.get('profile_pic') or None
                custom_user = admin.admin
                if password != None:
                    custom_user.set_password(password)
                if passport != None:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    passport_url = fs.url(filename)
                    custom_user.profile_pic = passport_url
                custom_user.first_name = first_name
                custom_user.last_name = last_name
                custom_user.save()
                messages.success(request, "Profile Updated!")
                return redirect(reverse('admin_view_profile'))
            else:
                messages.error(request, "Invalid Data Provided")
        except Exception as e:
            messages.error(
                request, "Error Occured While Updating Profile " + str(e))
    return render(request, "hod_template/admin_view_profile.html", context)


@login_required(login_url='/')
@admin_required
def admin_notify_staff(request):
    staff = CustomUser.objects.filter(user_type=2)
    context = {
        'page_title': "Send Notifications To Staff",
        'allStaff': staff
    }
    return render(request, "hod_template/staff_notification.html", context)


@login_required(login_url='/')
@admin_required
def admin_notify_student(request):
    student = CustomUser.objects.filter(user_type=3)
    context = {
        'page_title': "Send Notifications To Students",
        'students': student
    }
    return render(request, "hod_template/student_notification.html", context)


@csrf_exempt
@login_required(login_url='/')
@admin_required
def send_student_notification(request):
    id = request.POST.get('id')
    message = request.POST.get('message')
    student = get_object_or_404(Student, admin_id=id)
    try:
        url = "https://fcm.googleapis.com/fcm/send"
        body = {
            'notification': {
                'title': "Student Management System",
                'body': message,
                'click_action': reverse('student_view_notification'),
                'icon': static('dist/img/AdminLTELogo.png')
            },
            'to': student.admin.fcm_token
        }
        fcm_key = os.environ.get('FCM_SERVER_KEY', '')
        if not fcm_key:
            return HttpResponse("False")
        headers = {'Authorization': fcm_key,
                   'Content-Type': 'application/json'}
        data = requests.post(url, data=json.dumps(body), headers=headers, timeout=10)
        notification = NotificationStudent(student=student, message=message)
        notification.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


@csrf_exempt
@login_required(login_url='/')
@admin_required
def send_staff_notification(request):
    id = request.POST.get('id')
    message = request.POST.get('message')
    staff = get_object_or_404(Staff, admin_id=id)
    try:
        url = "https://fcm.googleapis.com/fcm/send"
        body = {
            'notification': {
                'title': "Student Management System",
                'body': message,
                'click_action': reverse('staff_view_notification'),
                'icon': static('dist/img/AdminLTELogo.png')
            },
            'to': staff.admin.fcm_token
        }
        fcm_key = os.environ.get('FCM_SERVER_KEY', '')
        if not fcm_key:
            return HttpResponse("False")
        headers = {'Authorization': fcm_key,
                   'Content-Type': 'application/json'}
        data = requests.post(url, data=json.dumps(body), headers=headers, timeout=10)
        notification = NotificationStaff(staff=staff, message=message)
        notification.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


@login_required(login_url='/')
@admin_required
def delete_staff(request, staff_id):
    staff = get_object_or_404(CustomUser, staff__id=staff_id)
    staff.delete()
    messages.success(request, "Staff deleted successfully!")
    return redirect(reverse('manage_staff'))


@login_required(login_url='/')
@admin_required
def delete_student(request, student_id):
    student = get_object_or_404(CustomUser, student__id=student_id)
    student.delete()
    messages.success(request, "Student deleted successfully!")
    return redirect(reverse('manage_student'))


@login_required(login_url='/')
@admin_required
def delete_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    try:
        course.delete()
        messages.success(request, "Course deleted successfully!")
    except Exception:
        messages.error(
            request, "Sorry, some students are assigned to this course already. Kindly change the affected student course and try again")
    return redirect(reverse('manage_course'))


@login_required(login_url='/')
@admin_required
def delete_subject(request, subject_id):
    subject = get_object_or_404(Subject, id=subject_id)
    subject.delete()
    messages.success(request, "Subject deleted successfully!")
    return redirect(reverse('manage_subject'))


@login_required(login_url='/')
@admin_required
def delete_session(request, session_id):
    session = get_object_or_404(Session, id=session_id)
    try:
        session.delete()
        messages.success(request, "Session deleted successfully!")
    except Exception:
        messages.error(
            request, "There are students assigned to this session. Please move them to another session.")
    return redirect(reverse('manage_session'))


# --- HOD / Admin ERP Management Views ---

@login_required(login_url='/')
@admin_required
def admin_manage_placements(request):
    drives = PlacementDrive.objects.all().order_by('-drive_date')
    registrations = PlacementRegistration.objects.all().select_related('student__admin', 'drive')
    
    if request.method == "POST":
        company_name = request.POST.get("company_name")
        job_role = request.POST.get("job_role")
        eligibility = request.POST.get("eligibility")
        package = request.POST.get("package")
        drive_date = request.POST.get("drive_date")
        status = request.POST.get("status", "Active")
        description = request.POST.get("description")
        
        try:
            PlacementDrive.objects.create(
                company_name=company_name,
                job_role=job_role,
                eligibility=eligibility,
                package=package,
                drive_date=drive_date,
                status=status,
                description=description
            )
            messages.success(request, "Placement drive added successfully.")
            return redirect(reverse('admin_manage_placements'))
        except Exception as e:
            messages.error(request, f"Failed to add drive: {e}")
            
    context = {
        'page_title': "Manage Campus Placements",
        'drives': drives,
        'registrations': registrations
    }
    return render(request, "hod_template/manage_placements.html", context)


@login_required(login_url='/')
@admin_required
def admin_manage_certificates(request):
    cert_requests = CertificateRequest.objects.all().select_related('student__admin').order_by('-id')
    context = {
        'page_title': "Manage Certificate Requests",
        'requests': cert_requests
    }
    return render(request, "hod_template/manage_certificates.html", context)


@login_required(login_url='/')
@admin_required
def admin_approve_certificate(request, req_id):
    cert_req = get_object_or_404(CertificateRequest, id=req_id)
    cert_req.status = "Approved"
    cert_req.approved_date = date.today()
    cert_req.save()
    messages.success(request, f"Approved request for {cert_req.student.admin.get_full_name()}.")
    return redirect(reverse('admin_manage_certificates'))


@login_required(login_url='/')
@admin_required
def admin_reject_certificate(request, req_id):
    cert_req = get_object_or_404(CertificateRequest, id=req_id)
    cert_req.status = "Rejected"
    cert_req.save()
    messages.success(request, f"Rejected request for {cert_req.student.admin.get_full_name()}.")
    return redirect(reverse('admin_manage_certificates'))


@login_required(login_url='/')
@admin_required
def admin_manage_fees(request):
    students = Student.objects.all().select_related('admin', 'course')
    payments = FeePayment.objects.all().select_related('fee_record__student__admin').order_by('-payment_date')
    fee_records = FeeRecord.objects.all().select_related('student__admin').order_by('-due_date')
    
    context = {
        'page_title': "Fee Management Dashboard",
        'students': students,
        'payments': payments,
        'fee_records': fee_records
    }
    return render(request, "hod_template/manage_fees.html", context)


@login_required(login_url='/')
@admin_required
def admin_add_fee(request):
    if request.method == "POST":
        student_id = request.POST.get("student")
        category = request.POST.get("category")
        amount = request.POST.get("amount")
        due_date = request.POST.get("due_date")
        
        try:
            if student_id == "ALL":
                students = Student.objects.all()
                fee_records_to_create = []
                for student in students:
                    fee_records_to_create.append(
                        FeeRecord(
                            student=student,
                            category=category,
                            amount=amount,
                            amount_paid=0.0,
                            due_date=due_date,
                            status="Unpaid"
                        )
                    )
                FeeRecord.objects.bulk_create(fee_records_to_create)
                messages.success(request, f"Fee records created successfully for {students.count()} students.")
            else:
                student = Student.objects.get(id=student_id)
                FeeRecord.objects.create(
                    student=student,
                    category=category,
                    amount=amount,
                    amount_paid=0.0,
                    due_date=due_date,
                    status="Unpaid"
                )
                messages.success(request, "Fee record created successfully.")
        except Exception as e:
            messages.error(request, f"Error creating fee record(s): {e}")
            
    return redirect(reverse('admin_manage_fees'))


@login_required(login_url='/')
@admin_required
def admin_edit_fee(request, fee_id):
    fee_record = get_object_or_404(FeeRecord, id=fee_id)
    if request.method == "POST":
        fee_record.category = request.POST.get("category")
        fee_record.amount = request.POST.get("amount")
        fee_record.due_date = request.POST.get("due_date")
        fee_record.status = request.POST.get("status")
        try:
            fee_record.save()
            messages.success(request, "Fee record updated successfully.")
            return redirect(reverse('admin_manage_fees'))
        except Exception as e:
            messages.error(request, f"Error updating fee record: {e}")

    context = {
        'page_title': "Edit Fee Record",
        'fee_record': fee_record
    }
    return render(request, "hod_template/edit_fee.html", context)


@login_required(login_url='/')
@admin_required
def admin_print_fee(request, fee_id):
    fee_record = get_object_or_404(FeeRecord, id=fee_id)
    payments = FeePayment.objects.filter(fee_record=fee_record).order_by('-payment_date')
    context = {
        'page_title': "Print Fee Invoice",
        'fee_record': fee_record,
        'payments': payments
    }
    return render(request, "hod_template/fee_invoice.html", context)


@login_required(login_url='/')
@admin_required
def admin_manage_timetable(request):
    courses = Course.objects.all()
    subjects = Subject.objects.all()
    timetable_slots = Timetable.objects.all().select_related('course', 'subject').order_by('day_of_week', 'start_time')
    
    context = {
        'page_title': "Weekly Class Timetable Manager",
        'courses': courses,
        'subjects': subjects,
        'timetable_slots': timetable_slots
    }
    return render(request, "hod_template/manage_timetable.html", context)


@login_required(login_url='/')
@admin_required
def admin_add_timetable_slot(request):
    if request.method == "POST":
        course_id = request.POST.get("course")
        subject_id = request.POST.get("subject")
        day = request.POST.get("day_of_week")
        start = request.POST.get("start_time")
        end = request.POST.get("end_time")
        classroom = request.POST.get("classroom")
        
        try:
            course = Course.objects.get(id=course_id)
            subject = Subject.objects.get(id=subject_id)
            Timetable.objects.create(
                course=course,
                subject=subject,
                day_of_week=day,
                start_time=start,
                end_time=end,
                classroom=classroom
            )
            messages.success(request, "Timetable slot added successfully.")
        except Exception as e:
            messages.error(request, f"Error adding timetable slot: {e}")
            
    return redirect(reverse('admin_manage_timetable'))


@login_required(login_url='/')
@admin_required
def admin_manage_registrations(request):
    registrations = StudentRegistration.objects.all().select_related('student__admin').order_by('-created_at')
    context = {
        'page_title': "Online Admission Registrations",
        'registrations': registrations
    }
    return render(request, "hod_template/manage_registrations.html", context)


@login_required(login_url='/')
@admin_required
def admin_view_registration(request, reg_id):
    registration = get_object_or_404(StudentRegistration, id=reg_id)
    context = {
        'page_title': f"Admission Details: {registration.first_name} {registration.surname}",
        'reg': registration,
        'can_edit_registration': True,
    }
    return render(request, "hod_template/view_registration.html", context)


@login_required(login_url='/')
@admin_required
def admin_edit_registration(request, reg_id):
    reg = get_object_or_404(StudentRegistration, id=reg_id)
    
    if request.method == "POST":
        reg.surname = request.POST.get('surname', reg.surname).upper()
        reg.first_name = request.POST.get('first_name', reg.first_name).upper()
        reg.father_name = request.POST.get('father_name', reg.father_name).upper()
        reg.mother_name = request.POST.get('mother_name', reg.mother_name).upper()
        reg.marathi_name = request.POST.get('marathi_name', reg.marathi_name)
        reg.gender = request.POST.get('gender', reg.gender)
        
        dob_val = request.POST.get('dob')
        if dob_val:
            try:
                reg.dob = datetime.strptime(dob_val, "%Y-%m-%d").date()
            except Exception:
                pass
                
        reg.place_of_birth = request.POST.get('place_of_birth', reg.place_of_birth)
        reg.marital_status = request.POST.get('marital_status', reg.marital_status)
        reg.religion = request.POST.get('religion', reg.religion)
        reg.nationality = request.POST.get('nationality', reg.nationality)
        reg.blood_group = request.POST.get('blood_group', reg.blood_group)
        reg.aadhaar_no = request.POST.get('aadhaar_no', reg.aadhaar_no)
        reg.mother_tongue = request.POST.get('mother_tongue', reg.mother_tongue)
        reg.passport_no = request.POST.get('passport_no', reg.passport_no)
        reg.voter_id = request.POST.get('voter_id', reg.voter_id)
        reg.ncc_nss = request.POST.get('ncc_nss', reg.ncc_nss)
        reg.employment_status = request.POST.get('employment_status', reg.employment_status)
        reg.birth_state = request.POST.get('birth_state', reg.birth_state)
        reg.birth_district = request.POST.get('birth_district', reg.birth_district)
        reg.birth_tehsil = request.POST.get('birth_tehsil', reg.birth_tehsil)
        reg.caste_category = request.POST.get('caste_category', reg.caste_category)
        reg.caste = request.POST.get('caste', reg.caste)
        reg.prn_no = request.POST.get('prn_no', reg.prn_no)
        reg.handicap = request.POST.get('handicap', reg.handicap)
        reg.is_orphan = request.POST.get('is_orphan', reg.is_orphan)
        reg.has_device = request.POST.get('has_device', reg.has_device)
        reg.has_internet = request.POST.get('has_internet', reg.has_internet)
        reg.municipal_ward = request.POST.get('municipal_ward', reg.municipal_ward)
        try:
            reg.height = float(request.POST.get('height', reg.height) or 0)
            reg.weight = float(request.POST.get('weight', reg.weight) or 0)
        except ValueError:
            pass
        reg.abc_id = request.POST.get('abc_id', reg.abc_id)
        
        # Address
        reg.address = request.POST.get('address', reg.address)
        reg.state = request.POST.get('state', reg.state)
        reg.district = request.POST.get('district', reg.district)
        reg.tehsil = request.POST.get('tehsil', reg.tehsil)
        reg.city = request.POST.get('city', reg.city)
        reg.pincode = request.POST.get('pincode', reg.pincode)
        
        # Permanent Address
        reg.perm_address = request.POST.get('perm_address', reg.perm_address)
        reg.perm_state = request.POST.get('perm_state', reg.perm_state)
        reg.perm_district = request.POST.get('perm_district', reg.perm_district)
        reg.perm_tehsil = request.POST.get('perm_tehsil', reg.perm_tehsil)
        reg.perm_city = request.POST.get('perm_city', reg.perm_city)
        reg.perm_pincode = request.POST.get('perm_pincode', reg.perm_pincode)
        
        # Guardian
        reg.guardian_occupation = request.POST.get('guardian_occupation', reg.guardian_occupation)
        reg.guardian_mobile = request.POST.get('guardian_mobile', reg.guardian_mobile)
        try:
            reg.guardian_income = float(request.POST.get('guardian_income', reg.guardian_income) or 0)
        except ValueError:
            pass
            
        reg.student_phone = request.POST.get('student_phone', reg.student_phone)
        reg.student_email = request.POST.get('student_email', reg.student_email)
        
        reg.save()
        messages.success(request, "Student Registration Details updated successfully.")
        return redirect(reverse('admin_view_registration', kwargs={'reg_id': reg.id}))
        
    context = {
        'page_title': f"Edit Registration: {reg.first_name} {reg.surname}",
        'reg': reg,
        'dob_str': reg.dob.strftime('%Y-%m-%d') if hasattr(reg.dob, 'strftime') else (str(reg.dob) if reg.dob else '')
    }
    return render(request, "hod_template/edit_registration.html", context)


@login_required(login_url='/')
@admin_required
def admin_delete_registration(request, reg_id):
    reg = get_object_or_404(StudentRegistration, id=reg_id)
    try:
        reg.delete()
        messages.success(request, "Registration deleted successfully. The student will now start with a blank form.")
    except Exception as e:
        messages.error(request, f"Error deleting registration: {e}")
    return redirect(reverse('admin_manage_registrations'))


@login_required(login_url='/')
@admin_required
def admin_events(request):
    """Admin Event Calendar — create, view, and delete college events."""
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        event_type = request.POST.get('event_type', 'event')
        date = request.POST.get('date')
        end_date = request.POST.get('end_date') or None
        description = request.POST.get('description', '')
        if title and date:
            CollegeEvent.objects.create(
                title=title,
                event_type=event_type,
                date=date,
                end_date=end_date,
                description=description,
            )
            messages.success(request, f"Event '{title}' added successfully!")
        else:
            messages.error(request, "Title and Date are required.")
        return redirect(reverse('admin_events'))

    events = CollegeEvent.objects.all().order_by('date')
    color_map = {
        'exam': '#dc3545',
        'holiday': '#28a745',
        'event': '#5e64ff',
        'seminar': '#fd7e14',
        'deadline': '#ffc107',
    }
    events_json = []
    for e in events:
        events_json.append({
            'title': e.title,
            'start': str(e.date),
            'end': str(e.end_date) if e.end_date else str(e.date),
            'color': color_map.get(e.event_type, '#5e64ff'),
            'description': e.description,
        })

    context = {
        'events': events,
        'events_json': json.dumps(events_json),
        'page_title': 'Event Calendar',
        'event_type_choices': CollegeEvent.EVENT_TYPE_CHOICES,
    }
    return render(request, 'hod_template/admin_events.html', context)


@login_required(login_url='/')
@admin_required
def admin_delete_event(request, event_id):
    event = get_object_or_404(CollegeEvent, id=event_id)
    event.delete()
    messages.success(request, f"Event deleted.")
    return redirect(reverse('admin_events'))

@login_required(login_url='/')
@admin_required
def add_parent(request):
    students = Student.objects.all()
    context = {
        'page_title': 'Add Parent',
        'students': students
    }
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        mobile_number = request.POST.get('mobile_number')
        student_id = request.POST.get('student')
        
        try:
            student = Student.objects.get(id=student_id)
            user = CustomUser.objects.create_user(
                email=email, password=password, first_name=first_name, last_name=last_name, user_type='4', gender='M'
            )
            Parent.objects.create(admin=user, student=student, mobile_number=mobile_number)
            messages.success(request, f"Parent account for {first_name} {last_name} created successfully!")
            return redirect(reverse('add_parent'))
        except Exception as e:
            messages.error(request, f"Could not create parent account: {e}")
            return redirect(reverse('add_parent'))
            
    return render(request, 'hod_template/add_parent.html', context)


@login_required(login_url='/')
@admin_required
def manage_parent(request):
    parents = Parent.objects.all().select_related('admin', 'student__admin')
    context = {
        'parents': parents,
        'page_title': 'Manage Parents'
    }
    return render(request, "hod_template/manage_parent.html", context)


@login_required(login_url='/')
@admin_required
def edit_parent(request, parent_id):
    parent = get_object_or_404(Parent, id=parent_id)
    students = Student.objects.all()
    context = {
        'parent': parent,
        'students': students,
        'page_title': 'Edit Parent'
    }
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        mobile_number = request.POST.get('mobile_number')
        student_id = request.POST.get('student')
        
        try:
            student = Student.objects.get(id=student_id)
            user = parent.admin
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            if password:
                user.set_password(password)
            user.save()
            
            parent.student = student
            parent.mobile_number = mobile_number
            parent.save()
            
            messages.success(request, "Parent details updated successfully!")
            return redirect(reverse('edit_parent', args=[parent_id]))
        except Exception as e:
            messages.error(request, f"Could not update parent account: {e}")
            return redirect(reverse('edit_parent', args=[parent_id]))
            
    return render(request, 'hod_template/edit_parent.html', context)


@login_required(login_url='/')
@admin_required
def delete_parent(request, parent_id):
    parent = get_object_or_404(Parent, id=parent_id)
    try:
        parent.admin.delete()  # This will cascade and delete the Parent record too
        messages.success(request, "Parent deleted successfully!")
    except Exception as e:
        messages.error(request, f"Error deleting parent: {e}")
    return redirect(reverse('manage_parent'))

@login_required(login_url='/')
@admin_required
def admin_view_student_id_card(request, student_id):
    student = get_object_or_404(Student.objects.select_related('admin', 'course', 'session'), admin_id=student_id)
    if not student.id_card_code:
        student.id_card_code = f"STU-{student.course.name[:3].upper() if student.course else 'GEN'}-{student.batch_year}-{student.id:04d}"
        student.save()
    context = {
        'page_title': 'Student ID Card',
        'student': student,
        'prn_number': f"PAT-{student.id:04d}-{student.session.start_year.year if student.session else 2026}"
    }
    return render(request, "student_template/student_id_card.html", context)

@login_required(login_url='/')
@admin_required
def admin_view_staff_id_card(request, staff_id):
    staff = get_object_or_404(Staff.objects.select_related('admin', 'course'), admin_id=staff_id)
    if not staff.id_card_code:
        staff.id_card_code = f"EMP-{staff.course.name[:3].upper() if staff.course else 'GEN'}-{staff.id:04d}"
        staff.save()
    context = {
        'page_title': 'Staff ID Card',
        'staff': staff,
        'employee_id': f"EMP-{staff.id:04d}-{staff.admin.created_at.year}"
    }
    return render(request, "staff_template/staff_id_card.html", context)

@login_required(login_url='/')
@admin_required
def admin_manage_batches(request):
    courses = Course.objects.all()
    sessions = Session.objects.all()
    
    # Get unique batch years and semesters currently in system for filtering
    batch_years = Student.objects.values_list('batch_year', flat=True).distinct().order_by('-batch_year')
    semesters = Student.objects.values_list('current_semester', flat=True).distinct().order_by('current_semester')
    
    # Handle filters
    course_id = request.GET.get('course')
    session_id = request.GET.get('session')
    batch_year = request.GET.get('batch_year')
    semester = request.GET.get('semester')
    
    students = Student.objects.all().select_related('admin', 'course', 'session')
    if course_id:
        students = students.filter(course_id=course_id)
    if session_id:
        students = students.filter(session_id=session_id)
    if batch_year:
        students = students.filter(batch_year=batch_year)
    if semester:
        students = students.filter(current_semester=semester)
        
    context = {
        'page_title': 'Manage Batches & ID Cards',
        'courses': courses,
        'sessions': sessions,
        'batch_years': batch_years,
        'semesters': semesters,
        'students': students,
        'selected_course': int(course_id) if course_id else None,
        'selected_session': int(session_id) if session_id else None,
        'selected_batch_year': int(batch_year) if batch_year else None,
        'selected_semester': int(semester) if semester else None,
    }
    return render(request, "hod_template/manage_batches.html", context)

@login_required(login_url='/')
@admin_required
def admin_promote_batch(request):
    if request.method == "POST":
        student_ids = request.POST.getlist('student_ids')
        action = request.POST.get('action') # 'promote' or 'demote'
        
        if not student_ids:
            messages.error(request, "No students selected")
            return redirect(reverse('admin_manage_batches'))
            
        students = Student.objects.filter(id__in=student_ids)
        
        if action == 'promote':
            for student in students:
                student.current_semester += 1
                student.save()
            messages.success(request, f"Successfully promoted {students.count()} students to the next semester.")
        elif action == 'demote':
            for student in students:
                if student.current_semester > 1:
                    student.current_semester -= 1
                    student.save()
            messages.success(request, f"Successfully demoted {students.count()} students to the previous semester.")
            
    return redirect(reverse('admin_manage_batches'))

@login_required(login_url='/')
@admin_required
def admin_print_batch_ids(request):
    student_ids = request.GET.get('ids', '').split(',')
    student_ids = [int(sid) for sid in student_ids if sid.isdigit()]
    
    students = Student.objects.filter(id__in=student_ids).select_related('admin', 'course', 'session')
    
    # Pre-generate unique codes for selected students if they don't have them
    for student in students:
        if not student.id_card_code:
            student.id_card_code = f"STU-{student.course.name[:3].upper() if student.course else 'GEN'}-{student.batch_year}-{student.id:04d}"
            student.save()
            
    context = {
        'page_title': 'Print ID Cards',
        'students': students,
        'is_batch_print': True
    }
    return render(request, "hod_template/print_batch_id_cards.html", context)


def admin_settings_profile(request):
    from .models import InstituteProfile
    profile = InstituteProfile.objects.first()
    if request.method == 'POST':
        if not profile:
            profile = InstituteProfile()
        profile.name = request.POST.get('name')
        profile.phone = request.POST.get('phone')
        profile.website = request.POST.get('website')
        profile.address = request.POST.get('address')
        profile.country = request.POST.get('country')
        profile.target_line = request.POST.get('target_line')
        if 'logo' in request.FILES:
            profile.logo = request.FILES.get('logo')
        profile.save()
        messages.success(request, 'Institute profile updated successfully')
        return redirect('admin_settings_profile')
    return render(request, 'hod_template/settings_profile.html', {'page_title': 'Institute Profile', 'profile': profile})

def admin_settings_fees(request):
    from .models import FeeParticular
    if request.method == 'POST':
        if 'add_fee' in request.POST:
            label = request.POST.get('label')
            amount = request.POST.get('amount')
            is_fixed = request.POST.get('is_fixed') == 'on'
            FeeParticular.objects.create(label=label, amount=amount, is_fixed=is_fixed)
            messages.success(request, 'Fee particular added successfully')
        elif 'delete_fee' in request.POST:
            fee_id = request.POST.get('fee_id')
            FeeParticular.objects.filter(id=fee_id).delete()
            messages.success(request, 'Fee particular deleted successfully')
        return redirect('admin_settings_fees')
    fees = FeeParticular.objects.all()
    return render(request, 'hod_template/settings_fees.html', {'page_title': 'Fee Particulars', 'fees': fees})

def admin_settings_banks(request):
    from .models import BankDetail
    if request.method == 'POST':
        if 'add_bank' in request.POST:
            bank_name = request.POST.get('bank_name')
            branch_address = request.POST.get('branch_address')
            account_number = request.POST.get('account_number')
            instructions = request.POST.get('instructions')
            bank = BankDetail(bank_name=bank_name, branch_address=branch_address, account_number=account_number, instructions=instructions)
            if 'logo' in request.FILES:
                bank.logo = request.FILES.get('logo')
            bank.save()
            messages.success(request, 'Bank details added successfully')
        elif 'delete_bank' in request.POST:
            bank_id = request.POST.get('bank_id')
            BankDetail.objects.filter(id=bank_id).delete()
            messages.success(request, 'Bank details deleted successfully')
        return redirect('admin_settings_banks')
    banks = BankDetail.objects.all()
    return render(request, 'hod_template/settings_banks.html', {'page_title': 'Bank Details', 'banks': banks})

def admin_settings_rules(request):
    from .models import RulesRegulation
    rules = RulesRegulation.objects.first()
    if request.method == 'POST':
        if not rules:
            rules = RulesRegulation()
        rules.student_rules = request.POST.get('student_rules')
        rules.employee_rules = request.POST.get('employee_rules')
        rules.save()
        messages.success(request, 'Rules & Regulations updated successfully')
        return redirect('admin_settings_rules')
    return render(request, 'hod_template/settings_rules.html', {'page_title': 'Rules & Regulations', 'rules': rules})

def feature_coming_soon(request, feature_name):
    # Decode feature name for display (e.g., replace hyphens with spaces and title case)
    display_name = feature_name.replace('-', ' ').title()
    return render(request, 'hod_template/feature_coming_soon.html', {'feature_name': display_name, 'page_title': display_name})

def admin_settings_grading(request):
    from .models import MarksGrading, FailCriteria
    
    if request.method == 'POST':
        if 'add_grade' in request.POST:
            grade = request.POST.get('grade')
            percent_from = request.POST.get('percent_from')
            percent_upto = request.POST.get('percent_upto')
            status = request.POST.get('status')
            MarksGrading.objects.create(grade=grade, percent_from=percent_from, percent_upto=percent_upto, status=status)
            messages.success(request, 'Grade added successfully.')
        elif 'delete_grade' in request.POST:
            grade_id = request.POST.get('delete_grade')
            MarksGrading.objects.filter(id=grade_id).delete()
            messages.success(request, 'Grade deleted successfully.')
        elif 'save_scale' in request.POST:
            grade_ids = request.POST.getlist('grade_ids')
            for g_id in grade_ids:
                grade_obj = MarksGrading.objects.filter(id=g_id).first()
                if grade_obj:
                    grade_obj.grade = request.POST.get(f'grade_{g_id}')
                    grade_obj.percent_from = request.POST.get(f'percent_from_{g_id}')
                    grade_obj.percent_upto = request.POST.get(f'percent_upto_{g_id}')
                    grade_obj.status = request.POST.get(f'status_{g_id}')
                    grade_obj.save()
            messages.success(request, 'Grading scale updated successfully.')
        elif 'save_criteria' in request.POST:
            criteria, created = FailCriteria.objects.get_or_create(id=1)
            criteria.overall_percentage = request.POST.get('overall_percentage', 40)
            criteria.subject_percentage = request.POST.get('subject_percentage', 33)
            criteria.subject_count = request.POST.get('subject_count', 1)
            criteria.save()
            messages.success(request, 'Fail Criteria saved successfully.')
            
        return redirect('admin_settings_grading')
        
    grades = MarksGrading.objects.all().order_by('-percent_from')
    criteria, created = FailCriteria.objects.get_or_create(id=1)
    return render(request, 'hod_template/settings_grading.html', {
        'page_title': 'Marks Grading', 
        'grades': grades,
        'criteria': criteria
    })

def admin_settings_theme(request):
    from .models import ThemeLanguageSettings
    theme, created = ThemeLanguageSettings.objects.get_or_create(id=1)
    
    if request.method == 'POST':
        theme.theme_placement = request.POST.get('theme_placement', theme.theme_placement)
        theme.sidebar_background = request.POST.get('sidebar_background', theme.sidebar_background)
        theme.header_background = request.POST.get('header_background', theme.header_background)
        theme.active_item_background = request.POST.get('active_item_background', theme.active_item_background)
        theme.language = request.POST.get('language', theme.language)
        theme.save()
        messages.success(request, 'Theme & Language settings saved.')
        return redirect('admin_settings_theme')
        
    return render(request, 'hod_template/settings_theme.html', {'page_title': 'Theme & Language', 'theme': theme})

def admin_settings_account(request):
    from .models import AccountSettings, CustomUser
    account, created = AccountSettings.objects.get_or_create(admin=request.user)
    
    if request.method == 'POST':
        # Update user details
        email = request.POST.get('email')
        password = request.POST.get('password')
        if email:
            request.user.email = email
            request.user.save()
        if password and password != '********':
            request.user.set_password(password)
            request.user.save()
            
        # Update account settings
        account.time_zone = request.POST.get('time_zone', account.time_zone)
        account.currency = request.POST.get('currency', account.currency)
        account.currency_symbol = request.POST.get('currency_symbol', account.currency_symbol)
        account.save()
        update_session_auth_hash(request, user)
        
        messages.success(request, 'Account settings updated successfully.')
        return redirect('admin_settings_account')
        
    return render(request, 'hod_template/settings_account.html', {'page_title': 'Account Settings', 'account': account})

from django.http import HttpResponse, Http404

@login_required(login_url='/')
@admin_required
def import_students_csv(request):
    from .models import CustomUser, Student, Course, Session
    import csv, io, random, string
    
    if request.method == "POST" and request.FILES.get('file'):
        csv_file = request.FILES['file']
        
        if not csv_file.name.endswith('.csv'):
            messages.error(request, "This is not a valid CSV file.")
            return redirect('add_student')
            
        try:
            data_set = csv_file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            next(io_string) # Skip header
            
            success_count = 0
            error_count = 0
            
            for column in csv.reader(io_string, delimiter=',', quotechar='"'):
                # Expected format: first_name, last_name, gender, course_id, session_id, date_of_admission, email (optional), semester (optional), division (optional)
                if len(column) < 6:
                    continue
                    
                first_name = column[0].strip()
                last_name = column[1].strip()
                gender = column[2].strip()
                if len(gender) > 1:
                    gender = 'M' if gender.lower() == 'male' else 'F'
                course_id = column[3].strip()
                session_id = column[4].strip()
                date_of_admission = column[5].strip()
                provided_email = column[6].strip() if len(column) > 6 else ""
                semester = int(column[7].strip()) if len(column) > 7 and column[7].strip() else 1
                division = column[8].strip() if len(column) > 8 else ""
                
                email = None
                if provided_email:
                    # Basic validation and check for existence
                    if '@' in provided_email and not CustomUser.objects.filter(email=provided_email).exists():
                        email = provided_email
                
                # Auto-generate login email if not provided or already exists
                if not email:
                    base_email = f"{first_name.lower()}.{last_name.lower()}"
                    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
                    email = f"{base_email}.{random_string}@student.com"
                    
                    # Verify if email exists
                    while CustomUser.objects.filter(email=email).exists():
                        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
                        email = f"{base_email}.{random_string}@student.com"
                    
                password = column[7].strip() if len(column) > 7 and column[7].strip() else "student"
                
                try:
                    course = Course.objects.get(id=course_id)
                    session = Session.objects.get(id=session_id)
                    
                    user = CustomUser.objects.create_user(
                        email=email,
                        password=password,
                        first_name=first_name,
                        last_name=last_name,
                        gender=gender,
                        user_type=3
                    )
                    
                    student = user.student # Will be created by signal
                    student.course = course
                    student.session = session
                    student.current_semester = semester
                    student.division = division
                    if date_of_admission:
                        student.date_of_admission = date_of_admission
                    student.save()
                    success_count += 1
                except Exception as e:
                    error_count += 1
                    
            messages.success(request, f"Successfully imported {success_count} students. {error_count} failed.")
        except Exception as e:
            messages.error(request, f"Error processing file: {str(e)}")
            
    return redirect('add_student')

@login_required(login_url='/')
def view_online_registrations(request):
    if request.user.user_type not in ['1', '2']:
        messages.error(request, "You do not have permission to view this page.")
        return redirect('login_page')
        
    regs_dir = os.path.join(settings.MEDIA_ROOT, 'student_registrations')
    csv_files = []
    
    if os.path.exists(regs_dir):
        for f in os.listdir(regs_dir):
            if f.endswith('.csv'):
                file_path = os.path.join(regs_dir, f)
                size = os.path.getsize(file_path)
                mtime = os.path.getmtime(file_path)
                last_modified = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
                csv_files.append({
                    'name': f,
                    'size': f"{size / 1024:.2f} KB",
                    'last_modified': last_modified
                })
    
    csv_files.sort(key=lambda x: x['name'], reverse=True)
    
    # Render different base templates depending on user type
    base_template = 'main_app/base.html' if request.user.user_type == '1' else 'staff_template/base_template.html'
    
    return render(request, 'hod_template/view_registrations.html', {
        'page_title': 'Online Registrations (CSV)',
        'csv_files': csv_files,
        'base_template': base_template
    })

@login_required(login_url='/')
def read_registration_csv(request, filename):
    import csv
    if request.user.user_type not in ['1', '2']:
        messages.error(request, "You do not have permission to view this page.")
        return redirect('login_page')
        
    # Securely check if the filename only contains valid chars
    if not filename.endswith('.csv') or '/' in filename or '\\' in filename:
        raise Http404("Invalid file")
        
    file_path = os.path.join(settings.MEDIA_ROOT, 'student_registrations', filename)
    if not os.path.exists(file_path):
        raise Http404("File not found")
        
    headers = []
    rows = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader, [])
            for row in reader:
                rows.append(row)
    except Exception as e:
        messages.error(request, f"Error reading file: {str(e)}")
        
    base_template = 'main_app/base.html' if request.user.user_type == '1' else 'staff_template/base_template.html'
    return render(request, 'hod_template/read_registrations.html', {
        'page_title': 'View CSV',
        'filename': filename,
        'headers': headers,
        'rows': rows,
        'base_template': base_template
    })

@login_required(login_url='/')
def download_registration_csv(request, filename):
    if request.user.user_type not in ['1', '2']:
        raise Http404("Not found")
        
    regs_dir = os.path.join(settings.MEDIA_ROOT, 'student_registrations')
    file_path = os.path.join(regs_dir, filename)
    
    if os.path.exists(file_path) and filename.endswith('.csv'):
        with open(file_path, 'rb') as f:
            mime_type, _ = mimetypes.guess_type(file_path)
            response = HttpResponse(f, content_type=mime_type or 'text/csv')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
    else:
        raise Http404("CSV file not found")


# --- Staff Job Letter ---

@login_required(login_url='/')
@admin_required
def admin_job_letter(request):
    """Listing page showing all staff with a 'Print Job Letter' button."""
    from .models import RulesRegulation
    all_staff = Staff.objects.select_related('admin', 'course').all()
    context = {
        'page_title': 'Staff Job Letters',
        'all_staff': all_staff,
    }
    return render(request, 'hod_template/staff_job_letter.html', context)


@login_required(login_url='/')
@admin_required
def admin_print_job_letter(request, staff_id):
    """Renders the printable job letter for a specific staff member."""
    from .models import RulesRegulation
    staff = get_object_or_404(Staff, id=staff_id)
    rules_obj = RulesRegulation.objects.first()
    employee_rules = rules_obj.employee_rules if rules_obj and rules_obj.employee_rules else (
        "1. Employees must adhere to all institutional policies and procedures at all times.\n"
        "2. Punctuality and regular attendance are mandatory; unauthorized leave will be treated as misconduct.\n"
        "3. All staff are expected to maintain professional conduct and decorum within the campus premises.\n"
        "4. Confidential information about students, staff, and institution shall not be disclosed to any third party.\n"
        "5. Staff must participate in all academic and administrative activities assigned by the management.\n"
        "6. Any grievance or complaint must be reported through proper channels to the HOD or Principal.\n"
        "7. Use of mobile phones during class hours or official meetings is strictly prohibited.\n"
        "8. Staff are responsible for maintaining cleanliness and discipline in their respective areas.\n"
        "9. Any damage to institutional property will be recovered from the concerned employee.\n"
        "10. This letter of appointment is subject to review and renewal as per institutional policy."
    )
    context = {
        'staff': staff,
        'employee_rules': employee_rules,
        'site_url': request.build_absolute_uri('/'),
    }
    return render(request, 'hod_template/staff_print_job_letter.html', context)


@login_required(login_url='/')
@admin_required
def admission_letter(request):
    """Search for a student and generate their admission letter."""
    student = None
    search_results = []
    query = request.GET.get('q', '').strip()
    if query:
        search_results = Student.objects.select_related('admin', 'course').filter(
            Q(admin__first_name__icontains=query) |
            Q(admin__last_name__icontains=query) |
            Q(registration_no__icontains=query)
        )[:10]
    student_id = request.GET.get('student_id')
    if student_id:
        student = get_object_or_404(Student.objects.select_related('admin', 'course', 'session'), id=student_id)
    context = {
        'page_title': 'Admission Letter',
        'query': query,
        'search_results': search_results,
        'student': student,
    }
    return render(request, 'hod_template/admission_letter.html', context)


@login_required(login_url='/')
@admin_required
def student_id_cards_admin(request):
    """Multi-style Student ID Cards viewer."""
    students = Student.objects.select_related('admin', 'course', 'session').all()
    for s in students:
        if not s.id_card_code:
            s.id_card_code = f"STU-{s.course.name[:3].upper() if s.course else 'GEN'}-{s.batch_year}-{s.id:04d}"
            s.save()
    context = {
        'page_title': 'Student ID Cards',
        'students': students,
    }
    return render(request, 'hod_template/student_id_cards.html', context)


@login_required(login_url='/')
@admin_required
def print_basic_list(request):
    """Filterable student list with export controls."""
    students = Student.objects.select_related('admin', 'course').all()
    courses = Course.objects.all()
    course_filter = request.GET.get('course', '')
    if course_filter:
        students = students.filter(course_id=course_filter)
    context = {
        'page_title': 'Print Basic List',
        'students': students,
        'courses': courses,
        'selected_course': course_filter,
    }
    return render(request, 'hod_template/print_basic_list.html', context)

@login_required(login_url='/')
@admin_required
def manage_login(request):
    """Manage Login interface showing student accounts and lock/unlock actions."""
    students = Student.objects.select_related('admin', 'course').all()
    courses = Course.objects.all()
    
    course_filter = request.GET.get('course', '')
    search_filter = request.GET.get('search', '')
    
    if course_filter:
        students = students.filter(course_id=course_filter)
    if search_filter:
        students = students.filter(admin__first_name__icontains=search_filter) | students.filter(admin__last_name__icontains=search_filter)
        
    context = {
        'page_title': 'Student Login',
        'students': students,
        'courses': courses,
        'selected_course': course_filter,
    }
    return render(request, 'hod_template/manage_login.html', context)


@login_required(login_url='/')
@admin_required
def promote_students(request):
    """Promote Students interface."""
    courses = Course.objects.all()
    sessions = Session.objects.all()
    
    # Handle promotion action
    if request.method == "POST":
        student_ids = request.POST.getlist('student_ids')
        target_course_id = request.POST.get('target_course')
        target_session_id = request.POST.get('target_session')
        target_semester = request.POST.get('target_semester')
        
        if not student_ids:
            messages.error(request, "No students selected for promotion.")
        else:
            try:
                students_to_promote = Student.objects.filter(id__in=student_ids)
                count = students_to_promote.count()
                
                update_fields = {}
                if target_course_id:
                    update_fields['course_id'] = target_course_id
                if target_session_id:
                    update_fields['session_id'] = target_session_id
                if target_semester:
                    update_fields['current_semester'] = target_semester
                
                if update_fields:
                    students_to_promote.update(**update_fields)
                    messages.success(request, f"Successfully promoted {count} students.")
                else:
                    messages.warning(request, "No target specified for promotion.")
            except Exception as e:
                messages.error(request, f"Error promoting students: {e}")
                
        return redirect(reverse('promote_students'))
        
    # GET request filtering
    course_filter = request.GET.get('course', '')
    session_filter = request.GET.get('session', '')
    semester_filter = request.GET.get('semester', '')
    division_filter = request.GET.get('division', '')
    search_filter = request.GET.get('search', '')
    
    students = CustomUser.objects.filter(user_type=3).select_related('student')
    
    if course_filter:
        students = students.filter(student__course_id=course_filter)
    if session_filter:
        students = students.filter(student__session_id=session_filter)
    if semester_filter:
        students = students.filter(student__current_semester=semester_filter)
    if division_filter:
        students = students.filter(student__division__iexact=division_filter)
    if search_filter:
        students = students.filter(first_name__icontains=search_filter) | students.filter(last_name__icontains=search_filter)
        
    context = {
        'page_title': 'Promote Students',
        'courses': courses,
        'sessions': sessions,
        'students': students,
        'selected_course': course_filter,
        'selected_session': session_filter,
        'selected_semester': semester_filter,
        'selected_division': division_filter,
        'search_query': search_filter
    }
    return render(request, 'hod_template/promote_students.html', context)
