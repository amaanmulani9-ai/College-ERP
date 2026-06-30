import json
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
from .models import *


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
    course_all = Course.objects.all()
    course_name_list = []
    subject_count_list = []
    student_count_list_in_course = []

    for course in course_all:
        subjects = Subject.objects.filter(course_id=course.id).count()
        students = Student.objects.filter(course_id=course.id).count()
        course_name_list.append(course.name)
        subject_count_list.append(subjects)
        student_count_list_in_course.append(students)
    
    subject_all = Subject.objects.all()
    subject_list = []
    student_count_list_in_subject = []
    for subject in subject_all:
        course = Course.objects.get(id=subject.course.id)
        student_count = Student.objects.filter(course_id=course.id).count()
        subject_list.append(subject.name)
        student_count_list_in_subject.append(student_count)


    # For Students
    student_attendance_present_list=[]
    student_attendance_leave_list=[]
    student_name_list=[]

    students = Student.objects.all()
    for student in students:
        
        attendance = AttendanceReport.objects.filter(student_id=student.id, status=True).count()
        absent = AttendanceReport.objects.filter(student_id=student.id, status=False).count()
        leave = LeaveReportStudent.objects.filter(student_id=student.id, status=1).count()
        student_attendance_present_list.append(attendance)
        student_attendance_leave_list.append(leave+absent)
        student_name_list.append(student.admin.first_name)
        
    # --- Advanced Analytics Data ---
    # 1. Fee Collection
    total_fee_collected = sum(f.amount_paid for f in FeeRecord.objects.all())
    total_fee_pending = sum(f.balance for f in FeeRecord.objects.all())
    
    # 2. Pass/Fail Ratio
    results = StudentResult.objects.all()
    pass_count = 0
    fail_count = 0
    for r in results:
        if (r.test + r.exam) >= 40:
            pass_count += 1
        else:
            fail_count += 1
            
    # 3. Monthly Enrollment Trend (mock data or real data if available)
    # Using real data from CustomUser date_joined
    from django.db.models import Count
    from django.db.models.functions import TruncMonth
    import calendar
    
    enrollments = CustomUser.objects.filter(user_type='3').annotate(month=TruncMonth('date_joined')).values('month').annotate(count=Count('id')).order_by('month')
    months = []
    monthly_enrollments = []
    for e in enrollments:
        if e['month']:
            months.append(e['month'].strftime('%b %Y'))
            monthly_enrollments.append(e['count'])
            
    # 4. Staff Performance Analytics
    staff_analytics = []
    all_staff = Staff.objects.all()
    for staff in all_staff:
        # Number of subjects taught
        subjects_taught = Subject.objects.filter(staff=staff).count()
        # Number of attendance sessions taken
        attendance_taken = Attendance.objects.filter(subject__staff=staff).count()
        # Number of results published (approx by subject)
        results_published = StudentResult.objects.filter(subject__staff=staff).count()
        
        staff_analytics.append({
            'name': staff.admin.get_full_name(),
            'department': staff.course.name if staff.course else "N/A",
            'subjects': subjects_taught,
            'attendance_taken': attendance_taken,
            'results_published': results_published,
        })

    context = {
        'page_title': "Administrative Dashboard",
        'total_students': total_students,
        'total_staff': total_staff,
        'total_course': total_course,
        'total_subject': total_subject,
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
        "staff_analytics": staff_analytics
    }
    return render(request, 'hod_template/home_content.html', context)

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


