from django.contrib.auth.decorators import login_required
from .decorators import admin_required, staff_required, student_required
import json
import math
from datetime import datetime, timedelta

from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, JsonResponse
from django.shortcuts import (HttpResponseRedirect, get_object_or_404,
                              redirect, render)
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

from .forms import *
from .models import *


@login_required(login_url='/')
@student_required
def student_home(request):
    student = get_object_or_404(Student, admin=request.user)
    total_subject = Subject.objects.filter(course=student.course).count()
    total_attendance = AttendanceReport.objects.filter(student=student).count()
    total_present = AttendanceReport.objects.filter(student=student, status=True).count()
    if total_attendance == 0:
        percent_absent = percent_present = 0
    else:
        percent_present = math.floor((total_present/total_attendance) * 100)
        percent_absent = math.ceil(100 - percent_present)

    subjects = Subject.objects.filter(course=student.course)
    subject_name = []
    data_present = []
    data_absent = []
    subject_attendance_data = []

    from django.db.models import Count, Q
    subjects_with_attendance = subjects.annotate(
        present_count=Count('attendance__attendancereport', filter=Q(attendance__attendancereport__student=student, attendance__attendancereport__status=True)),
        absent_count=Count('attendance__attendancereport', filter=Q(attendance__attendancereport__student=student, attendance__attendancereport__status=False))
    )

    for subject in subjects_with_attendance:
        present_count = subject.present_count
        absent_count = subject.absent_count
        total = present_count + absent_count
        pct = int((present_count / total) * 100) if total > 0 else 0
        subject_name.append(subject.name)
        data_present.append(present_count)
        data_absent.append(absent_count)
        subject_attendance_data.append({
            'name': subject.name,
            'present': present_count,
            'absent': absent_count,
            'total': total,
            'percent': pct,
            'low': pct < 75,
        })

    # Semester-wise result data
    results = StudentResult.objects.filter(student=student).select_related('subject')
    result_subjects = [r.subject.name for r in results]
    result_exam_scores = [r.exam for r in results]
    result_test_scores = [r.test for r in results]

    # Notifications for Notice Board
    notifications = NotificationStudent.objects.filter(student=student).order_by('-created_at')[:8]

    # --- New MasterSoft Dashboard Widgets Data ---
    
    # 1. Today's Lectures
    import datetime as dt
    today_weekday = dt.datetime.now().weekday() # 0 = Monday, 6 = Sunday
    # Map Python weekday to Timetable day_of_week
    today_lectures = Timetable.objects.filter(
        course=student.course, 
        day_of_week=today_weekday
    ).select_related('subject', 'subject__staff', 'subject__staff__admin').order_by('start_time')

    # 2. Fees Status
    fee_records = FeeRecord.objects.filter(student=student).select_related('student__admin')
    pending_fees = 0.0
    for record in fee_records:
        if record.status in ['Unpaid', 'Partial']:
            pending_fees += (record.amount - record.amount_paid)

    # 3. Placement Drives Count
    active_drives = PlacementDrive.objects.filter(status='Active').count()

    # 4. Learning hub counts
    live_classes_qs = LiveClass.objects.filter(subject__course=student.course).select_related('subject', 'staff', 'staff__admin').order_by('-scheduled_at')
    now = timezone.now()
    live_now = 0
    upcoming_live_classes = []
    for live_class in live_classes_qs:
        end_time = live_class.scheduled_at + timedelta(minutes=live_class.duration_minutes)
        if live_class.is_active and live_class.scheduled_at <= now <= end_time:
            live_now += 1
        if live_class.scheduled_at >= now and len(upcoming_live_classes) < 4:
            upcoming_live_classes.append(live_class)

    assignment_count = Assignment.objects.filter(subject__course=student.course).count()
    material_count = StudyMaterial.objects.filter(subject__course=student.course).count()
    certificate_count = CertificateRequest.objects.filter(student=student).count()
    fee_pending_count = fee_records.filter(status__in=['Unpaid', 'Partial']).count()

    context = {
        'total_attendance': total_attendance,
        'percent_present': percent_present,
        'percent_absent': percent_absent,
        'total_subject': total_subject,
        'subjects': subjects,
        'data_present': data_present,
        'data_absent': data_absent,
        'data_name': subject_name,
        'subject_attendance_data': subject_attendance_data,
        'results': results,
        'result_subjects': result_subjects,
        'result_exam_scores': result_exam_scores,
        'result_test_scores': result_test_scores,
        'notifications': notifications,
        'today_lectures': today_lectures,
        'live_now': live_now,
        'upcoming_live_classes': upcoming_live_classes,
        'assignment_count': assignment_count,
        'material_count': material_count,
        'certificate_count': certificate_count,
        'fee_pending_count': fee_pending_count,
        'pending_fees': pending_fees,
        'active_drives': active_drives,
        'page_title': 'Student Dashboard',
    }
    return render(request, 'student_template/erpnext_student_home.html', context)


@ csrf_exempt
@login_required(login_url='/')
@student_required
def student_view_attendance(request):
    student = get_object_or_404(Student, admin=request.user)
    if request.method != 'POST':
        course = get_object_or_404(Course, id=student.course.id)
        context = {
            'subjects': Subject.objects.filter(course=course),
            'page_title': 'View Attendance'
        }
        return render(request, 'student_template/student_view_attendance.html', context)
    else:
        subject_id = request.POST.get('subject')
        start = request.POST.get('start_date')
        end = request.POST.get('end_date')
        try:
            subject = get_object_or_404(Subject, id=subject_id)
            start_date = datetime.strptime(start, "%Y-%m-%d")
            end_date = datetime.strptime(end, "%Y-%m-%d")
            attendance = Attendance.objects.filter(
                date__range=(start_date, end_date), subject=subject)
            attendance_reports = AttendanceReport.objects.filter(
                attendance__in=attendance, student=student).select_related('attendance')
            json_data = []
            for report in attendance_reports:
                data = {
                    "date":  str(report.attendance.date),
                    "status": report.status
                }
                json_data.append(data)
            return JsonResponse(json.dumps(json_data), safe=False)
        except Exception as e:
            return JsonResponse(json.dumps([]), safe=False)


@login_required(login_url='/')
@student_required
def student_apply_leave(request):
    form = LeaveReportStudentForm(request.POST or None)
    student = get_object_or_404(Student, admin_id=request.user.id)
    context = {
        'form': form,
        'leave_history': LeaveReportStudent.objects.filter(student=student),
        'page_title': 'Apply for leave'
    }
    if request.method == 'POST':
        if form.is_valid():
            try:
                obj = form.save(commit=False)
                obj.student = student
                obj.save()
                messages.success(
                    request, "Application for leave has been submitted for review")
                return redirect(reverse('student_apply_leave'))
            except Exception:
                messages.error(request, "Could not submit")
        else:
            messages.error(request, "Form has errors!")
    return render(request, "student_template/student_apply_leave.html", context)


