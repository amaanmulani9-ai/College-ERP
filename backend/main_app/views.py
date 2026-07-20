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


def landing_page(request):
    if request.user.is_authenticated:
        return _redirect_for_user(request.user)
    return render(request, 'main_app/landing_page.html')


def login_page(request):
    if request.user.is_authenticated:
        next_url = _safe_next_url(request)
        if next_url:
            return redirect(next_url)
        return _redirect_for_user(request.user)
    
    context = {
        'next_url': _safe_next_url(request),
        'recaptcha_public_key': getattr(settings, 'RECAPTCHA_PUBLIC_KEY', None)
    }
    return render(request, 'main_app/erpnext_login.html', context)

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
def set_locale(request):
    """AJAX endpoint to update selected country and language in Django session."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            country = data.get('country', 'IN')
            lang = data.get('lang', 'en')
            
            # Store in session
            request.session['selected_country'] = country
            request.session['selected_lang'] = lang
            
            return JsonResponse({'status': 'success', 'country': country, 'lang': lang})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)


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
    if user.user_type == '1' or user.user_type == '7': # Admin or Backoffice
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
    elif user.user_type == '4': # Parent
        try:
            subjects = Subject.objects.filter(course=user.parent.student.course)
        except Exception:
            subjects = Subject.objects.none()
    else:
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


def robots_txt(request):
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin/",
        "Disallow: /staff/",
        "Disallow: /student/",
        "Disallow: /parent/",
        "",
        "Sitemap: https://college-erp-web.onrender.com/sitemap.xml"
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def sitemap_xml(request):
    content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://college-erp-web.onrender.com/</loc>
    <lastmod>2026-07-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://college-erp-web.onrender.com/student/register/</loc>
    <lastmod>2026-07-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://college-erp-web.onrender.com/login/</loc>
    <lastmod>2026-07-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>"""
    return HttpResponse(content, content_type="application/xml")


def llms_txt(request):
    content = """# CampusPro B2B SaaS College ERP System

An advanced, glassmorphic multitenant ERP solution built on modern Python and Django. Designed for speed, security, and exceptional visual beauty.

## Core Features
- **Smart ID Card Engine:** Flip animation glassmorphic digital ID cards with scanned QR verification.
- **AI Suite:** Generates exam papers, timetables, auto-grades assignments.
"""
    return HttpResponse(content, content_type="text/plain")


