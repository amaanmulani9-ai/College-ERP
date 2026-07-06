from django.contrib.auth.decorators import login_required
from .decorators import admin_required, staff_required, student_required
import json

from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import (HttpResponseRedirect, get_object_or_404,redirect, render)
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .forms import *
from .models import *
from . import forms, models
from datetime import date

@login_required(login_url='/')
@staff_required
def staff_home(request):
    staff = get_object_or_404(Staff, admin=request.user)
    total_students = Student.objects.filter(course=staff.course).count()
    total_leave = LeaveReportStaff.objects.filter(staff=staff).count()
    subjects = Subject.objects.filter(staff=staff)
    total_subject = subjects.count()
    attendance_list = Attendance.objects.filter(subject__in=subjects)
    total_attendance = attendance_list.count()
    from django.db.models import Count
    import datetime as dt
    subjects_with_attendance = subjects.annotate(attendance_count=Count('attendance', distinct=True))
    subject_list = [subject.name for subject in subjects_with_attendance]
    attendance_list = [subject.attendance_count for subject in subjects_with_attendance]

    try:
        notifications = NotificationStaff.objects.filter(staff=staff).order_by('-created_at')[:6]
    except Exception:
        notifications = []
    try:
        recent_leaves = LeaveReportStaff.objects.filter(staff=staff).order_by('-date')[:5]
    except Exception:
        recent_leaves = []
    try:
        recent_attendance = Attendance.objects.filter(subject__in=subjects).order_by('-date')[:5]
    except Exception:
        recent_attendance = []
    try:
        today_weekday = dt.datetime.now().weekday()
        today_lectures = Timetable.objects.filter(subject__in=subjects, day_of_week=today_weekday).select_related('subject', 'course').order_by('start_time')
    except Exception:
        today_lectures = []

    context = {
        'page_title': 'Staff Panel - ' + str(staff.admin.first_name) + ' ' + str(staff.admin.last_name[:1]) + ' (' + str(staff.course) + ')',
        'total_students': total_students,
        'total_attendance': total_attendance,
        'total_leave': total_leave,
        'total_subject': total_subject,
        'subject_list': subject_list,
        'attendance_list': attendance_list,
        'notifications': notifications,
        'recent_leaves': recent_leaves,
        'recent_attendance': recent_attendance,
        'today_lectures': today_lectures,
    }
    return render(request, "staff_template/erpnext_staff_home.html", context)


@login_required(login_url='/')
@staff_required
def staff_take_attendance(request):
    staff = get_object_or_404(Staff, admin=request.user)
    subjects = Subject.objects.filter(staff_id=staff)
    sessions = Session.objects.all()
    context = {
        'subjects': subjects,
        'sessions': sessions,
        'page_title': 'Take Attendance'
    }

    return render(request, 'staff_template/staff_take_attendance.html', context)


@csrf_exempt
@login_required(login_url='/')
@staff_required
def get_students(request):
    subject_id = request.POST.get('subject')
    session_id = request.POST.get('session')
    try:
        subject = get_object_or_404(Subject, id=subject_id)
        session = get_object_or_404(Session, id=session_id)
        students = Student.objects.filter(
            course_id=subject.course.id, session=session)
        student_data = []
        for student in students:
            data = {
                    "id": student.id,
                    "name": student.admin.last_name + " " + student.admin.first_name
                    }
            student_data.append(data)
        return JsonResponse(json.dumps(student_data), content_type='application/json', safe=False)
    except Exception as e:
        return JsonResponse(json.dumps([]), safe=False)


@csrf_exempt
@login_required(login_url='/')
@staff_required
def save_attendance(request):
    student_data = request.POST.get('student_ids')
    date = request.POST.get('date')
    subject_id = request.POST.get('subject')
    session_id = request.POST.get('session')
    students = json.loads(student_data)
    try:
        session = get_object_or_404(Session, id=session_id)
        subject = get_object_or_404(Subject, id=subject_id)
        attendance = Attendance(session=session, subject=subject, date=date)
        attendance.save()

        for student_dict in students:
            student = get_object_or_404(Student, id=student_dict.get('id'))
            attendance_report = AttendanceReport(student=student, attendance=attendance, status=student_dict.get('status'))
            attendance_report.save()
            
            # Check for low attendance (< 75%)
            # NOTE: Moved to a background task / cron job to avoid slowing down attendance saving
            # and spamming students on every single save.
            pass
    except Exception as e:
        return HttpResponse("False")

    return HttpResponse("OK")