@login_required(login_url='/')
@student_required
def student_feedback(request):
    form = FeedbackStudentForm(request.POST or None)
    student = get_object_or_404(Student, admin_id=request.user.id)
    context = {
        'form': form,
        'feedbacks': FeedbackStudent.objects.filter(student=student),
        'page_title': 'Student Feedback'

    }
    if request.method == 'POST':
        if form.is_valid():
            try:
                obj = form.save(commit=False)
                obj.student = student
                obj.save()
                messages.success(
                    request, "Feedback submitted for review")
                return redirect(reverse('student_feedback'))
            except Exception:
                messages.error(request, "Could not Submit!")
        else:
            messages.error(request, "Form has errors!")
    return render(request, "student_template/student_feedback.html", context)


@login_required(login_url='/')
@student_required
def student_view_profile(request):
    student = get_object_or_404(Student, admin=request.user)
    form = StudentEditForm(request.POST or None, request.FILES or None,
                           instance=student)
    context = {'form': form,
               'page_title': 'View/Edit Profile'
               }
    if request.method == 'POST':
        try:
            if form.is_valid():
                first_name = form.cleaned_data.get('first_name')
                last_name = form.cleaned_data.get('last_name')
                password = form.cleaned_data.get('password') or None
                address = form.cleaned_data.get('address')
                gender = form.cleaned_data.get('gender')
                passport = request.FILES.get('profile_pic') or None
                admin = student.admin
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
                student.save()
                messages.success(request, "Profile Updated!")
                return redirect(reverse('student_view_profile'))
            else:
                messages.error(request, "Invalid Data Provided")
        except Exception as e:
            messages.error(request, "Error Occured While Updating Profile " + str(e))

    return render(request, "student_template/student_view_profile.html", context)


@csrf_exempt
@login_required(login_url='/')
@student_required
def student_fcmtoken(request):
    token = request.POST.get('token')
    student_user = get_object_or_404(CustomUser, id=request.user.id)
    try:
        student_user.fcm_token = token
        student_user.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


@login_required(login_url='/')
@student_required
def student_view_notification(request):
    student = get_object_or_404(Student, admin=request.user)
    notifications = NotificationStudent.objects.filter(student=student)
    context = {
        'notifications': notifications,
        'page_title': "View Notifications"
    }
    return render(request, "student_template/student_view_notification.html", context)


@login_required(login_url='/')
@student_required
def student_view_result(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course)
    results = StudentResult.objects.filter(student=student).select_related('subject')
    result_map = {r.subject_id: r for r in results}
    
    # Build per-subject rows
    result_rows = []
    total_obtained = 0
    total_max = 0
    for subject in subjects:
        r = result_map.get(subject.id)
        obtained = (r.test + r.exam) if r else 0
        max_marks = subject.marks
        pct = round((obtained / max_marks * 100), 1) if max_marks > 0 else 0
        if pct >= 90: grade = 'A+'
        elif pct >= 75: grade = 'A'
        elif pct >= 60: grade = 'B'
        elif pct >= 45: grade = 'C'
        elif pct >= 33: grade = 'D'
        else: grade = 'F'
        result_rows.append({'subject': subject, 'test': r.test if r else '-', 'exam': r.exam if r else '-',
                             'obtained': obtained, 'max_marks': max_marks, 'pct': pct, 'grade': grade,
                             'has_result': bool(r)})
        total_obtained += obtained
        total_max += max_marks
    
    overall_pct = round((total_obtained / total_max * 100), 1) if total_max > 0 else 0
    context = {
        'student': student,
        'result_rows': result_rows,
        'total_obtained': total_obtained,
        'total_max': total_max,
        'overall_pct': overall_pct,
        'has_any_result': results.exists(),
        'page_title': "Exam Result"
    }
    return render(request, "student_template/student_view_result.html", context)

@login_required(login_url='/')
@student_required
def student_report_card(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course)
    results = StudentResult.objects.filter(student=student).select_related('subject')
    result_map = {r.subject_id: r for r in results}
    
    # Attendance stats
    total_attendance = AttendanceReport.objects.filter(student=student).count()
    present_attendance = AttendanceReport.objects.filter(student=student, status=True).count()
    attendance_pct = round((present_attendance / total_attendance * 100), 1) if total_attendance > 0 else 0
    
    # Per-subject result rows
    result_rows = []
    total_obtained = 0
    total_max = 0
    for subject in subjects:
        r = result_map.get(subject.id)
        test_marks = r.test if r else 0
        exam_marks = r.exam if r else 0
        obtained = test_marks + exam_marks
        max_marks = subject.marks
        pct = round((obtained / max_marks * 100), 1) if max_marks > 0 else 0
        if pct >= 90: grade = 'A+'
        elif pct >= 75: grade = 'A'
        elif pct >= 60: grade = 'B'
        elif pct >= 45: grade = 'C'
        elif pct >= 33: grade = 'D'
        else: grade = 'F'
        result_rows.append({'subject': subject, 'test': test_marks, 'exam': exam_marks,
                             'obtained': obtained, 'max_marks': max_marks, 'pct': pct, 'grade': grade})
        total_obtained += obtained
        total_max += max_marks
    
    overall_pct = round((total_obtained / total_max * 100), 1) if total_max > 0 else 0
    if overall_pct >= 90: overall_grade = 'A+'
    elif overall_pct >= 75: overall_grade = 'A'
    elif overall_pct >= 60: overall_grade = 'B'
    elif overall_pct >= 45: overall_grade = 'C'
    elif overall_pct >= 33: overall_grade = 'D'
    else: overall_grade = 'F'
    overall_status = 'PASS' if overall_pct >= 33 else 'FAIL'
    
    # Ranking among classmates
    classmates = Student.objects.filter(course=student.course)
    class_scores = []
    for cm in classmates:
        cm_results = StudentResult.objects.filter(student=cm)
        cm_obtained = sum(r.test + r.exam for r in cm_results)
        cm_max = sum(r.subject.marks for r in cm_results)
        cm_pct = (cm_obtained / cm_max * 100) if cm_max > 0 else 0
        class_scores.append(cm_pct)
    class_scores.sort(reverse=True)
    rank = class_scores.index(overall_pct) + 1 if overall_pct in class_scores else len(class_scores)
    class_strength = len(class_scores)
    class_avg = round(sum(class_scores) / len(class_scores), 1) if class_scores else 0
    max_avg = round(max(class_scores), 1) if class_scores else 0
    min_avg = round(min(class_scores), 1) if class_scores else 0
    
    context = {
        'student': student,
        'result_rows': result_rows,
        'total_obtained': total_obtained,
        'total_max': total_max,
        'overall_pct': overall_pct,
        'overall_grade': overall_grade,
        'overall_status': overall_status,
        'attendance_pct': attendance_pct,
        'rank': rank,
        'class_strength': class_strength,
        'class_avg': class_avg,
        'max_avg': max_avg,
        'min_avg': min_avg,
        'academic_year': student.academic_year_label,
        'semester_progress': student.semester_progress,
        'page_title': "Report Card"
    }
    return render(request, 'student_template/student_report_card.html', context)


