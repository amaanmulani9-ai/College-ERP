import json
import requests
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.core.cache import cache
from django.db import connection
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.http import url_has_allowed_host_and_scheme


from .models import Attendance, Session, Subject, NotificationStudent, NotificationStaff
from django.contrib.auth.decorators import login_required
from .analytics_helper import log_analytics_event

# Create your views here.

LOGIN_REDIRECT_ROUTES = {
    "1": "admin_home",
    "2": "staff_home",
    "3": "student_home",
    "4": "parent_home",
    "5": "alumni_portal",
    "6": "company_hr_dashboard",
    "7": "backoffice_home",
    "8": "super_admin_dashboard",
}


def _safe_next_url(request):
    next_url = (request.POST.get("next") or request.GET.get("next") or "").strip()
    if not next_url:
        return ""
    if url_has_allowed_host_and_scheme(
        next_url,
        allowed_hosts={request.get_host()},
        require_https=request.is_secure(),
    ):
        return next_url
    return ""


def _redirect_for_user(user):
    route_name = LOGIN_REDIRECT_ROUTES.get(str(getattr(user, "user_type", "")))
    if route_name:
        return redirect(reverse(route_name))
    return redirect(reverse("login_page"))


def login_page(request):
    if request.user.is_authenticated:
        next_url = _safe_next_url(request)
        if next_url:
            return redirect(next_url)
        return _redirect_for_user(request.user)
    return render(request, 'main_app/erpnext_login.html', {'next_url': _safe_next_url(request)})

def offline(request):
    return render(request, 'main_app/offline.html')


def health_check(request):
    checks = {
        'database': False,
        'cache': False,
    }

    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            cursor.fetchone()
        checks['database'] = True
    except Exception:
        pass

    try:
        cache_key = 'health_check'
        cache.set(cache_key, 'ok', timeout=10)
        checks['cache'] = cache.get(cache_key) == 'ok'
    except Exception:
        pass

    status_code = 200 if all(checks.values()) else 503
    return JsonResponse({'status': 'ok' if status_code == 200 else 'degraded', 'checks': checks}, status=status_code)

import csv
import os
import uuid
import datetime
from django.conf import settings
from django.contrib import messages
from .models import Course, Session

