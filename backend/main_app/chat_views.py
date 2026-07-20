import json
from datetime import date
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.utils import timezone
from .models import CustomUser, Student, Staff, Parent, Course, Session, Timetable, LiveClass, FeeRecord, ChatMessage, NotificationStudent, NotificationStaff
from .communication_helper import send_email_brevo, send_sms_twilio, send_fcm_push, build_whatsapp_link, normalize_whatsapp_number

@login_required
def chat_home(request):
    current_user = request.user
    
    # Get direct chat contacts
    users = CustomUser.objects.exclude(id=current_user.id).order_by('first_name', 'last_name')
    
    # Get available group channels based on courses
    if current_user.user_type == '3': # Student
        student = getattr(current_user, 'student', None)
        courses = Course.objects.filter(id=student.course.id) if student and student.course else Course.objects.none()
    elif current_user.user_type == '2': # Staff
        staff = getattr(current_user, 'staff', None)
        courses = Course.objects.filter(id=staff.course.id) if staff and staff.course else Course.objects.all()
    else:
        courses = Course.objects.all()
        
    context = {
        'page_title': 'ERP Messenger',
        'users': users,
        'courses': courses,
    }
    return render(request, "main_app/chat_home.html", context)

@csrf_exempt
@login_required
def send_chat_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message_text = data.get('message', '').strip()
            recipient_id = data.get('recipient_id')
            course_id = data.get('course_id')
            
            if not message_text:
                return JsonResponse({'status': 'error', 'message': 'Empty message'})
                
            sender = request.user
            recipient = None
            course = None
            
            if recipient_id:
                recipient = get_object_or_404(CustomUser, id=recipient_id)
            elif course_id:
                course = get_object_or_404(Course, id=course_id)
                
            msg = ChatMessage.objects.create(
                sender=sender,
                recipient=recipient,
                course=course,
                message=message_text
            )
            
            # Send real-time Push notification if recipient has FCM Token
            if recipient and recipient.fcm_token:
                send_fcm_push(recipient.fcm_token, f"New Message from {sender}", message_text[:50])
                
            return JsonResponse({
                'status': 'success',
                'id': msg.id,
                'sender': str(msg.sender),
                'sender_id': msg.sender.id,
                'message': msg.message,
                'created_at': msg.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
def get_chat_messages(request):
    recipient_id = request.GET.get('recipient_id')
    course_id = request.GET.get('course_id')
    last_msg_id = request.GET.get('last_msg_id', 0)
    
    try:
        last_msg_id = int(last_msg_id)
    except ValueError:
        last_msg_id = 0
        
    messages_qs = ChatMessage.objects.none()
    current_user = request.user
    
    if recipient_id:
        # Direct Messages
        recipient = get_object_or_404(CustomUser, id=recipient_id)
        messages_qs = ChatMessage.objects.filter(
            Q(sender=current_user, recipient=recipient) |
            Q(sender=recipient, recipient=current_user)
        ).filter(id__gt=last_msg_id).order_by('id')
    elif course_id:
        # Group Messages
        course = get_object_or_404(Course, id=course_id)
        messages_qs = ChatMessage.objects.filter(course=course).filter(id__gt=last_msg_id).order_by('id')
        
    msg_list = []
    for msg in messages_qs:
        msg_list.append({
            'id': msg.id,
            'sender': str(msg.sender),
            'sender_id': msg.sender.id,
            'message': msg.message,
            'created_at': msg.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    return JsonResponse({'status': 'success', 'messages': msg_list})

@login_required
def announcements_board(request):
    if request.user.user_type not in ['1', '2']: # HOD or Staff only
        messages.error(request, "Permission Denied.")
        return redirect(reverse('login_page'))
        
    context = {
        'page_title': 'Announcements Control Room',
        'courses': Course.objects.all(),
    }
    return render(request, "hod_template/announcements.html", context)


def _first_phone(*values):
    for value in values:
        phone = normalize_whatsapp_number(value)
        if phone:
            return phone
    return ""


def _student_phone(student):
    parent_phone = ""
    parent = Parent.objects.filter(student=student, mobile_number__isnull=False).exclude(mobile_number="").first()
    if parent:
        parent_phone = parent.mobile_number
    return _first_phone(student.mobile, parent_phone)


def _staff_phone(staff):
    return _first_phone(staff.mobile_number)


def _student_message(student, template_key, body, links):
    course_name = student.course.name if student.course else "your course"
    if template_key == "live_class":
        return f"{body}\n\nCourse: {course_name}\nLive classes: {links['live_classes']}"
    if template_key == "timetable":
        return f"{body}\n\nCourse: {course_name}\nTimetable: {links['timetable']}"
    if template_key == "report_link":
        return f"{body}\n\nCourse: {course_name}\nReport card: {links['report_card']}"
    if template_key == "payment_link":
        return f"{body}\n\nCourse: {course_name}\nFee payment: {links['payment']}"
    return body


def _staff_message(staff, template_key, body, links):
    course_name = staff.course.name if staff.course else "your department"
    if template_key == "timetable":
        return f"{body}\n\nCourse: {course_name}\nTimetable: {links['staff_timetable']}"
    if template_key == "live_class":
        return f"{body}\n\nCourse: {course_name}\nLive classes: {links['live_classes']}"
    return body


@login_required
def whatsapp_center(request):
    current_user = request.user
    user_type = str(getattr(current_user, 'user_type', ''))
    can_target_students = user_type in ['1', '2']
    can_target_staff = user_type in ['1', '2']
    can_target_self_course = user_type in ['2', '3']

    courses = Course.objects.all().order_by('name')
    sessions = Session.objects.all().order_by('-start_year')
    live_classes = LiveClass.objects.select_related('subject', 'subject__course').order_by('-scheduled_at')[:50]
    pending_fees = FeeRecord.objects.filter(status__in=['Unpaid', 'Partial']).select_related('student__admin', 'student__course').order_by('due_date')[:80]

    generated_links = []
    audience = request.POST.get('audience', request.GET.get('audience', ''))
    template_key = request.POST.get('template_key', request.GET.get('template', 'custom'))
    message_body = (request.POST.get('message') or '').strip()
    course_id = request.POST.get('course', request.GET.get('course'))
    session_id = request.POST.get('session', request.GET.get('session'))
    batch_year = request.POST.get('batch_year', request.GET.get('batch_year'))
    semester = request.POST.get('semester', request.GET.get('semester'))
    live_class_id = request.POST.get('live_class', request.GET.get('live_class'))
    specific_numbers = request.POST.get('specific_numbers', request.GET.get('specific_numbers', ''))

    selected_course = Course.objects.filter(id=course_id).first() if course_id else None
    selected_session = Session.objects.filter(id=session_id).first() if session_id else None
    selected_live_class = LiveClass.objects.select_related('subject', 'subject__course', 'staff', 'staff__admin').filter(id=live_class_id).first() if live_class_id else None
    now = timezone.now()

    if request.method == 'GET' and not message_body:
        default_messages = {
            'live_class': 'Please join the live class on time and keep your camera/mic ready.',
            'timetable': 'Your updated timetable is now available in the portal.',
            'report_link': 'Your report card is ready. Please review it from the portal.',
            'payment_link': 'Your payment link is ready. Please clear dues before the deadline.',
            'event_notice': 'Please read this important notice carefully.',
        }
        message_body = default_messages.get(template_key, '')

    if request.method == 'POST':
        if template_key == 'live_class' and selected_live_class:
            course_name = selected_live_class.subject.course.name if selected_live_class.subject and selected_live_class.subject.course else "your course"
            message_body = message_body or (
                f"Live class alert for {course_name}: {selected_live_class.title} starts at "
                f"{selected_live_class.scheduled_at.strftime('%d %b %Y, %I:%M %p')}."
            )
        elif template_key == 'timetable':
            message_body = message_body or "Your updated timetable is ready."
        elif template_key == 'report_link':
            message_body = message_body or "Your report card is ready. Please open the link below."
        elif template_key == 'payment_link':
            message_body = message_body or "Your fee statement is ready. Please check the link below."
        elif template_key == 'event_notice':
            message_body = message_body or "Please check this important notice from the college."

        student_qs = Student.objects.select_related('admin', 'course', 'session').all()
        staff_qs = Staff.objects.select_related('admin', 'course').all()
        parent_qs = Parent.objects.select_related('admin', 'student', 'student__course').all()

        if audience == 'all_students' and can_target_students:
            recipients = student_qs
        elif audience == 'course_students' and can_target_students and selected_course:
            recipients = student_qs.filter(course=selected_course)
        elif audience == 'batch_students' and can_target_students and batch_year:
            recipients = student_qs.filter(batch_year=batch_year)
        elif audience == 'semester_students' and can_target_students and semester:
            recipients = student_qs.filter(current_semester=semester)
        elif audience == 'previous_year_students' and can_target_students:
            recipients = student_qs.filter(batch_year__lt=now.year)
        elif audience == 'live_class_students' and can_target_students and selected_live_class:
            recipients = student_qs.filter(course=selected_live_class.subject.course)
        elif audience == 'all_staff' and can_target_staff:
            recipients = staff_qs
        elif audience == 'course_staff' and can_target_self_course and selected_course:
            recipients = staff_qs.filter(course=selected_course)
        elif audience == 'parents' and can_target_students:
            recipients = parent_qs
        elif audience == 'specific_numbers':
            recipients = []
        else:
            recipients = []

        recipient_count = 0
        if audience == 'specific_numbers':
            numbers = [item.strip() for item in specific_numbers.replace('\n', ',').split(',') if item.strip()]
            for number in numbers:
                link = build_whatsapp_link(number, message_body)
                if link:
                    generated_links.append({
                        'name': number,
                        'role': 'Custom',
                        'phone': normalize_whatsapp_number(number),
                        'message': message_body,
                        'link': link,
                    })
            recipient_count = len(generated_links)
        else:
            for recipient in recipients:
                if isinstance(recipient, Student):
                    phone = _student_phone(recipient)
                    portal_links = {
                        'live_classes': request.build_absolute_uri(reverse('student_live_classes')),
                        'timetable': request.build_absolute_uri(reverse('student_timetable')),
                        'report_card': request.build_absolute_uri(reverse('student_report_card')),
                        'payment': request.build_absolute_uri(reverse('student_payable_fees')),
                        'staff_timetable': request.build_absolute_uri(reverse('staff_view_timetable')),
                    }
                    text = _student_message(recipient, template_key, message_body, portal_links)
                    name = recipient.admin.get_full_name() or recipient.admin.email
                    role = 'Student'
                elif isinstance(recipient, Staff):
                    phone = _staff_phone(recipient)
                    portal_links = {
                        'live_classes': request.build_absolute_uri(reverse('student_live_classes')),
                        'timetable': request.build_absolute_uri(reverse('staff_view_timetable')),
                        'report_card': request.build_absolute_uri(reverse('admin_home')),
                        'payment': request.build_absolute_uri(reverse('admin_finance_dashboard')),
                        'staff_timetable': request.build_absolute_uri(reverse('staff_view_timetable')),
                    }
                    text = _staff_message(recipient, template_key, message_body, portal_links)
                    name = recipient.admin.get_full_name() or recipient.admin.email
                    role = 'Staff'
                else:
                    phone = _first_phone(recipient.mobile_number)
                    text = message_body
                    name = recipient.admin.get_full_name() or recipient.admin.email
                    role = 'Parent'

                if not phone:
                    continue
                generated_links.append({
                    'name': name,
                    'role': role,
                    'phone': phone,
                    'message': text,
                    'link': build_whatsapp_link(phone, text),
                })
            recipient_count = len(generated_links)

        if recipient_count:
            messages.success(request, f"Prepared {recipient_count} WhatsApp chat link(s). Open each chat to send the message.")
        else:
            messages.warning(request, "No WhatsApp-ready recipients were found. Check numbers, course, batch, and audience filters.")

    context = {
        'page_title': 'WhatsApp Command Center',
        'courses': courses,
        'sessions': sessions,
        'live_classes': live_classes,
        'pending_fees': pending_fees,
        'generated_links': generated_links,
        'selected_course': selected_course,
        'selected_session': selected_session,
        'selected_live_class': selected_live_class,
        'template_key': template_key,
        'audience': audience,
        'message_body': message_body,
        'can_target_students': can_target_students,
        'can_target_staff': can_target_staff,
        'can_target_self_course': can_target_self_course,
        'student_count': Student.objects.exclude(mobile__isnull=True).exclude(mobile__exact='').count(),
        'staff_count': Staff.objects.exclude(mobile_number__isnull=True).exclude(mobile_number__exact='').count(),
        'parent_count': Parent.objects.exclude(mobile_number__isnull=True).exclude(mobile_number__exact='').count(),
        'today': now,
    }
    return render(request, "hod_template/whatsapp_center.html", context)

@login_required
def post_announcement(request):
    if request.method == 'POST' and request.user.user_type in ['1', '2']:
        title = request.POST.get('title')
        content = request.POST.get('content')
        course_id = request.POST.get('course')
        
        send_email = request.POST.get('send_email') == 'on'
        send_sms = request.POST.get('send_sms') == 'on'
        send_push = request.POST.get('send_push') == 'on'
        
        target_students = Student.objects.all()
        target_staff = Staff.objects.all()
        
        if course_id:
            course = get_object_or_404(Course, id=course_id)
            target_students = target_students.filter(course=course)
            target_staff = target_staff.filter(course=course)
            
        # Create Notice Board Records
        for student in target_students:
            NotificationStudent.objects.create(student=student, message=f"ANNOUNCEMENT: {title} - {content}")
        for staff in target_staff:
            NotificationStaff.objects.create(staff=staff, message=f"ANNOUNCEMENT: {title} - {content}")
            
        # Send Multichannel Notifications
        for student in target_students:
            user = student.admin
            # 1. Email
            if send_email and user.email:
                html_body = f"<h2>{title}</h2><p>{content}</p><br><small>College ERP Announcement</small>"
                send_email_brevo(user.email, f"[ERP] {title}", html_body)
            # 2. SMS
            if send_sms:
                # Assuming student phone is mapped, or using reg phone
                phone = getattr(user, 'student_phone', None) or '1234567890'
                send_sms_twilio(phone, f"Announcement: {title} - {content}")
            # 3. Push
            if send_push and user.fcm_token:
                send_fcm_push(user.fcm_token, title, content)
                
        messages.success(request, "Announcement published and notification campaign dispatched successfully!")
        return redirect(reverse('announcements_board'))
        
    messages.error(request, "Invalid Action.")
    return redirect(reverse('announcements_board'))