@login_required(login_url='/')
@student_required
def student_report_card_pdf(request):
    import io
    from xhtml2pdf import pisa
    from django.template.loader import get_template
    from django.http import HttpResponse

    student = get_object_or_404(Student, admin=request.user)
    results = StudentResult.objects.filter(student=student)
    total_marks = sum(r.test + r.exam for r in results)
    max_marks = sum(r.subject.marks for r in results)
    percentage = (total_marks / max_marks * 100) if max_marks > 0 else 0
    context = {
        'student': student,
        'results': results,
        'total_marks': total_marks,
        'max_marks': max_marks,
        'percentage': percentage,
        'academic_year': student.academic_year_label,
        'semester_progress': student.semester_progress,
        'page_title': "Report Card"
    }
    template = get_template('student_template/student_report_card_pdf.html')
    html = template.render(context)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="report_card_{student.admin.first_name}.pdf"'
    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('Error generating PDF')
    return response


#library
from datetime import date, timedelta

@login_required(login_url='/')
@student_required
def view_books(request):
    books = Book.objects.all()
    borrowed_books = IssuedBook.objects.filter(student_id=request.user.email)
    borrowed_details = []
    
    # Pre-fetch borrowed books
    borrowed_isbns = [loan.isbn for loan in borrowed_books]
    books_dict = {str(b.isbn): b for b in Book.objects.filter(isbn__in=borrowed_isbns)}
    
    # Calculate live fines and collect borrowed details
    for loan in borrowed_books:
        book = books_dict.get(loan.isbn)
        if book:
            days = (date.today() - loan.issued_date).days
            fine = max(0, (days - 14) * 5)
            borrowed_details.append({
                'name': book.name,
                'author': book.author,
                'isbn': book.isbn,
                'issued_date': loan.issued_date,
                'expiry_date': loan.expiry_date,
                'fine': fine
            })
            
    # Mark books as borrowed in the catalog so the button changes state
    borrowed_isbns = [loan.isbn for loan in borrowed_books]
    catalog = []
    for b in books:
        catalog.append({
            'name': b.name,
            'author': b.author,
            'isbn': b.isbn,
            'category': b.category,
            'is_borrowed': str(b.isbn) in borrowed_isbns or b.isbn in borrowed_isbns
        })
            
    context = {
        'books': catalog,
        'borrowed_books': borrowed_details,
        'page_title': "Library Portal"
    }
    return render(request, "student_template/view_books.html", context)


@login_required(login_url='/')
@student_required
def borrow_book(request, isbn):
    student = get_object_or_404(Student, admin=request.user)
    book = get_object_or_404(Book, isbn=isbn)
    
    # Check if already borrowed
    already_borrowed = IssuedBook.objects.filter(student_id=request.user.email, isbn=isbn).exists()
    if already_borrowed:
        messages.warning(request, f"You have already borrowed '{book.name}'")
        return redirect(reverse('view_books'))
    
    # Create IssuedBook record
    loan = IssuedBook(
        student_id=request.user.email,
        isbn=isbn,
        issued_date=date.today(),
        expiry_date=date.today() + timedelta(days=14)
    )
    loan.save()
    messages.success(request, f"Successfully borrowed '{book.name}'! It is now on your bookshelf.")
    return redirect(reverse('view_books'))


# --- New ERP Modules Views ---

@login_required(login_url='/')
@student_required
def student_timetable(request):
    student = get_object_or_404(Student, admin=request.user)
    slots = Timetable.objects.filter(course=student.course).select_related(
        'subject', 'subject__staff', 'subject__staff__admin'
    ).order_by('day_of_week', 'start_time')
    timetable_by_day = {i: [] for i in range(6)}
    for slot in slots:
        timetable_by_day[slot.day_of_week].append(slot)
    day_names = [(0,'Monday'),(1,'Tuesday'),(2,'Wednesday'),(3,'Thursday'),(4,'Friday'),(5,'Saturday')]
    school_days = sum(1 for v in timetable_by_day.values() if v)
    total_periods = slots.count()
    total_subjects = Subject.objects.filter(course=student.course).count()
    context = {
        'student': student,
        'timetable_by_day': timetable_by_day,
        'timetable_list': list(slots),
        'day_names': day_names,
        'school_days': school_days,
        'total_periods': total_periods,
        'total_subjects': total_subjects,
        'timetable_has_data': total_periods > 0,
        'page_title': 'My Timetable',
    }
    return render(request, 'student_template/student_timetable.html', context)

@login_required(login_url='/')
@student_required
def student_hall_ticket(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course)
    
    # Simulate exam seat number and schedule
    seat_number = f"PAT/2026/{student.id:04d}"
    center = "SIR SITARAM AND LADY SHANTABAI PATKAR COLLEGE, MUMBAI"
    
    schedule = []
    import datetime as dt
    base_date = dt.date(2026, 7, 10)
    for index, subject in enumerate(subjects):
        exam_date = base_date + dt.timedelta(days=index * 2)
        schedule.append({
            'code': f"CS40{index+1}",
            'subject': subject.name,
            'date': exam_date.strftime('%A, %b %d, %Y'),
            'time': "10:00 AM - 1:00 PM"
        })
        
    context = {
        'student': student,
        'seat_number': seat_number,
        'center': center,
        'schedule': schedule,
        'page_title': "Examination Hall Ticket"
    }
    return render(request, "student_template/student_hall_ticket.html", context)


@login_required(login_url='/')
@student_required
def student_payable_fees(request):
    student = get_object_or_404(Student, admin=request.user)
    fee_records = FeeRecord.objects.filter(student=student).select_related('student__admin').order_by('due_date')
    
    # Pre-calculate balance due for each record
    for record in fee_records:
        record.balance = record.amount - record.amount_paid
        
    # Calculations
    total_amount = sum(record.amount for record in fee_records)
    total_paid = sum(record.amount_paid for record in fee_records)
    total_due = total_amount - total_paid
    
    # Fetch payment history
    payments = FeePayment.objects.filter(fee_record__student=student).select_related('fee_record').order_by('-payment_date')
    
    if request.method == "POST":
        fee_id = request.POST.get('fee_id')
        pay_amount = float(request.POST.get('amount_to_pay', 0))
        payment_method = request.POST.get('payment_method', 'UPI')
        
        fee_record = get_object_or_404(FeeRecord, id=fee_id, student=student)
        
        if pay_amount <= 0:
            messages.error(request, "Invalid payment amount!")
        elif pay_amount > (fee_record.amount - fee_record.amount_paid):
            messages.error(request, "Paying more than the due amount is not permitted.")
        else:
            # Update record
            fee_record.amount_paid += pay_amount
            if fee_record.amount_paid >= fee_record.amount:
                fee_record.status = "Paid"
            else:
                fee_record.status = "Partial"
            fee_record.save()
            
            # Log payment
            import random
            txn_id = f"TXN{random.randint(1000000000, 9999999999)}"
            payment = FeePayment.objects.create(
                fee_record=fee_record,
                transaction_id=txn_id,
                amount_paid=pay_amount,
                payment_method=payment_method
            )
            
            messages.success(request, f"Payment of INR {pay_amount:.2f} successful! Transaction ID: {txn_id}")
            return redirect(reverse('student_payable_fees'))
            
    context = {
        'fee_records': fee_records,
        'total_amount': total_amount,
        'total_paid': total_paid,
        'total_due': total_due,
        'payments': payments,
        'page_title': "Fee Management Portal"
    }
    return render(request, "student_template/student_payable_fees.html", context)