@login_required(login_url='/')
@staff_required
def staff_update_attendance(request):
    staff = get_object_or_404(Staff, admin=request.user)
    subjects = Subject.objects.filter(staff_id=staff)
    sessions = Session.objects.all()
    context = {
        'subjects': subjects,
        'sessions': sessions,
        'page_title': 'Update Attendance'
    }

    return render(request, 'staff_template/staff_update_attendance.html', context)


@csrf_exempt
@login_required(login_url='/')
@staff_required
def get_student_attendance(request):
    attendance_date_id = request.POST.get('attendance_date_id')
    try:
        date = get_object_or_404(Attendance, id=attendance_date_id)
        attendance_data = AttendanceReport.objects.filter(attendance=date)
        student_data = []
        for attendance in attendance_data:
            data = {"id": attendance.student.admin.id,
                    "name": attendance.student.admin.last_name + " " + attendance.student.admin.first_name,
                    "status": attendance.status}
            student_data.append(data)
        return JsonResponse(json.dumps(student_data), content_type='application/json', safe=False)
    except Exception as e:
        return JsonResponse(json.dumps([]), safe=False)


@csrf_exempt
@login_required(login_url='/')
@staff_required
def update_attendance(request):
    student_data = request.POST.get('student_ids')
    date = request.POST.get('date')
    students = json.loads(student_data)
    try:
        attendance = get_object_or_404(Attendance, id=date)
        
        student_admin_ids = [s.get('id') for s in students]
        status_map = {int(s.get('id')): s.get('status') for s in students}
        
        reports = AttendanceReport.objects.filter(
            attendance=attendance, 
            student__admin_id__in=student_admin_ids
        )
        
        for report in reports:
            report.status = status_map.get(report.student.admin_id)
            
        AttendanceReport.objects.bulk_update(reports, ['status'])
    except Exception as e:
        return HttpResponse("False")

    return HttpResponse("OK")


@login_required(login_url='/')
@staff_required
def staff_apply_leave(request):
    form = LeaveReportStaffForm(request.POST or None)
    staff = get_object_or_404(Staff, admin_id=request.user.id)
    context = {
        'form': form,
        'leave_history': LeaveReportStaff.objects.filter(staff=staff).select_related('staff__admin'),
        'page_title': 'Apply for Leave'
    }
    if request.method == 'POST':
        if form.is_valid():
            try:
                obj = form.save(commit=False)
                obj.staff = staff
                obj.save()
                messages.success(
                    request, "Application for leave has been submitted for review")
                return redirect(reverse('staff_apply_leave'))
            except Exception:
                messages.error(request, "Could not apply!")
        else:
            messages.error(request, "Form has errors!")
    return render(request, "staff_template/staff_apply_leave.html", context)


@login_required(login_url='/')
@staff_required
def staff_feedback(request):
    form = FeedbackStaffForm(request.POST or None)
    staff = get_object_or_404(Staff, admin_id=request.user.id)
    context = {
        'form': form,
        'feedbacks': FeedbackStaff.objects.filter(staff=staff),
        'page_title': 'Add Feedback'
    }
    if request.method == 'POST':
        if form.is_valid():
            try:
                obj = form.save(commit=False)
                obj.staff = staff
                obj.save()
                messages.success(request, "Feedback submitted for review")
                return redirect(reverse('staff_feedback'))
            except Exception:
                messages.error(request, "Could not Submit!")
        else:
            messages.error(request, "Form has errors!")
    return render(request, "staff_template/staff_feedback.html", context)


@login_required(login_url='/')
@staff_required
def staff_view_profile(request):
    staff = get_object_or_404(Staff, admin=request.user)
    form = StaffEditForm(request.POST or None, request.FILES or None,instance=staff)
    context = {'form': form, 'page_title': 'View/Update Profile'}
    if request.method == 'POST':
        try:
            if form.is_valid():
                first_name = form.cleaned_data.get('first_name')
                last_name = form.cleaned_data.get('last_name')
                password = form.cleaned_data.get('password') or None
                address = form.cleaned_data.get('address')
                gender = form.cleaned_data.get('gender')
                passport = request.FILES.get('profile_pic') or None
                admin = staff.admin
                if password is not None:
                    admin.set_password(password)
                if passport is not None:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    passport_url = fs.url(filename)
                    admin.profile_pic = passport_url
                admin.first_name = first_name
                admin.last_name = last_name
                admin.address = address
                admin.gender = gender
                admin.save()
                staff.save()
                messages.success(request, "Profile Updated!")
                return redirect(reverse('staff_view_profile'))
            else:
                messages.error(request, "Invalid Data Provided")
                return render(request, "staff_template/staff_view_profile.html", context)
        except Exception as e:
            messages.error(
                request, "Error Occured While Updating Profile " + str(e))
            return render(request, "staff_template/staff_view_profile.html", context)

    return render(request, "staff_template/staff_view_profile.html", context)