def online_registration(request):
    courses = Course.objects.all()
    sessions = Session.objects.all()
    
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        gender = request.POST.get('gender')
        email = request.POST.get('email')
        password = request.POST.get('password')
        course_id = request.POST.get('course_id')
        session_id = request.POST.get('session_id')
        
        # Registration date
        admission_date = datetime.date.today().strftime('%Y-%m-%d')
        
        # Generate unique code
        unique_code = f"REG-{uuid.uuid4().hex[:8].upper()}"
        
        # Save to CSV
        regs_dir = os.path.join(settings.MEDIA_ROOT, 'student_registrations')
        if not os.path.exists(regs_dir):
            os.makedirs(regs_dir)
            
        csv_filename = os.path.join(regs_dir, f"{admission_date}.csv")
        file_exists = os.path.isfile(csv_filename)
        
        try:
            with open(csv_filename, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                if not file_exists:
                    writer.writerow(['First Name', 'Last Name', 'Gender', 'Course ID', 'Session ID', 'Admission Date', 'Email', 'Password', 'Unique Code', 'Registration Fee', 'Registration Time'])
                
                registration_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                from django.contrib.auth.hashers import make_password
                hashed_password = make_password(password)
                writer.writerow([first_name, last_name, gender, course_id, session_id, admission_date, email, hashed_password, unique_code, '0', registration_time])
                
            messages.success(request, f"Registration Successful! Your unique registration code is: {unique_code}")
        except Exception as e:
            messages.error(request, f"Error saving registration: {str(e)}")
            
        return redirect('online_registration')
        
    return render(request, 'main_app/online_registration.html', {'courses': courses, 'sessions': sessions})


def doLogin(request, **kwargs):
    if request.method != 'POST':
        return HttpResponseNotAllowed(["POST"])

    from django.conf import settings
    import logging

    logger = logging.getLogger(__name__)

    captcha_token = request.POST.get('g-recaptcha-response')
    captcha_url = "https://www.google.com/recaptcha/api/siteverify"
    captcha_key = getattr(settings, 'RECAPTCHA_PRIVATE_KEY', None)

    if captcha_key:
        data = {
            'secret': captcha_key,
            'response': captcha_token
        }
        try:
            captcha_server = requests.post(url=captcha_url, data=data, timeout=10)
            result = captcha_server.json()
            if not result.get("success", False):
                messages.error(request, "Verification failed. Please try again.")
                return redirect(reverse('login_page'))
        except Exception as e:
            logger.exception("ReCAPTCHA validation error: %s", e)
            messages.error(request, "Verification service is unavailable right now.")
            return redirect(reverse('login_page'))

    try:
        email = (request.POST.get('email', '') or '').strip().lower()
        password = request.POST.get('password', '')

        if not email or not password:
            messages.error(request, "Please enter your email and password.")
            return redirect(reverse('login_page'))

        user = authenticate(request, username=email, password=password)
        if user is None:
            messages.error(request, "Invalid email or password.")
            return redirect(reverse('login_page'))

        if not getattr(user, "is_active", True):
            messages.error(request, "This account is disabled. Please contact the administrator.")
            return redirect(reverse('login_page'))

        login(request, user)

        remember_me = request.POST.get('remember') in {'1', 'true', 'True', 'on'}
        request.session.set_expiry(30 * 24 * 60 * 60 if remember_me else 0)
        request.session["login_role"] = str(getattr(user, "user_type", ""))

        try:
            log_analytics_event("user_login", {
                "user_id": user.id,
                "email": user.email,
                "user_type": user.user_type,
                "remember_me": remember_me,
            })
        except Exception as analytics_error:
            logger.warning("Login analytics failed: %s", analytics_error)

        next_url = _safe_next_url(request)
        if next_url:
            return redirect(next_url)
        return _redirect_for_user(user)
    except Exception as e:
        logger.exception("Login error: %s", e)
        messages.error(request, "We could not sign you in right now. Please try again.")
        return redirect(reverse('login_page'))



def logout_user(request):
    if request.user.is_authenticated:
        # Log logout to MongoDB Analytics
        log_analytics_event("user_logout", {
            "user_id": request.user.id,
            "email": request.user.email,
            "user_type": request.user.user_type
        })
        logout(request)
    return redirect("/")


@csrf_exempt
def get_attendance(request):
    subject_id = request.POST.get('subject')
    session_id = request.POST.get('session')
    try:
        subject = get_object_or_404(Subject, id=subject_id)
        session = get_object_or_404(Session, id=session_id)
        attendance = Attendance.objects.filter(subject=subject, session=session)
        attendance_list = []
        for attd in attendance:
            data = {
                    "id": attd.id,
                    "attendance_date": str(attd.date),
                    "session": attd.session_id
                    }
            attendance_list.append(data)
        return JsonResponse(json.dumps(attendance_list), safe=False)
    except Exception as e:
        return JsonResponse(json.dumps([]), safe=False)


def showFirebaseJS(request):
    from django.conf import settings as dj_settings
    fb_api_key = os.environ.get('FIREBASE_API_KEY', getattr(dj_settings, 'FIREBASE_API_KEY', ''))
    fb_auth_domain = os.environ.get('FIREBASE_AUTH_DOMAIN', getattr(dj_settings, 'FIREBASE_AUTH_DOMAIN', ''))
    fb_database_url = os.environ.get('FIREBASE_DATABASE_URL', getattr(dj_settings, 'FIREBASE_DATABASE_URL', ''))
    fb_project_id = os.environ.get('FIREBASE_PROJECT_ID', getattr(dj_settings, 'FIREBASE_PROJECT_ID', ''))
    fb_storage_bucket = os.environ.get('FIREBASE_STORAGE_BUCKET', getattr(dj_settings, 'FIREBASE_STORAGE_BUCKET', ''))
    fb_messaging_sender_id = os.environ.get('FIREBASE_MESSAGING_SENDER_ID', getattr(dj_settings, 'FIREBASE_MESSAGING_SENDER_ID', ''))
    fb_app_id = os.environ.get('FIREBASE_APP_ID', getattr(dj_settings, 'FIREBASE_APP_ID', ''))
    fb_measurement_id = os.environ.get('FIREBASE_MEASUREMENT_ID', getattr(dj_settings, 'FIREBASE_MEASUREMENT_ID', ''))
    data = f"""
    // Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js');

firebase.initializeApp({{
    apiKey: "{fb_api_key}",
    authDomain: "{fb_auth_domain}",
    databaseURL: "{fb_database_url}",
    projectId: "{fb_project_id}",
    storageBucket: "{fb_storage_bucket}",
    messagingSenderId: "{fb_messaging_sender_id}",
    appId: "{fb_app_id}",
    measurementId: "{fb_measurement_id}"
}});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {{
    const notification = JSON.parse(payload);
    const notificationOption = {{
        body: notification.body,
        icon: notification.icon
    }}
    return self.registration.showNotification(payload.notification.title, notificationOption);
}});
    """
    return HttpResponse(data, content_type='application/javascript')


from django.contrib.auth.decorators import login_required
from .models import Subject, DiscussionMessage

@login_required
def discussion_board(request):
    user = request.user
    subjects = []
    active_subject = None
    
    # Fetch subjects based on user type
    if user.user_type == '1': # Admin
        subjects = Subject.objects.all()
    elif user.user_type == '2': # Staff
        try:
            subjects = Subject.objects.filter(staff__admin=user)
        except Exception:
            subjects = Subject.objects.none()
    elif user.user_type == '3': # Student
        try:
            subjects = Subject.objects.filter(course=user.student.course)
        except Exception:
            subjects = Subject.objects.none()
        
    # Get active subject
    active_subject_id = request.GET.get('subject_id')
    if active_subject_id:
        try:
            active_subject = Subject.objects.get(id=active_subject_id)
        except Subject.DoesNotExist:
            pass
            
    if not active_subject and subjects.exists():
        active_subject = subjects.first()
        
    # Handle message posting
    if request.method == 'POST' and active_subject:
        message_text = request.POST.get('message', '').strip()
        if message_text:
            msg = DiscussionMessage(
                user=user,
                subject=active_subject,
                message=message_text
            )
            msg.save()
            messages.success(request, "Message posted to discussion board!")
            return redirect(f"{reverse('discussion_board')}?subject_id={active_subject.id}")
            
    # Fetch messages for the active subject
    messages_list = []
    if active_subject:
        messages_list = DiscussionMessage.objects.filter(subject=active_subject).select_related('user').order_by('created_at')
        
    context = {
        'subjects': subjects,
        'active_subject': active_subject,
        'discussion_messages': messages_list,
        'page_title': "Classroom Discussion Board"
    }
    return render(request, "main_app/discussion_board.html", context)


# --- Notification Bell API ---

@login_required
def get_notifications_json(request):
    """Returns unread notification count and latest 5 notifications as JSON for the bell dropdown."""
    user = request.user
    notifs = []
    unread_count = 0

    if user.user_type == '3':  # Student
        try:
            student = user.student
            qs = NotificationStudent.objects.filter(student=student).order_by('-created_at')[:5]
            unread_count = NotificationStudent.objects.filter(student=student, is_read=False).count()
            for n in qs:
                notifs.append({
                    'id': n.id,
                    'message': n.message,
                    'is_read': n.is_read,
                    'created_at': n.created_at.strftime('%b %d, %Y %H:%M'),
                })
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Error fetching unread messages for student: {e}")
    elif user.user_type == '2':  # Staff
        try:
            staff = user.staff
            qs = NotificationStaff.objects.filter(staff=staff).order_by('-created_at')[:5]
            unread_count = NotificationStaff.objects.filter(staff=staff, is_read=False).count()
            for n in qs:
                notifs.append({
                    'id': n.id,
                    'message': n.message,
                    'is_read': n.is_read,
                    'created_at': n.created_at.strftime('%b %d, %Y %H:%M'),
                })
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Error fetching unread messages for staff: {e}")
    return JsonResponse({'unread_count': unread_count, 'notifications': notifs})


@login_required
@csrf_exempt
def mark_notifications_read(request):
    """Marks all notifications as read for the logged-in user."""
    user = request.user
    if user.user_type == '3':
        try:
            NotificationStudent.objects.filter(student=user.student, is_read=False).update(is_read=True)
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Error updating notifications for student: {e}")
    elif user.user_type == '2':
        try:
            NotificationStaff.objects.filter(staff=user.staff, is_read=False).update(is_read=True)
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Error updating notifications for staff: {e}")
    return JsonResponse({'status': 'ok'})