@login_required(login_url='/')
@student_required
def student_print_fee(request, fee_id):
    student = get_object_or_404(Student, admin=request.user)
    fee_record = get_object_or_404(FeeRecord, id=fee_id, student=student)
    payments = FeePayment.objects.filter(fee_record=fee_record).order_by('-payment_date')
    context = {
        'page_title': "Print Fee Invoice",
        'fee_record': fee_record,
        'payments': payments,
    }
    return render(request, "hod_template/fee_invoice.html", context)


@login_required(login_url='/')
@student_required
def student_fee_receipt(request, payment_id):
    import io
    from xhtml2pdf import pisa
    from django.template.loader import get_template
    from django.http import HttpResponse

    student = get_object_or_404(Student, admin=request.user)
    payment = get_object_or_404(FeePayment, id=payment_id, fee_record__student=student)
    
    context = {
        'payment': payment,
        'student': student,
        'page_title': "Fee Receipt"
    }
    
    template_path = 'student_template/student_fee_receipt_pdf.html'
    template = get_template(template_path)
    html = template.render(context)
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="fee_receipt_{payment.transaction_id}.pdf"'
    
    pisa_status = pisa.CreatePDF(
       html, dest=response)
       
    if pisa_status.err:
       return HttpResponse('We had some errors <pre>' + html + '</pre>')
    return response


@login_required(login_url='/')
@student_required
def student_certificates(request):
    student = get_object_or_404(Student, admin=request.user)
    requests = CertificateRequest.objects.filter(student=student).order_by('-created_at')
    
    context = {
        'student': student,
        'requests': requests,
        'approved_count': requests.filter(status='Approved').count(),
        'pending_count': requests.filter(status='Pending').count(),
        'rejected_count': requests.filter(status='Rejected').count(),
        'page_title': "Certificates Portal"
    }
    return render(request, "student_template/student_certificates.html", context)


@login_required(login_url='/')
@student_required
def student_request_certificate(request):
    if request.method == "POST":
        student = get_object_or_404(Student, admin=request.user)
        cert_type = request.POST.get('certificate_type')
        reason = request.POST.get('reason')
        
        if not cert_type or not reason:
            messages.error(request, "Please fill in all details!")
        else:
            CertificateRequest.objects.create(
                student=student,
                certificate_type=cert_type,
                reason=reason
            )
            messages.success(request, "Your request for a certificate has been submitted to the Administration office.")
            
    return redirect(reverse('student_certificates'))


@login_required(login_url='/')
@student_required
def student_placements(request):
    student = get_object_or_404(Student, admin=request.user)
    drives = PlacementDrive.objects.all().order_by('-drive_date')
    
    # Get all registrations for this student
    registrations = PlacementRegistration.objects.filter(student=student)
    reg_map = {reg.drive_id: reg.status for reg in registrations}
    
    # Pre-calculate registration state for each drive
    for drive in drives:
        drive.is_applied = drive.id in reg_map
        drive.application_status = reg_map.get(drive.id)
        
    applied_drive_ids = list(reg_map.keys())
    
    if request.method == "POST":
        drive_id = request.POST.get('drive_id')
        resume_url = request.POST.get('resume_url')
        
        drive = get_object_or_404(PlacementDrive, id=drive_id)
        
        if drive.id in applied_drive_ids:
            messages.warning(request, "You have already applied for this placement drive.")
        else:
            PlacementRegistration.objects.create(
                student=student,
                drive=drive,
                resume_url=resume_url or "https://drive.google.com/file/d/sample_resume/view"
            )
            messages.success(request, f"Successfully applied for '{drive.company_name}' drive!")
            return redirect(reverse('student_placements'))
            
    context = {
        'drives': drives,
        'applied_drive_ids': applied_drive_ids,
        'page_title': "Campus Placements Portal"
    }
    return render(request, "student_template/student_placements.html", context)