@csrf_exempt
@login_required(login_url='/')
@staff_required
def staff_fcmtoken(request):
    token = request.POST.get('token')
    try:
        staff_user = get_object_or_404(CustomUser, id=request.user.id)
        staff_user.fcm_token = token
        staff_user.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


@login_required(login_url='/')
@staff_required
def staff_view_notification(request):
    staff = get_object_or_404(Staff, admin=request.user)
    notifications = NotificationStaff.objects.filter(staff=staff)
    context = {
        'notifications': notifications,
        'page_title': "View Notifications"
    }
    return render(request, "staff_template/staff_view_notification.html", context)


@login_required(login_url='/')
@staff_required
def staff_add_result(request):
    staff = get_object_or_404(Staff, admin=request.user)
    subjects = Subject.objects.filter(staff=staff)
    sessions = Session.objects.all()
    context = {
        'page_title': 'Result Upload',
        'subjects': subjects,
        'sessions': sessions
    }
    if request.method == 'POST':
        try:
            student_id = request.POST.get('student_list')
            subject_id = request.POST.get('subject')
            test = request.POST.get('test')
            exam = request.POST.get('exam')
            student = get_object_or_404(Student, id=student_id)
            subject = get_object_or_404(Subject, id=subject_id)
            result, created = StudentResult.objects.update_or_create(
                student=student, subject=subject,
                defaults={'exam': exam, 'test': test}
            )
            
            try:
                subject_text = f"Result {'Published' if created else 'Updated'} for {subject.name}"
                message = f"Hello {student.admin.first_name},\n\nYour result for {subject.name} has been {'published' if created else 'updated'}.\nExam Score: {exam}\nTest Score: {test}\n\nPlease login to your portal to view more details.\n\nRegards,\nCollege ERP System"
                send_mail(subject_text, message, settings.EMAIL_HOST_USER, [student.admin.email], fail_silently=True)
            except Exception as e:
                print("Email error:", e)
                
            messages.success(request, "Scores Saved" if created else "Scores Updated")
        except Exception as e:
            messages.warning(request, "Error Occured While Processing Form")
    return render(request, "staff_template/staff_add_result.html", context)


@csrf_exempt
@login_required(login_url='/')
@staff_required
def fetch_student_result(request):
    try:
        subject_id = request.POST.get('subject')
        student_id = request.POST.get('student')
        student = get_object_or_404(Student, id=student_id)
        subject = get_object_or_404(Subject, id=subject_id)
        result = StudentResult.objects.get(student=student, subject=subject)
        result_data = {
            'exam': result.exam,
            'test': result.test
        }
        return HttpResponse(json.dumps(result_data))
    except Exception as e:
        return HttpResponse('False')

#library
@login_required(login_url='/')
@staff_required
def add_book(request):
    if request.method == "POST":
        name = request.POST['name']
        author = request.POST['author']
        isbn = request.POST['isbn']
        category = request.POST['category']


        books = Book.objects.create(name=name, author=author, isbn=isbn, category=category )
        books.save()
        alert = True
        return render(request, "staff_template/add_book.html", {'alert':alert})
    context = {
        'page_title': "Add Book"
    }
    return render(request, "staff_template/add_book.html",context)

#issue book


@login_required(login_url='/')
@staff_required
def issue_book(request):
    form = forms.IssueBookForm()
    if request.method == "POST":
        form = forms.IssueBookForm(request.POST)
        if form.is_valid():
            obj = models.IssuedBook()
            obj.student_id = request.POST['name2']
            obj.isbn = request.POST['isbn2']
            obj.save()
            alert = True
            return render(request, "staff_template/issue_book.html", {'obj':obj, 'alert':alert})
    return render(request, "staff_template/issue_book.html", {'form':form})

