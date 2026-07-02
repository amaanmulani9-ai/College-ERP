import json
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import CustomUser, Student, Staff, Course, ChatMessage, NotificationStudent, NotificationStaff
from .communication_helper import send_email_brevo, send_sms_twilio, send_fcm_push

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