@csrf_exempt
@login_required(login_url='/')
@student_required
def student_ai_chat(request):
    if request.method == "POST":
        try:
            student = get_object_or_404(Student, admin=request.user)
            data = json.loads(request.body)
            query = data.get("message", "").lower().strip()
            
            reply = ""
            
            # --- 1. ATTENDANCE QUERY ---
            if "attendance" in query or "present" in query or "absent" in query or "classes" in query:
                from django.db.models import Count, Q
                subjects = Subject.objects.filter(course=student.course).annotate(
                    present_count=Count('attendance__attendancereport', filter=Q(attendance__attendancereport__student=student, attendance__attendancereport__status=True)),
                    absent_count=Count('attendance__attendancereport', filter=Q(attendance__attendancereport__student=student, attendance__attendancereport__status=False))
                )
                
                total_att = sum(s.present_count + s.absent_count for s in subjects)
                total_pres = sum(s.present_count for s in subjects)
                overall = int((total_pres / total_att) * 100) if total_att > 0 else 0
                
                reply = f"🎓 **Attendance Overview:**\n"
                reply += f"Your overall attendance is **{overall}%** ({total_pres} present out of {total_att} total lectures).\n\n"
                reply += "Here is your subject-wise breakdown:\n"
                
                for subject in subjects:
                    pres = subject.present_count
                    absn = subject.absent_count
                    tot = pres + absn
                    pct = int((pres / tot) * 100) if tot > 0 else 0
                    
                    warning_flag = "⚠️ Low!" if pct < 75 else "✅ OK"
                    reply += f"• **{subject.name}**: {pct}% ({pres}/{tot} lectures) - *{warning_flag}*\n"
                
                if overall < 75:
                    reply += "\n🚨 *Warning: Your overall attendance is below the mandatory 75% threshold. Please attend classes regularly to avoid exam debarment.*"
                    
            # --- 2. FEE QUERY ---
            elif "fee" in query or "due" in query or "payable" in query or "balance" in query or "money" in query or "cost" in query:
                records = FeeRecord.objects.filter(student=student).select_related('student__admin')
                pending_fees = 0.0
                unpaid_details = []
                
                for r in records:
                    due_amt = r.amount - r.amount_paid
                    if due_amt > 0:
                        pending_fees += due_amt
                        unpaid_details.append(f"• **{r.category}**: INR {due_amt:,.2f} (Due: {r.due_date})")
                        
                if pending_fees == 0:
                    reply = "💸 **Financial Status:**\nFantastic news! You have **no pending fees**. All your dues are fully paid. Thank you!"
                else:
                    reply = f"💸 **Financial Status:**\n"
                    reply += f"You have an outstanding fee balance of **INR {pending_fees:,.2f}**.\n\n"
                    reply += "Outstanding Items:\n"
                    reply += "\n".join(unpaid_details)
                    reply += "\n\n👉 You can pay these securely online in the *Payable Fees* section."

            # --- 3. RESULTS & SGPA PREDICTION ---
            elif "predict" in query or "sgpa" in query or "cgpa" in query or "result" in query or "marks" in query or "grade" in query:
                results = StudentResult.objects.filter(student=student).select_related('subject')
                if not results.exists():
                    reply = "📈 **Result Analysis:**\nNo examination results or internal test scores are currently entered for your profile."
                else:
                    total_grade_points = 0.0
                    count = 0
                    reply = "📈 **SGPA & Academic Performance:**\n"
                    reply += "Here are your current scores and grade analysis:\n"
                    
                    for r in results:
                        total_marks = r.test + r.exam  # test out of 20, exam out of 80 -> total 100
                        # Calculate grade points
                        if total_marks >= 90:
                            gp, grade = 10, "O (Outstanding)"
                        elif total_marks >= 80:
                            gp, grade = 9, "A+ (Excellent)"
                        elif total_marks >= 70:
                            gp, grade = 8, "A (Very Good)"
                        elif total_marks >= 60:
                            gp, grade = 7, "B+ (Good)"
                        elif total_marks >= 50:
                            gp, grade = 6, "B (Above Average)"
                        elif total_marks >= 40:
                            gp, grade = 5, "C (Pass)"
                        else:
                            gp, grade = 0, "F (Fail)"
                            
                        total_grade_points += gp
                        count += 1
                        reply += f"• **{r.subject.name}**: {total_marks:.0f}/100 -> Grade: *{grade}*\n"
                        
                    predicted_sgpa = total_grade_points / count if count > 0 else 0.0
                    reply += f"\n🎯 **Predicted SGPA**: **{predicted_sgpa:.2f}**\n"
                    if predicted_sgpa >= 9.0:
                        reply += "🌟 *Amazing! You are performing at an Outstanding academic tier. Keep it up!*"
                    elif predicted_sgpa >= 7.5:
                        reply += "👍 *Great! You are maintaining a solid First Class distinction.*"
                    else:
                        reply += "💪 *Good effort. Focus on improving end-sem exam scores to boost your SGPA above 7.5.*"

            # --- 4. PLACEMENT QUERY ---
            elif "placement" in query or "job" in query or "drive" in query or "company" in query or "recruit" in query:
                drives = PlacementDrive.objects.filter(status='Active')
                applications = PlacementRegistration.objects.filter(student=student).select_related('drive')
                
                reply = "💼 **Campus Placements Board:**\n"
                
                if drives.exists():
                    reply += "Active recruitment drives on campus:\n"
                    for d in drives:
                        reply += f"• **{d.company_name}** - {d.job_role} | Package: *{d.package}* (Drive Date: {d.drive_date})\n"
                else:
                    reply += "There are no active recruitment drives announced today.\n"
                    
                if applications.exists():
                    reply += "\n**Your Applications:**\n"
                    for app in applications:
                        reply += f"• **{app.drive.company_name}** ({app.drive.job_role}) -> Status: **{app.status}**\n"
                else:
                    reply += "\n*You have not applied to any campus drives yet.*"

            # --- 5. HELP / DEFAULT RESPONSE ---
            else:
                reply = "Hello, Amaan! I am your **Patkar College AI Assistant**. 🎓\n\n"
                reply += "I am directly linked to your student record and can answer questions in real-time. Try asking me:\n\n"
                reply += "• 📅 *\"What is my attendance?\"* (shows subject-wise lectures and alerts)\n"
                reply += "• 💸 *\"Do I have any pending fees?\"* (lists outstanding tuition/exam fee balances)\n"
                reply += "• 📈 *\"Predict my SGPA\"* (analyzes marks and estimates grade average)\n"
                reply += "• 💼 *\"What jobs are available?\"* (lists active corporate recruitment drives)"
                
            return JsonResponse({"reply": reply})
        except Exception as e:
            return JsonResponse({"reply": f"Sorry, I encountered an error processing your query: {str(e)}"})
            
    return JsonResponse({"reply": "Invalid request method."})


# --- Online Registration Views ---

@login_required(login_url='/')
@student_required
def student_reg_personal(request):
    student = get_object_or_404(Student, admin=request.user)
    reg, created = StudentRegistration.objects.get_or_create(student=student)
    
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
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(f"Invalid dob_val {dob_val}: {e}")
                
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
        reg.municipal_ward = request.POST.get('municipal_ward', reg.municipal_ward)
        reg.has_internet = request.POST.get('has_internet', reg.has_internet)
        
        try:
            reg.height = float(request.POST.get('height', reg.height) or 0)
            reg.weight = float(request.POST.get('weight', reg.weight) or 0)
        except ValueError as e:
            import logging
            logging.getLogger(__name__).warning(f"Invalid height/weight value: {e}")
            
        reg.abc_id = request.POST.get('abc_id', reg.abc_id)
        reg.save()
        messages.success(request, "Step 1: Personal Details updated successfully.")
        return redirect(reverse('student_reg_address'))
        
    context = {
        'reg': reg,
        'dob_str': reg.dob.strftime('%Y-%m-%d') if hasattr(reg.dob, 'strftime') else (str(reg.dob) if reg.dob else ''),
        'page_title': "Online Registration - Personal Details"
    }
    return render(request, "student_template/student_reg_personal.html", context)


@login_required(login_url='/')
@student_required
def student_reg_address(request):
    student = get_object_or_404(Student, admin=request.user)
    reg = get_object_or_404(StudentRegistration, student=student)
    
    if request.method == "POST":
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
        
        reg.guardian_occupation = request.POST.get('guardian_occupation', reg.guardian_occupation)
        reg.guardian_mobile = request.POST.get('guardian_mobile', reg.guardian_mobile)
        try:
            reg.guardian_income = float(request.POST.get('guardian_income', reg.guardian_income) or 0)
        except ValueError as e:
            import logging
            logging.getLogger(__name__).warning(f"Invalid guardian_income: {e}")
            
        reg.student_phone = request.POST.get('student_phone', reg.student_phone)
        reg.student_email = request.POST.get('student_email', reg.student_email)
        reg.save()
        messages.success(request, "Step 2: Address & Contact Details updated successfully.")
        return redirect(reverse('student_reg_photo'))
        
    context = {
        'reg': reg,
        'page_title': "Online Registration - Address & Contacts"
    }
    return render(request, "student_template/student_reg_address.html", context)