@login_required(login_url='/')
@staff_required
def view_issued_book(request):
    issued_books = IssuedBook.objects.all().order_by('-issued_date')
    details = []
    
    isbns = [loan.isbn for loan in issued_books]
    student_emails = [loan.student_id for loan in issued_books]
    
    books_dict = {str(book.isbn): book.name for book in Book.objects.filter(isbn__in=isbns)}
    users_dict = {user.email: f"{user.first_name} {user.last_name} ({user.email})" for user in CustomUser.objects.filter(email__in=student_emails)}
    
    for loan in issued_books:
        # Calculate fine
        days = (date.today() - loan.issued_date).days
        fine = max(0, (days - 14) * 5)
        
        # Fetch book details
        book_name = books_dict.get(loan.isbn, "Unknown Book")
            
        # Fetch student details
        student_name = users_dict.get(loan.student_id, loan.student_id)
            
        details.append({
            'book_name': book_name,
            'isbn': loan.isbn,
            'student_name': student_name,
            'issued_date': loan.issued_date,
            'expiry_date': loan.expiry_date,
            'fine': fine
        })
        
    context = {
        'details': details,
        'page_title': "View Issued Books"
    }
    return render(request, "staff_template/view_issued_book.html", context)


@login_required(login_url='/')
@staff_required
def staff_view_timetable(request):
    staff = get_object_or_404(Staff, admin=request.user)
    course = staff.course
    timetable_slots = Timetable.objects.filter(course=course).select_related('subject').order_by('day_of_week', 'start_time') if course else []
    
    context = {
        'page_title': f"Class Timetable: {course.name if course else 'No Assigned Course'}",
        'timetable_slots': timetable_slots,
        'course': course
    }
    return render(request, "staff_template/staff_timetable.html", context)


@login_required(login_url='/')
@staff_required
def staff_manage_registrations(request):
    staff = get_object_or_404(Staff, admin=request.user)
    registrations = StudentRegistration.objects.filter(
        student__course=staff.course
    ).select_related('student__admin', 'student__course').order_by('-created_at')
    context = {
        'page_title': "Student Registrations",
        'registrations': registrations,
        'course': staff.course,
    }
    return render(request, "staff_template/manage_registrations.html", context)


@login_required(login_url='/')
@staff_required
def staff_view_registration(request, reg_id):
    staff = get_object_or_404(Staff, admin=request.user)
    registration = get_object_or_404(
        StudentRegistration.objects.select_related('student__admin', 'student__course'),
        id=reg_id,
        student__course=staff.course,
    )
    context = {
        'page_title': f"Admission Details: {registration.first_name} {registration.surname}",
        'reg': registration,
        'can_edit_registration': False,
    }
    return render(request, "hod_template/view_registration.html", context)


@login_required(login_url='/')
@staff_required
def staff_events_calendar(request):
    from .models import CollegeEvent
    import json
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
            'type': e.get_event_type_display(),
        })

    context = {
        'events_json': json.dumps(events_json),
        'events': events,
        'page_title': 'College Event Calendar',
    }
    return render(request, 'student_template/student_events_calendar.html', context)

@login_required(login_url='/')
@staff_required
def staff_manage_exams(request):
    staff = get_object_or_404(Staff, admin=request.user)
    exams = Exam.objects.filter(staff=staff).order_by('-created_at')
    context = {
        'exams': exams,
        'page_title': 'Manage Online Exams'
    }
    return render(request, 'staff_template/manage_exams.html', context)

@login_required(login_url='/')
@staff_required
def staff_create_exam(request):
    staff = get_object_or_404(Staff, admin=request.user)
    if request.method == 'POST':
        title = request.POST.get('title')
        subject_id = request.POST.get('subject')
        duration = request.POST.get('duration')
        
        subject = get_object_or_404(Subject, id=subject_id, staff=staff)
        exam = Exam.objects.create(title=title, subject=subject, staff=staff, duration_minutes=duration)
        messages.success(request, f"Exam '{title}' created successfully!")
        return redirect(reverse('staff_add_question', args=[exam.id]))
        
    subjects = Subject.objects.filter(staff=staff)
    context = {
        'subjects': subjects,
        'page_title': 'Create New Exam'
    }
    return render(request, 'staff_template/create_exam.html', context)