def free_digital_library(request):
    """Free Digital Library with Google Books, Gutendex & Open Library APIs."""
    category_filter = request.GET.get('category', 'All')
    search_query = request.GET.get('q', '').strip().lower()
    page = int(request.GET.get('page', 1))

    # ── Category → API Routing Map ──────────────────────────────────
    CATEGORY_API_MAP = {
        'Computer Science (B.Tech/BCA)': {
            'api': 'google', 'query': 'subject:computers+OR+subject:programming+OR+subject:data+structures',
            'color': 'linear-gradient(135deg, #0f5f6c, #14b8a6)', 'badge': 'GOOGLE BOOKS',
        },
        'Commerce (B.Com/BBA/MBA)': {
            'api': 'google', 'query': 'subject:business+OR+subject:economics+OR+subject:accounting',
            'color': 'linear-gradient(135deg, #f59e0b, #d97706)', 'badge': 'GOOGLE BOOKS',
        },
        'Mathematics & Physics (B.Sc)': {
            'api': 'google', 'query': 'subject:mathematics+OR+subject:physics+OR+subject:calculus',
            'color': 'linear-gradient(135deg, #6366f1, #a855f7)', 'badge': 'GOOGLE BOOKS',
        },
        'Core Engineering (EE/ECE/ME/CE)': {
            'api': 'google', 'query': 'subject:engineering+OR+subject:electrical+OR+subject:mechanical',
            'color': 'linear-gradient(135deg, #8b5cf6, #ec4899)', 'badge': 'GOOGLE BOOKS',
        },
        'Story Books & Literature': {
            'api': 'gutendex', 'query': 'topic=literature',
            'color': 'linear-gradient(135deg, #1e293b, #475569)', 'badge': 'PROJECT GUTENBERG',
        },
        'Arts, Humanities & UPSC': {
            'api': 'openlibrary', 'query': 'history',
            'color': 'linear-gradient(135deg, #4f46e5, #4338ca)', 'badge': 'OPEN LIBRARY',
        },
    }

    # ── Curated Fallback Books ──────────────────────────────────────
    curated_books = [
        {'id': 1, 'title': 'Data Structures & Algorithms (B.Tech / BCA / GATE)',
         'author': 'NPTEL & AICTE Open Curriculum', 'category': 'Computer Science (B.Tech/BCA)',
         'pages': '410 Pages', 'format': 'PDF / Reader', 'read_url': 'https://nptel.ac.in/courses/106102064',
         'download_url': 'https://nptel.ac.in/courses/106102064',
         'description': 'Arrays, Stacks, Queues, Trees, Graphs, Sorting algorithms, GATE CSE.',
         'badge': 'AICTE / NPTEL', 'color': 'linear-gradient(135deg, #0f5f6c, #14b8a6)', 'cover': ''},
        {'id': 2, 'title': 'Python Programming & Data Science Notes',
         'author': 'OpenStax & NPTEL IIT Madras', 'category': 'Computer Science (B.Tech/BCA)',
         'pages': '340 Pages', 'format': 'PDF / Reader',
         'read_url': 'https://openstax.org/details/books/introduction-python-programming',
         'download_url': 'https://open.umn.edu/opentextbooks/textbooks/python-for-everybody-exploring-data-in-python-3',
         'description': 'Python fundamentals, NumPy, Pandas, OOPs, data visualization.',
         'badge': 'FREE TEXTBOOK', 'color': 'linear-gradient(135deg, #10b981, #059669)', 'cover': ''},
        {'id': 3, 'title': 'Database Management Systems & SQL (DBMS)',
         'author': 'e-GyanKosh IGNOU & Stanford Notes', 'category': 'Computer Science (B.Tech/BCA)',
         'pages': '285 Pages', 'format': 'PDF / Reader', 'read_url': 'https://egyankosh.ac.in/',
         'download_url': 'https://open.umn.edu/opentextbooks/textbooks/relational-databases-and-microsoft-access-365-2021-edition',
         'description': 'Relational model, ER Diagrams, SQL queries, Normalization (1NF to BCNF).',
         'badge': 'IGNOU / UGC', 'color': 'linear-gradient(135deg, #3b82f6, #06b6d4)', 'cover': ''},
        {'id': 4, 'title': 'Financial Accounting & Corporate Law (B.Com / BBA)',
         'author': 'ICAI & e-GyanKosh Portal', 'category': 'Commerce (B.Com/BBA/MBA)',
         'pages': '380 Pages', 'format': 'PDF / Reader', 'read_url': 'https://egyankosh.ac.in/',
         'download_url': 'https://openstax.org/details/books/principles-financial-accounting',
         'description': 'Journal entries, Ledger posting, Trial Balance, Depreciation, Balance Sheets.',
         'badge': 'ICAI / IGNOU', 'color': 'linear-gradient(135deg, #0284c7, #0369a1)', 'cover': ''},
        {'id': 5, 'title': 'Principles of Micro & Macro Economics (B.Com / BA)',
         'author': 'OpenStax & UGC e-Pathshala', 'category': 'Commerce (B.Com/BBA/MBA)',
         'pages': '420 Pages', 'format': 'PDF / Reader', 'read_url': 'https://epathshala.nic.in/',
         'download_url': 'https://openstax.org/details/books/principles-microeconomics-3e',
         'description': 'Demand & Supply, Indian Economic System, Inflation, RBI functions.',
         'badge': 'UGC PATHSHALA', 'color': 'linear-gradient(135deg, #f59e0b, #d97706)', 'cover': ''},
        {'id': 6, 'title': 'Engineering Mathematics & Calculus (Sem 1 & 2)',
         'author': 'IIT Kharagpur NPTEL Courseware', 'category': 'Mathematics & Physics (B.Sc)',
         'pages': '512 Pages', 'format': 'PDF / Reader', 'read_url': 'https://nptel.ac.in/courses/111105121',
         'download_url': 'https://openstax.org/details/books/calculus-volume-1',
         'description': 'Differential calculus, Matrices, Eigen values, Fourier series.',
         'badge': 'IIT NPTEL', 'color': 'linear-gradient(135deg, #6366f1, #a855f7)', 'cover': ''},
        {'id': 7, 'title': 'University Physics: Mechanics & Electromagnetism',
         'author': 'NCERT & OpenStax Physics Team', 'category': 'Mathematics & Physics (B.Sc)',
         'pages': '610 Pages', 'format': 'PDF / Reader', 'read_url': 'https://epathshala.nic.in/',
         'download_url': 'https://openstax.org/details/books/university-physics-volume-1',
         'description': 'Newtonian mechanics, Quantum wave optics, Electrostatics.',
         'badge': 'NCERT / OPENSTAX', 'color': 'linear-gradient(135deg, #ef4444, #dc2626)', 'cover': ''},
        {'id': 8, 'title': 'Basic Electrical & Electronics Engineering (B.E/B.Tech)',
         'author': 'AICTE Model Curriculum Notes', 'category': 'Core Engineering (EE/ECE/ME/CE)',
         'pages': '390 Pages', 'format': 'PDF / Reader', 'read_url': 'https://nptel.ac.in/courses/108108076',
         'download_url': 'https://nptel.ac.in/courses/108108076',
         'description': 'DC/AC Circuits, Transformers, Induction Motors, Logic Gates, Op-Amps.',
         'badge': 'AICTE MODEL', 'color': 'linear-gradient(135deg, #8b5cf6, #ec4899)', 'cover': ''},
        {'id': 9, 'title': 'Thermodynamics & Fluid Mechanics Notes',
         'author': 'IIT Madras Mechanical Wing', 'category': 'Core Engineering (EE/ECE/ME/CE)',
         'pages': '440 Pages', 'format': 'PDF / Reader', 'read_url': 'https://nptel.ac.in/courses/112105123',
         'download_url': 'https://nptel.ac.in/courses/112105123',
         'description': 'Laws of Thermodynamics, Carnot Engine, Fluid Dynamics, Bernoulli.',
         'badge': 'IIT MECHANICAL', 'color': 'linear-gradient(135deg, #d97706, #b45309)', 'cover': ''},
        {'id': 10, 'title': 'Indian Constitution, Polity & World History (B.A / UPSC)',
         'author': 'NCERT & e-GyanKosh Open Archive', 'category': 'Arts, Humanities & UPSC',
         'pages': '520 Pages', 'format': 'PDF / Reader', 'read_url': 'https://epathshala.nic.in/',
         'download_url': 'https://egyankosh.ac.in/',
         'description': 'Preamble, Fundamental Rights, Parliamentary Structure, Freedom Struggle.',
         'badge': 'NCERT / UPSC', 'color': 'linear-gradient(135deg, #4f46e5, #4338ca)', 'cover': ''},
        {'id': 11, 'title': 'The Adventures of Sherlock Holmes',
         'author': 'Arthur Conan Doyle', 'category': 'Story Books & Literature',
         'pages': '307 Pages', 'format': 'EPUB / HTML',
         'read_url': 'https://www.gutenberg.org/files/1661/1661-h/1661-h.htm',
         'download_url': 'https://www.gutenberg.org/ebooks/1661.epub3.images',
         'description': 'Twelve detective stories featuring Sherlock Holmes and Dr. Watson.',
         'badge': 'CLASSIC FICTION', 'color': 'linear-gradient(135deg, #1e293b, #475569)', 'cover': ''},
        {'id': 12, 'title': 'Panchatantra Ancient Fables & Moral Stories',
         'author': 'Vishnu Sharma (Traditional Archive)', 'category': 'Story Books & Literature',
         'pages': '220 Pages', 'format': 'PDF / Reader', 'read_url': 'https://www.gutenberg.org/ebooks/4705',
         'download_url': 'https://www.gutenberg.org/ebooks/4705.epub.noimages',
         'description': 'Indian fables of wisdom, ethics, leadership, and moral principles.',
         'badge': 'INDIAN CLASSIC', 'color': 'linear-gradient(135deg, #ea580c, #c2410c)', 'cover': ''},
    ]

    all_books = list(curated_books)
    api_total_count = 0
    api_source = ''

    # ── Helper: Fetch from Google Books API ─────────────────────────
    def fetch_google_books(query_str, max_results=12):
        nonlocal api_total_count, api_source
        try:
            start_index = (page - 1) * max_results
            url = (f"https://www.googleapis.com/books/v1/volumes"
                   f"?q={query_str}&filter=free-ebooks"
                   f"&maxResults={max_results}&startIndex={start_index}")
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                data = res.json()
                api_total_count += data.get('totalItems', 0)
                api_source = 'Google Books'
                for item in data.get('items', []):
                    info = item.get('volumeInfo', {})
                    access = item.get('accessInfo', {})
                    epub_link = (access.get('epub', {}).get('downloadLink') or
                                 access.get('pdf', {}).get('downloadLink') or '')
                    read_link = info.get('previewLink') or info.get('infoLink') or ''
                    cover = info.get('imageLinks', {}).get('thumbnail', '')
                    authors = ", ".join(info.get('authors', ['Unknown Author']))
                    pg = info.get('pageCount', '')
                    desc = (info.get('description', '') or '')[:180] or 'Free ebook via Google Books.'
                    all_books.append({
                        'id': 2000 + hash(item.get('id', '')) % 100000,
                        'title': info.get('title', 'Free Ebook'),
                        'author': authors, 'cover': cover,
                        'category': category_filter if category_filter != 'All' else 'Computer Science (B.Tech/BCA)',
                        'pages': f"{pg} Pages" if pg else 'Free Ebook',
                        'format': 'PDF / EPUB', 'read_url': read_link,
                        'download_url': epub_link or read_link,
                        'description': desc, 'badge': 'GOOGLE BOOKS API',
                        'color': CATEGORY_API_MAP.get(category_filter, {}).get('color', 'linear-gradient(135deg, #0f5f6c, #14b8a6)'),
                    })
        except Exception:
            pass

    # ── Helper: Fetch from Gutendex (Project Gutenberg) ─────────────
    def fetch_gutendex(query_str, max_results=12):
        nonlocal api_total_count, api_source
        try:
            url = f"https://gutendex.com/books/?{query_str}&page={page}"
            if search_query:
                url = f"https://gutendex.com/books/?search={search_query}&page={page}"
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                data = res.json()
                api_total_count += data.get('count', 0)
                api_source = 'Project Gutenberg'
                for b in data.get('results', [])[:max_results]:
                    authors = ", ".join([a.get('name', '') for a in b.get('authors', [])]) or 'Project Gutenberg'
                    fmts = b.get('formats', {})
                    read_link = fmts.get('text/html') or fmts.get('text/plain; charset=us-ascii') or f"https://www.gutenberg.org/ebooks/{b.get('id')}"
                    download_link = fmts.get('application/epub+zip') or fmts.get('application/x-mobipocket-ebook') or read_link
                    subjects = ", ".join(b.get('subjects', [])[:2]) or 'Literature & Fiction'
                    cover = fmts.get('image/jpeg', '')
                    all_books.append({
                        'id': 3000 + b.get('id', 0), 'title': b.get('title', 'Public Domain Book'),
                        'author': authors, 'category': 'Story Books & Literature',
                        'pages': f"{b.get('download_count', 0):,} Downloads", 'format': 'EPUB / HTML',
                        'read_url': read_link, 'download_url': download_link,
                        'description': f"Free public domain work. Subjects: {subjects}.",
                        'badge': 'PROJECT GUTENBERG', 'cover': cover,
                        'color': 'linear-gradient(135deg, #1e293b, #475569)',
                    })
        except Exception:
            pass

    # ── Helper: Fetch from Open Library ─────────────────────────────
    def fetch_openlibrary(subject, max_results=12):
        nonlocal api_total_count, api_source
        try:
            offset = (page - 1) * max_results
            url = f"https://openlibrary.org/subjects/{subject}.json?limit={max_results}&offset={offset}"
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                data = res.json()
                api_total_count += data.get('work_count', 0)
                api_source = 'Open Library'
                for w in data.get('works', []):
                    authors = ", ".join([a.get('name', '') for a in w.get('authors', [])]) or 'Open Library'
                    cover_id = w.get('cover_id', '')
                    cover = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else ''
                    key = w.get('key', '')
                    read_link = f"https://openlibrary.org{key}" if key else 'https://openlibrary.org'
                    subj_list = w.get('subject', [])
                    desc = subj_list[0] if isinstance(subj_list, list) and subj_list else 'Free open-access educational resource.'
                    all_books.append({
                        'id': 4000 + hash(key) % 100000, 'title': w.get('title', 'Open Library Book'),
                        'author': authors, 'cover': cover,
                        'category': category_filter if category_filter != 'All' else 'Arts, Humanities & UPSC',
                        'pages': f"{w.get('edition_count', 1)} Editions", 'format': 'Read Online',
                        'read_url': read_link, 'download_url': read_link,
                        'description': desc, 'badge': 'OPEN LIBRARY',
                        'color': CATEGORY_API_MAP.get(category_filter, {}).get('color', 'linear-gradient(135deg, #4f46e5, #4338ca)'),
                    })
        except Exception:
            pass

    # ── Route category to the correct API ───────────────────────────
    if search_query:
        before_count = len(all_books)
        fetch_google_books(search_query, max_results=8)
        if len(all_books) == before_count:
            fetch_openlibrary(search_query.replace(' ', '_'), max_results=12)
        else:
            fetch_openlibrary(search_query.replace(' ', '_'), max_results=6)
        fetch_gutendex(f"search={search_query}", max_results=6)
    elif category_filter and category_filter != 'All':
        cfg = CATEGORY_API_MAP.get(category_filter, {})
        if cfg.get('api') == 'google':
            before_count = len(all_books)
            fetch_google_books(cfg['query'], max_results=12)
            if len(all_books) == before_count:
                ol_subjects = {
                    'Computer Science (B.Tech/BCA)': 'computer_science',
                    'Commerce (B.Com/BBA/MBA)': 'finance',
                    'Mathematics & Physics (B.Sc)': 'mathematics',
                    'Core Engineering (EE/ECE/ME/CE)': 'engineering'
                }
                subj = ol_subjects.get(category_filter, 'education')
                fetch_openlibrary(subj, max_results=12)
        elif cfg.get('api') == 'gutendex':
            fetch_gutendex(cfg['query'], max_results=12)
        elif cfg.get('api') == 'openlibrary':
            fetch_openlibrary(cfg['query'], max_results=12)
    else:
        before_count = len(all_books)
        fetch_google_books('subject:computer+science', max_results=4)
        if len(all_books) == before_count:
            fetch_openlibrary('computer_science', max_results=4)
            
        fetch_gutendex('topic=literature', max_results=4)
        fetch_openlibrary('science', max_results=4)

    # ── Filter by Category ─────────────────────────────────────────
    if category_filter and category_filter != 'All':
        all_books = [b for b in all_books if b['category'].lower() == category_filter.lower()]

    # ── Filter by Search Query ─────────────────────────────────────
    if search_query:
        all_books = [b for b in all_books if
                     search_query in b['title'].lower() or
                     search_query in b['category'].lower() or
                     search_query in b['author'].lower() or
                     search_query in b['description'].lower()]

    # ── Deduplicate by title ───────────────────────────────────────
    seen = set()
    unique = []
    for b in all_books:
        k = b['title'].lower().strip()
        if k not in seen:
            seen.add(k)
            unique.append(b)
    all_books = unique

    categories = [
        'All',
        'Story Books & Literature',
        'Computer Science (B.Tech/BCA)',
        'Commerce (B.Com/BBA/MBA)',
        'Mathematics & Physics (B.Sc)',
        'Core Engineering (EE/ECE/ME/CE)',
        'Arts, Humanities & UPSC'
    ]

    total_books_display = f"{api_total_count:,} Free Books" if api_total_count > 0 else f"{len(all_books)} Available"

    context = {
        'page_title': 'Indian Educational Digital Library & Open Course Notes',
        'books': all_books,
        'categories': categories,
        'selected_category': category_filter,
        'search_query': search_query,
        'total_books_count': total_books_display,
        'showing_count': len(all_books),
        'api_source': api_source,
        'current_page': page,
        'has_next': api_total_count > page * 12,
        'has_prev': page > 1,
    }
    return render(request, 'main_app/free_digital_library.html', context)