@login_required(login_url='/')
@student_required
def student_reg_photo(request):
    student = get_object_or_404(Student, admin=request.user)
    reg = get_object_or_404(StudentRegistration, student=student)
    
    if request.method == "POST":
        # Mock upload or successful continue
        messages.success(request, "Step 3: Photo & Signature verified.")
        return redirect(reverse('student_reg_documents'))
        
    context = {
        'reg': reg,
        'page_title': "Online Registration - Photo & Signature"
    }
    return render(request, "student_template/student_reg_photo.html", context)


@login_required(login_url='/')
@student_required
def student_reg_documents(request):
    student = get_object_or_404(Student, admin=request.user)
    reg = get_object_or_404(StudentRegistration, student=student)
    
    if request.method == "POST":
        if 'aadhar_file' in request.FILES:
            reg.aadhar_file = request.FILES['aadhar_file']
        if 'marksheet_file' in request.FILES:
            reg.marksheet_file = request.FILES['marksheet_file']
        reg.save()
        messages.success(request, "Step 4: Documents uploaded and confirmed.")
        return redirect(reverse('student_reg_confirm'))
        
    context = {
        'reg': reg,
        'page_title': "Online Registration - Documents Upload"
    }
    return render(request, "student_template/student_reg_documents.html", context)


@login_required(login_url='/')
@student_required
def student_reg_confirm(request):
    student = get_object_or_404(Student, admin=request.user)
    reg = get_object_or_404(StudentRegistration, student=student)
    
    if request.method == "POST":
        # Confirm registration and redirect to printable application
        messages.success(request, "Admission Application Confirmed successfully.")
        return redirect(reverse('student_reg_print'))
        
    context = {
        'reg': reg,
        'dob_str': reg.dob.strftime('%d/%m/%Y') if hasattr(reg.dob, 'strftime') else (datetime.strptime(str(reg.dob), '%Y-%m-%d').strftime('%d/%m/%Y') if reg.dob else ''),
        'page_title': "Online Registration - Confirm Details"
    }
    return render(request, "student_template/student_reg_confirm.html", context)


@login_required(login_url='/')
@student_required
def student_reg_print(request):
    reg_id = request.GET.get('reg_id')
    if reg_id and request.user.user_type == '1':
        reg = get_object_or_404(StudentRegistration, id=reg_id)
        student = reg.student
    elif reg_id and request.user.user_type == '2':
        staff = get_object_or_404(Staff, admin=request.user)
        reg = get_object_or_404(StudentRegistration, id=reg_id, student__course=staff.course)
        student = reg.student
    else:
        student = get_object_or_404(Student, admin=request.user)
        reg = get_object_or_404(StudentRegistration, student=student)
    
    # Render printable A4 admission form
    context = {
        'reg': reg,
        'student': student,
        'dob_str': reg.dob.strftime('%d/%m/%Y') if hasattr(reg.dob, 'strftime') else (datetime.strptime(str(reg.dob), '%Y-%m-%d').strftime('%d/%m/%Y') if reg.dob else ''),
        'current_date': datetime.now().strftime('%d/%m/%Y'),
        'page_title': "Print Admission Application Form"
    }
    return render(request, "student_template/student_registration_form.html", context)



@login_required(login_url='/')
@student_required
def student_events_calendar(request):
    from .models import CollegeEvent
    events = CollegeEvent.objects.all().order_by('date')
    events_json = []
    color_map = {
        'exam': '#dc3545',
        'holiday': '#28a745',
        'event': '#5e64ff',
        'seminar': '#fd7e14',
        'deadline': '#ffc107',
    }
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
@student_required
def student_view_exams(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course)
    
    # Exams for the student's subjects that they haven't taken yet
    taken_exam_ids = OnlineExamResult.objects.filter(student=student).values_list('exam_id', flat=True)
    available_exams = Exam.objects.filter(subject__in=subjects, is_active=True).exclude(id__in=taken_exam_ids)
    
    # Previous results
    results = OnlineExamResult.objects.filter(student=student).order_by('-submitted_at')
    
    context = {
        'available_exams': available_exams,
        'results': results,
        'page_title': 'Online Examinations'
    }
    return render(request, 'student_template/view_exams.html', context)

@login_required(login_url='/')
@student_required
def student_take_exam(request, exam_id):
    student = get_object_or_404(Student, admin=request.user)
    exam = get_object_or_404(Exam, id=exam_id, is_active=True)
    
    # Verify not already taken
    if OnlineExamResult.objects.filter(student=student, exam=exam).exists():
        messages.error(request, "You have already attempted this exam.")
        return redirect(reverse('student_view_exams'))
        
    questions = exam.questions.all()
    context = {
        'exam': exam,
        'questions': questions,
        'page_title': f'Taking Exam: {exam.title}'
    }
    return render(request, 'student_template/take_exam.html', context)

@login_required(login_url='/')
@student_required
def submit_exam(request, exam_id):
    if request.method == 'POST':
        student = get_object_or_404(Student, admin=request.user)
        exam = get_object_or_404(Exam, id=exam_id)
        
        if OnlineExamResult.objects.filter(student=student, exam=exam).exists():
            messages.error(request, "Exam already submitted.")
            return redirect(reverse('student_view_exams'))
            
        questions = exam.questions.all()
        score = 0
        total_marks = 0
        
        for q in questions:
            total_marks += q.marks
            selected_option = request.POST.get(f'question_{q.id}')
            if selected_option == q.correct_option:
                score += q.marks
                
        # Save Result
        OnlineExamResult.objects.create(
            student=student,
            exam=exam,
            score=score,
            total_marks=total_marks
        )
        messages.success(request, f"Exam submitted! You scored {score}/{total_marks}.")
        return redirect(reverse('student_view_exams'))
    return redirect(reverse('student_view_exams'))