@login_required(login_url='/')
@staff_required
def staff_add_question(request, exam_id):
    staff = get_object_or_404(Staff, admin=request.user)
    exam = get_object_or_404(Exam, id=exam_id, staff=staff)
    
    if request.method == 'POST':
        question_text = request.POST.get('question_text')
        opt1 = request.POST.get('option_1')
        opt2 = request.POST.get('option_2')
        opt3 = request.POST.get('option_3')
        opt4 = request.POST.get('option_4')
        correct = request.POST.get('correct_option')
        marks = request.POST.get('marks')
        
        Question.objects.create(
            exam=exam,
            question_text=question_text,
            option_1=opt1, option_2=opt2, option_3=opt3, option_4=opt4,
            correct_option=correct,
            marks=marks
        )
        messages.success(request, "Question added successfully!")
        return redirect(reverse('staff_add_question', args=[exam.id]))
        
    questions = exam.questions.all()
    context = {
        'exam': exam,
        'questions': questions,
        'page_title': f'Add Questions to {exam.title}'
    }
    return render(request, 'staff_template/add_question.html', context)


@login_required(login_url='/')
@staff_required
def staff_manage_parent(request):
    staff = get_object_or_404(Staff, admin=request.user)
    # Get parents of students in the staff's course
    parents = Parent.objects.filter(student__course=staff.course).select_related('admin', 'student__admin')
    context = {
        'parents': parents,
        'page_title': 'Manage Parents'
    }
    return render(request, "staff_template/staff_manage_parent.html", context)


# --- Version 2.0 LMS Views ---

@login_required(login_url='/')
@staff_required
def staff_lms_home(request):
    staff = get_object_or_404(Staff, admin=request.user)
    courses = VideoCourse.objects.filter(staff=staff).order_by('-created_at')
    assignments = Assignment.objects.filter(staff=staff).order_by('-due_date')
    materials = StudyMaterial.objects.filter(staff=staff).order_by('-created_at')
    context = {
        'page_title': 'LMS Dashboard',
        'courses': courses,
        'assignments': assignments,
        'materials': materials,
    }
    return render(request, "staff_template/staff_lms_home.html", context)

@login_required(login_url='/')
@staff_required
def staff_add_course(request):
    staff = get_object_or_404(Staff, admin=request.user)
    if request.method == 'POST':
        title = request.POST.get('title')
        category_id = request.POST.get('category')
        subject_id = request.POST.get('subject')
        description = request.POST.get('description')
        thumbnail = request.FILES.get('thumbnail')
        
        category = get_object_or_404(CourseCategory, id=category_id)
        subject = get_object_or_404(Subject, id=subject_id, staff=staff)
        
        course = VideoCourse.objects.create(
            title=title, category=category, subject=subject, staff=staff,
            description=description, thumbnail=thumbnail
        )
        messages.success(request, f"Course '{title}' created successfully!")
        return redirect(reverse('staff_manage_lessons', args=[course.id]))
        
    categories = CourseCategory.objects.all()
    subjects = Subject.objects.filter(staff=staff)
    context = {
        'page_title': 'Add New Video Course',
        'categories': categories,
        'subjects': subjects,
    }
    return render(request, "staff_template/staff_add_course.html", context)

@login_required(login_url='/')
@staff_required
def staff_manage_lessons(request, course_id):
    staff = get_object_or_404(Staff, admin=request.user)
    course = get_object_or_404(VideoCourse, id=course_id, staff=staff)
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        video_file = request.FILES.get('video_file')
        video_url = request.POST.get('video_url')
        order = request.POST.get('order', 0)
        
        VideoLesson.objects.create(
            course=course, title=title, description=description,
            video_file=video_file, video_url=video_url, order=order
        )
        messages.success(request, "Lesson added successfully!")
        return redirect(reverse('staff_manage_lessons', args=[course.id]))
        
    lessons = course.lessons.all().order_by('order')
    context = {
        'page_title': f'Manage Lessons: {course.title}',
        'course': course,
        'lessons': lessons,
    }
    return render(request, "staff_template/staff_manage_lessons.html", context)

@login_required(login_url='/')
@staff_required
def staff_add_assignment(request):
    staff = get_object_or_404(Staff, admin=request.user)
    if request.method == 'POST':
        title = request.POST.get('title')
        subject_id = request.POST.get('subject')
        description = request.POST.get('description')
        attachment = request.FILES.get('attachment')
        due_date = request.POST.get('due_date')
        
        subject = get_object_or_404(Subject, id=subject_id, staff=staff)
        
        Assignment.objects.create(
            title=title, subject=subject, staff=staff,
            description=description, attachment=attachment, due_date=due_date
        )
        messages.success(request, "Assignment published successfully!")
        return redirect(reverse('staff_lms_home'))
        
    subjects = Subject.objects.filter(staff=staff)
    context = {
        'page_title': 'Publish New Assignment',
        'subjects': subjects,
    }
    return render(request, "staff_template/staff_add_assignment.html", context)

