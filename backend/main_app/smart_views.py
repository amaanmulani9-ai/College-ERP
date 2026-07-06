import json
import qrcode
import uuid
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import date
from django.utils import timezone

from .models import CustomUser, Student, Staff, Course, Subject, Session, Attendance, AttendanceReport, Book, IssuedBook, VisitorPass

@login_required
def student_id_card(request):
    student = get_object_or_404(Student.objects.select_related('admin', 'course', 'session'), admin=request.user)
    context = {
        'page_title': 'Digital ID Card',
        'student': student,
        'prn_number': f"PAT-{student.id:04d}-{student.session.start_year.year if student.session else 2026}"
    }
    return render(request, "student_template/student_id_card.html", context)

@login_required
def staff_id_card(request):
    staff = get_object_or_404(Staff.objects.select_related('admin', 'course'), admin=request.user)
    if not staff.id_card_code:
        staff.id_card_code = f"EMP-{staff.course.name[:3].upper() if staff.course else 'GEN'}-{staff.id:04d}"
        staff.save()
    context = {
        'page_title': 'Digital ID Card',
        'staff': staff,
        'employee_id': f"EMP-{staff.id:04d}-{staff.admin.created_at.year}"
    }
    return render(request, "staff_template/staff_id_card.html", context)

@login_required
def generate_student_qr(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    # Generate QR containing details
    qr_data = f"STUDENT_ID:{student.admin.email}"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#2b2d42", back_color="white")
    
    response = HttpResponse(content_type="image/png")
    img.save(response, "PNG")
    return response

@login_required
def generate_staff_qr(request, staff_id):
    staff = get_object_or_404(Staff, id=staff_id)
    # Generate QR containing details
    qr_data = f"STAFF_ID:{staff.admin.email}"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#2b2d42", back_color="white")
    
    response = HttpResponse(content_type="image/png")
    img.save(response, "PNG")
    return response

@login_required
def staff_scanner_desk(request):
    if request.user.user_type not in ['1', '2']: # HOD or Staff only
        messages.error(request, "Access Denied")
        return redirect(reverse('login_page'))
        
    staff = getattr(request.user, 'staff', None)
    subjects = Subject.objects.filter(staff=staff) if staff else Subject.objects.all()
    sessions = Session.objects.all()
    
    context = {
        'page_title': 'Smart Scan Desk',
        'subjects': subjects,
        'sessions': sessions
    }
    return render(request, "staff_template/staff_scanner_desk.html", context)

@csrf_exempt
@login_required
def scan_attendance_qr(request):
    if request.method == 'POST' and request.user.user_type in ['1', '2']:
        try:
            data = json.loads(request.body)
            qr_content = data.get('qr_content', '')
            subject_id = data.get('subject_id')
            session_id = data.get('session_id')
            
            if not qr_content.startswith("STUDENT_ID:"):
                return JsonResponse({'status': 'error', 'message': 'Invalid Student QR Code'})
                
            email = qr_content.replace("STUDENT_ID:", "").strip()
            user = get_object_or_404(CustomUser, email=email)
            student = get_object_or_404(Student, admin=user)
            
            subject = get_object_or_404(Subject, id=subject_id)
            session = get_object_or_404(Session, id=session_id)
            
            # Fetch or create Attendance record for today
            today = date.today()
            attendance, created = Attendance.objects.get_or_create(
                session=session,
                subject=subject,
                date=today
            )
            
            # Mark student present
            report, r_created = AttendanceReport.objects.get_or_create(
                student=student,
                attendance=attendance,
                defaults={'status': True}
            )
            
            if not r_created:
                report.status = True
                report.save()
                
            return JsonResponse({
                'status': 'success',
                'message': f"Attendance successfully marked for {user.get_full_name()} in {subject.name}"
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

@csrf_exempt
@login_required
def scan_library_qr(request):
    if request.method == 'POST' and request.user.user_type in ['1', '2']:
        try:
            data = json.loads(request.body)
            qr_content = data.get('qr_content', '')
            isbn = data.get('isbn', '').strip()
            
            if not qr_content.startswith("STUDENT_ID:"):
                return JsonResponse({'status': 'error', 'message': 'Invalid Student QR Code'})
                
            email = qr_content.replace("STUDENT_ID:", "").strip()
            user = get_object_or_404(CustomUser, email=email)
            student = get_object_or_404(Student, admin=user)
            book = get_object_or_404(Book, isbn=isbn)
            
            # Check if book is already borrowed
            issued_book = IssuedBook.objects.filter(student_id=email, isbn=isbn).first()
            if issued_book:
                # Return the book
                issued_book.delete()
                return JsonResponse({
                    'status': 'success',
                    'action': 'return',
                    'message': f"Book '{book.name}' successfully returned by {user.get_full_name()}."
                })
            else:
                # Issue the book
                from datetime import timedelta
                IssuedBook.objects.create(
                    student_id=email,
                    isbn=isbn,
                    issued_date=date.today(),
                    expiry_date=date.today() + timedelta(days=14)
                )
                return JsonResponse({
                    'status': 'success',
                    'action': 'issue',
                    'message': f"Book '{book.name}' successfully issued to {user.get_full_name()}. Due date: {date.today() + timedelta(days=14)}"
                })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def visitor_pass_request(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        purpose = request.POST.get('purpose')
        host_person = request.POST.get('host_person')
        visit_date = request.POST.get('visit_date')
        
        pass_code = str(uuid.uuid4())[:8].upper()
        
        VisitorPass.objects.create(
            name=name,
            email=email,
            phone=phone,
            purpose=purpose,
            host_person=host_person,
            visit_date=visit_date,
            pass_code=pass_code,
            status='Pending'
        )
        
        messages.success(request, f"Your visitor pass request has been submitted. Keep your Pass Code: {pass_code}")
        return redirect(reverse('visitor_pass_request'))
        
    return render(request, "main_app/visitor_request.html", {'page_title': 'Request Campus Pass'})

@login_required
def admin_visitor_passes(request):
    if request.user.user_type != '1': # HOD only
        messages.error(request, "Permission Denied")
        return redirect(reverse('login_page'))
        
    passes = VisitorPass.objects.all().order_by('-created_at')
    
    if request.method == 'POST':
        pass_id = request.POST.get('pass_id')
        action = request.POST.get('action') # Approve / Reject
        
        v_pass = get_object_or_404(VisitorPass, id=pass_id)
        if action == 'approve':
            v_pass.status = 'Approved'
            messages.success(request, f"Visitor Pass for {v_pass.name} approved.")
        else:
            v_pass.status = 'Rejected'
            messages.success(request, f"Visitor Pass for {v_pass.name} rejected.")
        v_pass.save()
        return redirect(reverse('admin_visitor_passes'))
        
    context = {
        'page_title': 'Visitor Pass Management',
        'passes': passes
    }
    return render(request, "hod_template/visitor_passes_admin.html", context)

@csrf_exempt
@login_required
def verify_visitor_pass(request):
    if request.method == 'POST' and request.user.user_type in ['1', '2']:
        try:
            data = json.loads(request.body)
            pass_code = data.get('pass_code', '').strip()
            
            v_pass = VisitorPass.objects.filter(pass_code=pass_code).first()
            if not v_pass:
                return JsonResponse({'status': 'error', 'message': 'Invalid Visitor Pass Code'})
                
            return JsonResponse({
                'status': 'success',
                'pass_status': v_pass.status,
                'name': v_pass.name,
                'purpose': v_pass.purpose,
                'host': v_pass.host_person,
                'date': str(v_pass.visit_date),
                'message': f"Visitor pass is {v_pass.status}. Visitor: {v_pass.name}. Host: {v_pass.host_person}"
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})