@csrf_exempt
@login_required(login_url='/')
@student_required
def ai_chat_assistant(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            prompt = data.get('prompt', '')
            
            from .ai_helper import generate_ollama_response
            response_text = generate_ollama_response(prompt, system_prompt="You are a helpful AI Study Assistant for Patkar College. Guide the student through their syllabus.")
            
            if not response_text:
                response_text = "I am currently offline or local AI server is down. Here is a helpful fallback response: Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles."
                
            return JsonResponse({'status': 'success', 'response': response_text})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    context = {
        'page_title': 'AI Study Assistant'
    }
    return render(request, 'student_template/ai_assistant.html', context)


# --- Version 2.0 LMS Views ---

@login_required(login_url='/')
@student_required
def student_lms_home(request):
    student = get_object_or_404(Student, admin=request.user)
    courses = VideoCourse.objects.filter(subject__course=student.course).order_by('-created_at')
    assignments = Assignment.objects.filter(subject__course=student.course).order_by('-due_date')
    materials = StudyMaterial.objects.filter(subject__course=student.course).order_by('-created_at')
    live_classes = LiveClass.objects.filter(subject__course=student.course).select_related('subject', 'staff').order_by('-scheduled_at')
    now = timezone.now()
    live_now = []
    upcoming_live = []
    for live_class in live_classes:
        end_time = live_class.scheduled_at + timedelta(minutes=live_class.duration_minutes)
        live_class.ends_at = end_time
        live_class.is_live_now = live_class.is_active and live_class.scheduled_at <= now <= end_time
        live_class.is_upcoming = live_class.scheduled_at > now
        live_class.starts_in_minutes = max(0, int((live_class.scheduled_at - now).total_seconds() // 60)) if live_class.is_upcoming else 0
        if live_class.is_live_now:
            live_now.append(live_class)
        elif live_class.is_upcoming:
            upcoming_live.append(live_class)
    
    context = {
        'page_title': 'Learning Management System (LMS)',
        'courses': courses,
        'assignments': assignments,
        'materials': materials,
        'courses_count': courses.count(),
        'assignments_count': assignments.count(),
        'materials_count': materials.count(),
        'live_now_count': len(live_now),
        'upcoming_live_count': len(upcoming_live),
        'live_now': live_now,
        'upcoming_live': upcoming_live[:4],
    }
    return render(request, "student_template/student_lms_home.html", context)

@login_required(login_url='/')
@student_required
def student_view_course(request, course_id):
    student = get_object_or_404(Student, admin=request.user)
    course = get_object_or_404(VideoCourse, id=course_id, subject__course=student.course)
    lessons = course.lessons.all().order_by('order')
    
    # Get completed lesson IDs for this student
    completed_lesson_ids = CourseProgress.objects.filter(
        student=student, lesson__in=lessons, is_completed=True
    ).values_list('lesson_id', flat=True)
    
    context = {
        'page_title': course.title,
        'course': course,
        'lessons': lessons,
        'completed_lesson_ids': list(completed_lesson_ids),
    }
    return render(request, "student_template/student_view_course.html", context)

@login_required(login_url='/')
@student_required
def student_watch_lesson(request, lesson_id):
    student = get_object_or_404(Student, admin=request.user)
    lesson = get_object_or_404(VideoLesson, id=lesson_id, course__subject__course=student.course)
    course = lesson.course
    lessons = course.lessons.all().order_by('order')
    
    # Mark completion or get progress
    progress, created = CourseProgress.objects.get_or_create(student=student, lesson=lesson)
    if request.method == 'POST':
        progress.is_completed = True
        progress.save()
        messages.success(request, f"Lesson '{lesson.title}' marked as completed!")
        return redirect(reverse('student_watch_lesson', args=[lesson.id]))
        
    completed_lesson_ids = CourseProgress.objects.filter(
        student=student, lesson__in=lessons, is_completed=True
    ).values_list('lesson_id', flat=True)
    
    context = {
        'page_title': f"{lesson.title} - {course.title}",
        'lesson': lesson,
        'course': course,
        'lessons': lessons,
        'is_completed': progress.is_completed,
        'completed_lesson_ids': list(completed_lesson_ids),
    }
    return render(request, "student_template/student_watch_lesson.html", context)

@login_required(login_url='/')
@student_required
def student_assignments(request):
    student = get_object_or_404(Student, admin=request.user)
    assignments = Assignment.objects.filter(subject__course=student.course).order_by('-due_date')
    
    # Get student's submissions mapped by assignment id
    submissions = AssignmentSubmission.objects.filter(student=student).select_related('assignment', 'student__admin')
    submitted_assignment_ids = submissions.values_list('assignment_id', flat=True)
    pending_assignment_count = assignments.exclude(id__in=submitted_assignment_ids).count()
    
    context = {
        'page_title': 'My Assignments',
        'assignments': assignments,
        'submissions': {sub.assignment_id: sub for sub in submissions},
        'submitted_assignment_ids': list(submitted_assignment_ids),
        'pending_assignment_count': pending_assignment_count,
    }
    return render(request, "student_template/student_assignments.html", context)

@login_required(login_url='/')
@student_required
def student_submit_assignment(request, assignment_id):
    student = get_object_or_404(Student, admin=request.user)
    assignment = get_object_or_404(Assignment, id=assignment_id, subject__course=student.course)
    submission = AssignmentSubmission.objects.filter(assignment=assignment, student=student).first()
    
    if request.method == 'POST':
        submission_text = request.POST.get('submission_text')
        attachment = request.FILES.get('attachment')
        
        if submission:
            submission.submission_text = submission_text
            if attachment:
                submission.attachment = attachment
            submission.save()
            messages.success(request, "Assignment submission updated!")
        else:
            AssignmentSubmission.objects.create(
                assignment=assignment, student=student,
                submission_text=submission_text, attachment=attachment
            )
            messages.success(request, "Assignment submitted successfully!")
        return redirect(reverse('student_assignments'))
        
    context = {
        'page_title': f"Submit Assignment: {assignment.title}",
        'assignment': assignment,
        'submission': submission,
    }
    return render(request, "student_template/student_submit_assignment.html", context)

@login_required(login_url='/')
@student_required
def student_materials(request):
    student = get_object_or_404(Student, admin=request.user)
    materials = StudyMaterial.objects.filter(subject__course=student.course).order_by('-created_at')
    
    context = {
        'page_title': 'Downloads & Study Materials Hub',
        'materials': materials,
    }
    return render(request, "student_template/student_materials.html", context)


@login_required(login_url='/')
@student_required
def student_live_classes(request):
    student = get_object_or_404(Student, admin=request.user)
    now = timezone.now()
    live_classes = LiveClass.objects.filter(subject__course=student.course).select_related(
        'subject', 'staff', 'staff__admin'
    ).order_by('-scheduled_at')

    live_now = []
    upcoming = []
    past = []
    for live_class in live_classes:
        end_time = live_class.scheduled_at + timedelta(minutes=live_class.duration_minutes)
        live_class.ends_at = end_time
        live_class.is_live_now = live_class.is_active and live_class.scheduled_at <= now <= end_time
        live_class.is_upcoming = live_class.scheduled_at > now
        live_class.starts_in_minutes = max(0, int((live_class.scheduled_at - now).total_seconds() // 60)) if live_class.is_upcoming else 0
        if live_class.is_active and live_class.scheduled_at <= now <= end_time:
            live_now.append(live_class)
        elif live_class.scheduled_at > now:
            upcoming.append(live_class)
        else:
            past.append(live_class)

    context = {
        'page_title': 'Live Virtual Classrooms',
        'live_classes': live_classes,
        'live_now': live_now,
        'upcoming_classes': upcoming,
        'past_classes': past,
        'live_total': live_classes.count(),
    }
    return render(request, "student_template/student_live_classes.html", context)


@login_required(login_url='/')
@student_required
def student_join_live_class(request, class_id):
    student = get_object_or_404(Student, admin=request.user)
    live_class = get_object_or_404(LiveClass, id=class_id, subject__course=student.course)
    
    from django.utils import timezone
    attendance, created = LiveClassAttendance.objects.get_or_create(
        live_class=live_class,
        student=student,
        defaults={'joined_at': timezone.now()}
    )
    if not created:
        attendance.joined_at = timezone.now()
        attendance.left_at = None
        attendance.save()
        
    context = {
        'page_title': f"Join: {live_class.title}",
        'live_class': live_class,
        'student': student,
    }
    return render(request, "student_template/student_join_live_class.html", context)


@login_required(login_url='/')
@student_required
def student_leave_live_class(request, class_id):
    student = get_object_or_404(Student, admin=request.user)
    live_class = get_object_or_404(LiveClass, id=class_id, subject__course=student.course)
    
    from django.utils import timezone
    LiveClassAttendance.objects.filter(
        live_class=live_class,
        student=student,
        left_at__isnull=True
    ).update(left_at=timezone.now())
    
    messages.success(request, f"You left the live class '{live_class.title}'.")
    return redirect(reverse('student_live_classes'))


@login_required(login_url='/')
@student_required
def student_admission_letter(request):
    student = get_object_or_404(Student, admin=request.user)
    context = {
        'page_title': 'Admission Letter',
        'student': student
    }
    return render(request, 'student_template/admission_letter.html', context)

@login_required(login_url='/')
@student_required
def student_fee_slip(request):
    student = get_object_or_404(Student, admin=request.user)
    context = {
        'page_title': 'Fee Slip',
        'student': student
    }
    return render(request, 'student_template/fee_slip.html', context)

@login_required(login_url='/')
@student_required
def student_view_course(request, course_id):
    student = get_object_or_404(Student, admin=request.user)
    course = get_object_or_404(VideoCourse, id=course_id, subject__course=student.course)
    lessons = course.lessons.all().order_by('order')
    
    # Get completed lesson IDs for this student
    completed_lesson_ids = CourseProgress.objects.filter(
        student=student, lesson__in=lessons, is_completed=True
    ).values_list('lesson_id', flat=True)
    
    context = {
        'page_title': course.title,
        'course': course,
        'lessons': lessons,
        'completed_lesson_ids': list(completed_lesson_ids),
    }
    return render(request, "student_template/student_view_course.html", context)

@login_required(login_url='/')
@student_required
def student_watch_lesson(request, lesson_id):
    student = get_object_or_404(Student, admin=request.user)
    lesson = get_object_or_404(VideoLesson, id=lesson_id, course__subject__course=student.course)
    course = lesson.course
    lessons = course.lessons.all().order_by('order')
    
    # Mark completion or get progress
    progress, created = CourseProgress.objects.get_or_create(student=student, lesson=lesson)
    if request.method == 'POST':
        progress.is_completed = True
        progress.save()
        messages.success(request, f"Lesson '{lesson.title}' marked as completed!")
        return redirect(reverse('student_watch_lesson', args=[lesson.id]))
        
    completed_lesson_ids = CourseProgress.objects.filter(
        student=student, lesson__in=lessons, is_completed=True
    ).values_list('lesson_id', flat=True)
    
    context = {
        'page_title': f"{lesson.title} - {course.title}",
        'lesson': lesson,
        'course': course,
        'lessons': lessons,
        'is_completed': progress.is_completed,
        'completed_lesson_ids': list(completed_lesson_ids),
    }
    return render(request, "student_template/student_watch_lesson.html", context)

@login_required(login_url='/')
@student_required
def student_join_live_class(request, class_id):
    student = get_object_or_404(Student, admin=request.user)
    live_class = get_object_or_404(LiveClass, id=class_id, subject__course=student.course)
    
    from django.utils import timezone
    attendance, created = LiveClassAttendance.objects.get_or_create(
        live_class=live_class,
        student=student,
        defaults={'joined_at': timezone.now()}
    )
    if not created:
        attendance.joined_at = timezone.now()
        attendance.left_at = None
        attendance.save()
        
    context = {
        'page_title': f"Join: {live_class.title}",
        'live_class': live_class,
        'student': student,
    }
    return render(request, "student_template/student_join_live_class.html", context)


@login_required(login_url='/')
@student_required
def student_leave_live_class(request, class_id):
    student = get_object_or_404(Student, admin=request.user)
    live_class = get_object_or_404(LiveClass, id=class_id, subject__course=student.course)
    
    from django.utils import timezone
    LiveClassAttendance.objects.filter(
        live_class=live_class,
        student=student,
        left_at__isnull=True
    ).update(left_at=timezone.now())
    
    messages.success(request, f"You left the live class '{live_class.title}'.")
    return redirect(reverse('student_live_classes'))


@login_required(login_url='/')
@student_required
def student_admission_letter(request):
    student = get_object_or_404(Student, admin=request.user)
    context = {
        'page_title': 'Admission Letter',
        'student': student
    }
    return render(request, 'student_template/admission_letter.html', context)

@login_required(login_url='/')
@student_required
def student_fee_slip(request):
    student = get_object_or_404(Student, admin=request.user)
    fee_records = FeeRecord.objects.filter(student=student).order_by('due_date')
    total_pending = sum(r.amount - r.amount_paid for r in fee_records if r.status != 'Paid')
    context = {
        'page_title': 'Paid Fee Slip',
        'student': student,
        'fee_records': fee_records,
        'total_pending': total_pending,
        'has_records': fee_records.exists(),
    }
    return render(request, 'student_template/fee_slip.html', context)


@login_required(login_url='/')
@student_required
def student_homework(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course)
    context = {
        'page_title': 'Homework / Home Assignments',
        'student': student,
        'subjects': subjects,
    }
    return render(request, 'student_template/student_homework.html', context)

@login_required(login_url='/')
@student_required
def student_test_results(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course)
    results = StudentResult.objects.filter(student=student).select_related('subject')
    result_map = {r.subject_id: r for r in results}

    rows = []
    total_obtained = 0
    total_max = 0
    for subject in subjects:
        r = result_map.get(subject.id)
        test_marks = r.test if r else 0
        max_marks = subject.marks
        pct = round((test_marks / max_marks * 100), 1) if max_marks > 0 else 0
        rows.append({
            'subject': subject,
            'test_marks': test_marks,
            'max_marks': max_marks,
            'pct': pct,
        })
        total_obtained += test_marks
        total_max += max_marks

    overall_pct = round((total_obtained / total_max * 100), 1) if total_max > 0 else 0

    context = {
        'page_title': 'Class Test Report',
        'student': student,
        'rows': rows,
        'total_obtained': total_obtained,
        'total_max': total_max,
        'overall_pct': overall_pct,
        'has_results': results.exists(),
    }
    return render(request, 'student_template/student_test_results.html', context)


@login_required(login_url='/')
@student_required
def student_online_store(request):
    student = get_object_or_404(Student, admin=request.user)
    context = {
        'page_title': 'Online Store',
        'student': student
    }
    return render(request, 'student_template/student_online_store.html', context)