@login_required(login_url='/')
@staff_required
def staff_view_submissions(request, assignment_id):
    staff = get_object_or_404(Staff, admin=request.user)
    assignment = get_object_or_404(Assignment, id=assignment_id, staff=staff)
    submissions = assignment.submissions.all().select_related('student__admin')
    if request.method == 'POST':
        sub_id = request.POST.get('submission_id')
        marks = request.POST.get('marks')
        feedback = request.POST.get('feedback')
        sub = get_object_or_404(AssignmentSubmission, id=sub_id, assignment=assignment)
        sub.marks_obtained = float(marks)
        sub.feedback = feedback
        sub.save()
        messages.success(request, "Graded successfully!")
        return redirect(reverse('staff_view_submissions', args=[assignment.id]))
        
    context = {
        'page_title': f'Submissions: {assignment.title}',
        'assignment': assignment,
        'submissions': submissions,
    }
    return render(request, "staff_template/staff_view_submissions.html", context)

@login_required(login_url='/')
@staff_required
def staff_add_material(request):
    staff = get_object_or_404(Staff, admin=request.user)
    if request.method == 'POST':
        title = request.POST.get('title')
        subject_id = request.POST.get('subject')
        file = request.FILES.get('file')
        description = request.POST.get('description')
        
        subject = get_object_or_404(Subject, id=subject_id, staff=staff)
        
        StudyMaterial.objects.create(
            title=title, subject=subject, staff=staff,
            file=file, description=description
        )
        messages.success(request, "Study Material uploaded successfully!")
        return redirect(reverse('staff_lms_home'))
        
    subjects = Subject.objects.filter(staff=staff)
    context = {
        'page_title': 'Upload Study Material',
        'subjects': subjects,
    }
    return render(request, "staff_template/staff_add_material.html", context)


# --- Version 2.5 Live Learning Views (Virtual Classroom) ---

@login_required(login_url='/')
@staff_required
def staff_live_classes(request):
    staff = get_object_or_404(Staff, admin=request.user)
    live_classes = LiveClass.objects.filter(staff=staff).order_by('-scheduled_at')
    
    context = {
        'page_title': 'Live Virtual Classrooms',
        'live_classes': live_classes,
    }
    return render(request, "staff_template/staff_live_classes.html", context)

@login_required(login_url='/')
@staff_required
def staff_schedule_live_class(request):
    staff = get_object_or_404(Staff, admin=request.user)
    if request.method == 'POST':
        title = request.POST.get('title')
        subject_id = request.POST.get('subject')
        scheduled_at = request.POST.get('scheduled_at')
        duration_minutes = request.POST.get('duration_minutes', 60)
        description = request.POST.get('description')
        
        subject = get_object_or_404(Subject, id=subject_id, staff=staff)
        
        LiveClass.objects.create(
            title=title, subject=subject, staff=staff,
            scheduled_at=scheduled_at, duration_minutes=duration_minutes,
            description=description, is_active=True
        )
        messages.success(request, f"Live class '{title}' scheduled successfully!")
        return redirect(reverse('staff_live_classes'))
        
    subjects = Subject.objects.filter(staff=staff)
    context = {
        'page_title': 'Schedule Live Virtual Class',
        'subjects': subjects,
    }
    return render(request, "staff_template/staff_schedule_live_class.html", context)

@login_required(login_url='/')
@staff_required
def staff_host_live_class(request, class_id):
    staff = get_object_or_404(Staff, admin=request.user)
    live_class = get_object_or_404(LiveClass, id=class_id, staff=staff)
    attendances = live_class.attendances.all().order_by('-joined_at')
    
    context = {
        'page_title': f"Host: {live_class.title}",
        'live_class': live_class,
        'attendances': attendances,
    }
    return render(request, "staff_template/staff_host_live_class.html", context)

@login_required(login_url='/')
@staff_required
def staff_end_live_class(request, class_id):
    staff = get_object_or_404(Staff, admin=request.user)
    live_class = get_object_or_404(LiveClass, id=class_id, staff=staff)
    live_class.is_active = False
    live_class.save()
    
    # Set left_at for all open attendances
    from django.utils import timezone
    live_class.attendances.filter(left_at__isnull=True).update(left_at=timezone.now())
    
    messages.success(request, f"Live class '{live_class.title}' ended. Attendance records saved!")
    return redirect(reverse('staff_live_classes'))