def add_staff(request):
    form = StaffForm(request.POST or None, request.FILES or None)
    context = {'form': form, 'page_title': 'Add Staff'}
    if request.method == 'POST':
        if form.is_valid():
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name')
            address = form.cleaned_data.get('address')
            email = form.cleaned_data.get('email')
            gender = form.cleaned_data.get('gender')
            password = form.cleaned_data.get('password')
            course = form.cleaned_data.get('course')
            passport = request.FILES.get('profile_pic')
            fs = FileSystemStorage()
            filename = fs.save(passport.name, passport)
            passport_url = fs.url(filename)
            try:
                user = CustomUser.objects.create_user(
                    email=email, password=password, user_type=2, first_name=first_name, last_name=last_name)
                user.gender = gender
                user.address = address
                user.staff.course = course
                if passport:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    user.profile_pic = fs.url(filename)
                user.save()
                messages.success(request, "Successfully Added")
                return redirect(reverse('add_staff'))

            except Exception as e:
                messages.error(request, "Could Not Add " + str(e))
        else:
            messages.error(request, "Please fulfil all requirements")

    return render(request, 'hod_template/add_staff_template.html', context)


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
            passport = request.FILES['profile_pic']
            fs = FileSystemStorage()
            filename = fs.save(passport.name, passport)
            passport_url = fs.url(filename)
            try:
                user = CustomUser.objects.create_user(
                    email=email, password=password, user_type=3, first_name=first_name, last_name=last_name)
                user.gender = gender
                user.address = address
                user.student.session = session
                user.student.course = course
                if passport:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    user.profile_pic = fs.url(filename)
                user.save()
                messages.success(request, "Successfully Added")
                return redirect(reverse('add_student'))
            except Exception as e:
                messages.error(request, "Could Not Add: " + str(e))
        else:
            messages.error(request, "Could Not Add: ")
    return render(request, 'hod_template/add_student_template.html', context)


def add_course(request):
    form = CourseForm(request.POST or None)
    context = {
        'form': form,
        'page_title': 'Add Course'
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            try:
                course = Course()
                course.name = name
                course.save()
                messages.success(request, "Successfully Added")
                return redirect(reverse('add_course'))
            except:
                messages.error(request, "Could Not Add")
        else:
            messages.error(request, "Could Not Add")
    return render(request, 'hod_template/add_course_template.html', context)


def add_subject(request):
    form = SubjectForm(request.POST or None)
    context = {
        'form': form,
        'page_title': 'Add Subject'
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            course = form.cleaned_data.get('course')
            staff = form.cleaned_data.get('staff')
            try:
                subject = Subject()
                subject.name = name
                subject.staff = staff
                subject.course = course
                subject.save()
                messages.success(request, "Successfully Added")
                return redirect(reverse('add_subject'))

            except Exception as e:
                messages.error(request, "Could Not Add " + str(e))
        else:
            messages.error(request, "Fill Form Properly")

    return render(request, 'hod_template/add_subject_template.html', context)


def manage_staff(request):
    allStaff = CustomUser.objects.filter(user_type=2)
    context = {
        'allStaff': allStaff,
        'page_title': 'Manage Staff'
    }
    return render(request, "hod_template/manage_staff.html", context)


def manage_student(request):
    students = CustomUser.objects.filter(user_type=3)
    context = {
        'students': students,
        'page_title': 'Manage Students'
    }
    return render(request, "hod_template/manage_student.html", context)


def manage_course(request):
    courses = Course.objects.all()
    context = {
        'courses': courses,
        'page_title': 'Manage Courses'
    }
    return render(request, "hod_template/manage_course.html", context)


def manage_subject(request):
    subjects = Subject.objects.all()
    context = {
        'subjects': subjects,
        'page_title': 'Manage Subjects'
    }
    return render(request, "hod_template/manage_subject.html", context)


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
            messages.error(request, "Please fil form properly")
    else:
        user = CustomUser.objects.get(id=staff_id)
        staff = Staff.objects.get(id=user.id)
        return render(request, "hod_template/edit_staff_template.html", context)


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
            username = form.cleaned_data.get('username')
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
                user.username = username
                user.email = email
                if password != None:
                    user.set_password(password)
                user.first_name = first_name
                user.last_name = last_name
                student.session = session
                user.gender = gender
                user.address = address
                student.course = course
                user.save()
                student.save()
                messages.success(request, "Successfully Updated")
                return redirect(reverse('edit_student', args=[student_id]))
            except Exception as e:
                messages.error(request, "Could Not Update " + str(e))
        else:
            messages.error(request, "Please Fill Form Properly!")
    else:
        return render(request, "hod_template/edit_student_template.html", context)


def edit_course(request, course_id):
    instance = get_object_or_404(Course, id=course_id)
    form = CourseForm(request.POST or None, instance=instance)
    context = {
        'form': form,
        'course_id': course_id,
        'page_title': 'Edit Course'
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            try:
                course = Course.objects.get(id=course_id)
                course.name = name
                course.save()
                messages.success(request, "Successfully Updated")
            except:
                messages.error(request, "Could Not Update")
        else:
            messages.error(request, "Could Not Update")

    return render(request, 'hod_template/edit_course_template.html', context)


def edit_subject(request, subject_id):
    instance = get_object_or_404(Subject, id=subject_id)
    form = SubjectForm(request.POST or None, instance=instance)
    context = {
        'form': form,
        'subject_id': subject_id,
        'page_title': 'Edit Subject'
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            course = form.cleaned_data.get('course')
            staff = form.cleaned_data.get('staff')
            try:
                subject = Subject.objects.get(id=subject_id)
                subject.name = name
                subject.staff = staff
                subject.course = course
                subject.save()
                messages.success(request, "Successfully Updated")
                return redirect(reverse('edit_subject', args=[subject_id]))
            except Exception as e:
                messages.error(request, "Could Not Add " + str(e))
        else:
            messages.error(request, "Fill Form Properly")
    return render(request, 'hod_template/edit_subject_template.html', context)


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


def manage_session(request):
    sessions = Session.objects.all()
    context = {'sessions': sessions, 'page_title': 'Manage Sessions'}
    return render(request, "hod_template/manage_session.html", context)


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
def student_feedback_message(request):
    if request.method != 'POST':
        feedbacks = FeedbackStudent.objects.all()
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
def view_student_leave(request):
    if request.method != 'POST':
        allLeave = LeaveReportStudent.objects.all()
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


def admin_notify_staff(request):
    staff = CustomUser.objects.filter(user_type=2)
    context = {
        'page_title': "Send Notifications To Staff",
        'allStaff': staff
    }
    return render(request, "hod_template/staff_notification.html", context)


def admin_notify_student(request):
    student = CustomUser.objects.filter(user_type=3)
    context = {
        'page_title': "Send Notifications To Students",
        'students': student
    }
    return render(request, "hod_template/student_notification.html", context)


@csrf_exempt
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
        headers = {'Authorization':
                   'key=AAAA3Bm8j_M:APA91bElZlOLetwV696SoEtgzpJr2qbxBfxVBfDWFiopBWzfCfzQp2nRyC7_A2mlukZEHV4g1AmyC6P_HonvSkY2YyliKt5tT3fe_1lrKod2Daigzhb2xnYQMxUWjCAIQcUexAMPZePB',
                   'Content-Type': 'application/json'}
        data = requests.post(url, data=json.dumps(body), headers=headers)
        notification = NotificationStudent(student=student, message=message)
        notification.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


@csrf_exempt
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
        headers = {'Authorization':
                   'key=AAAA3Bm8j_M:APA91bElZlOLetwV696SoEtgzpJr2qbxBfxVBfDWFiopBWzfCfzQp2nRyC7_A2mlukZEHV4g1AmyC6P_HonvSkY2YyliKt5tT3fe_1lrKod2Daigzhb2xnYQMxUWjCAIQcUexAMPZePB',
                   'Content-Type': 'application/json'}
        data = requests.post(url, data=json.dumps(body), headers=headers)
        notification = NotificationStaff(staff=staff, message=message)
        notification.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


def delete_staff(request, staff_id):
    staff = get_object_or_404(CustomUser, staff__id=staff_id)
    staff.delete()
    messages.success(request, "Staff deleted successfully!")
    return redirect(reverse('manage_staff'))


def delete_student(request, student_id):
    student = get_object_or_404(CustomUser, student__id=student_id)
    student.delete()
    messages.success(request, "Student deleted successfully!")
    return redirect(reverse('manage_student'))


def delete_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    try:
        course.delete()
        messages.success(request, "Course deleted successfully!")
    except Exception:
        messages.error(
            request, "Sorry, some students are assigned to this course already. Kindly change the affected student course and try again")
    return redirect(reverse('manage_course'))


def delete_subject(request, subject_id):
    subject = get_object_or_404(Subject, id=subject_id)
    subject.delete()
    messages.success(request, "Subject deleted successfully!")
    return redirect(reverse('manage_subject'))


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


def admin_manage_certificates(request):
    cert_requests = CertificateRequest.objects.all().select_related('student__admin').order_by('-id')
    context = {
        'page_title': "Manage Certificate Requests",
        'requests': cert_requests
    }
    return render(request, "hod_template/manage_certificates.html", context)


def admin_approve_certificate(request, req_id):
    cert_req = get_object_or_404(CertificateRequest, id=req_id)
    cert_req.status = "Approved"
    cert_req.approved_date = date.today()
    cert_req.save()
    messages.success(request, f"Approved request for {cert_req.student.admin.get_full_name()}.")
    return redirect(reverse('admin_manage_certificates'))


def admin_reject_certificate(request, req_id):
    cert_req = get_object_or_404(CertificateRequest, id=req_id)
    cert_req.status = "Rejected"
    cert_req.save()
    messages.success(request, f"Rejected request for {cert_req.student.admin.get_full_name()}.")
    return redirect(reverse('admin_manage_certificates'))


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


def admin_add_fee(request):
    if request.method == "POST":
        student_id = request.POST.get("student")
        category = request.POST.get("category")
        amount = request.POST.get("amount")
        due_date = request.POST.get("due_date")
        
        try:
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
            messages.error(request, f"Error creating fee record: {e}")
            
    return redirect(reverse('admin_manage_fees'))


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


def admin_print_fee(request, fee_id):
    fee_record = get_object_or_404(FeeRecord, id=fee_id)
    payments = FeePayment.objects.filter(fee_record=fee_record).order_by('-payment_date')
    context = {
        'page_title': "Print Fee Invoice",
        'fee_record': fee_record,
        'payments': payments
    }
    return render(request, "hod_template/fee_invoice.html", context)


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


def admin_manage_registrations(request):
    registrations = StudentRegistration.objects.all().select_related('student__admin').order_by('-created_at')
    context = {
        'page_title': "Online Admission Registrations",
        'registrations': registrations
    }
    return render(request, "hod_template/manage_registrations.html", context)


def admin_view_registration(request, reg_id):
    registration = get_object_or_404(StudentRegistration, id=reg_id)
    context = {
        'page_title': f"Admission Details: {registration.first_name} {registration.surname}",
        'reg': registration,
        'can_edit_registration': True,
    }
    return render(request, "hod_template/view_registration.html", context)


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


def admin_delete_registration(request, reg_id):
    reg = get_object_or_404(StudentRegistration, id=reg_id)
    try:
        reg.delete()
        messages.success(request, "Registration deleted successfully. The student will now start with a blank form.")
    except Exception as e:
        messages.error(request, f"Error deleting registration: {e}")
    return redirect(reverse('admin_manage_registrations'))


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


def admin_delete_event(request, event_id):
    event = get_object_or_404(CollegeEvent, id=event_id)
    event.delete()
    messages.success(request, f"Event deleted.")
    return redirect(reverse('admin_events'))

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
            return redirect(reverse('add_parent'))
            
    return render(request, 'hod_template/add_parent.html', context)


def manage_parent(request):
    parents = Parent.objects.all().select_related('admin', 'student__admin')
    context = {
        'parents': parents,
        'page_title': 'Manage Parents'
    }
    return render(request, "hod_template/manage_parent.html", context)


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


def delete_parent(request, parent_id):
    parent = get_object_or_404(Parent, id=parent_id)
    try:
        parent.admin.delete()  # This will cascade and delete the Parent record too
        messages.success(request, "Parent deleted successfully!")
    except Exception as e:
        messages.error(request, f"Error deleting parent: {e}")
    return redirect(reverse('manage_parent'))
