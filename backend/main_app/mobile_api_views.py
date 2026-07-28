import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from main_app.models import CustomUser, Student, Staff, AttendanceReport, Timetable, StudentResult

@csrf_exempt
def mobile_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            fcm_token = data.get('fcm_token', '')
            
            user = authenticate(username=email, password=password)
            if user is not None:
                if fcm_token:
                    user.fcm_token = fcm_token
                    user.save()
                    
                user_data = {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': user.user_type,
                    'profile_pic': str(user.profile_pic) if user.profile_pic else ''
                }
                return JsonResponse({'status': 'success', 'user': user_data})
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def get_user_timetable(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            user = CustomUser.objects.get(id=user_id)
            
            timetable_data = []
            if user.user_type == '3': # Student
                student = Student.objects.get(admin=user)
                tt_entries = Timetable.objects.filter(course=student.course)
                for tt in tt_entries:
                    timetable_data.append({
                        'day': tt.get_day_of_week_display(),
                        'subject': tt.subject.name,
                        'start_time': tt.start_time.strftime('%H:%M'),
                        'end_time': tt.end_time.strftime('%H:%M'),
                        'classroom': tt.classroom
                    })
            elif user.user_type == '2': # Staff
                staff = Staff.objects.get(admin=user)
                tt_entries = Timetable.objects.filter(subject__staff=staff)
                for tt in tt_entries:
                    timetable_data.append({
                        'day': tt.get_day_of_week_display(),
                        'subject': tt.subject.name,
                        'course': tt.course.name,
                        'start_time': tt.start_time.strftime('%H:%M'),
                        'end_time': tt.end_time.strftime('%H:%M'),
                        'classroom': tt.classroom
                    })
                    
            return JsonResponse({'status': 'success', 'data': timetable_data})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def get_user_attendance(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            user = CustomUser.objects.get(id=user_id)
            
            attendance_data = []
            if user.user_type == '3':
                student = Student.objects.get(admin=user)
                reports = AttendanceReport.objects.filter(student=student).order_by('-attendance__date')[:30]
                for rep in reports:
                    attendance_data.append({
                        'date': rep.attendance.date.strftime('%Y-%m-%d'),
                        'subject': rep.attendance.subject.name,
                        'status': 'Present' if rep.status else 'Absent'
                    })
            return JsonResponse({'status': 'success', 'data': attendance_data})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def process_qr_scan(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id') # Scanning staff
            qr_data = data.get('qr_data') # Expected json string
            
            qr_payload = json.loads(qr_data)
            action = qr_payload.get('action')
            target_id = qr_payload.get('target_id')
            
            # Simplified mock action processing for demonstration
            if action == 'mark_attendance':
                return JsonResponse({'status': 'success', 'message': f'Attendance marked for student {target_id}'})
            elif action == 'library_issue':
                return JsonResponse({'status': 'success', 'message': f'Book issued to student {target_id}'})
            elif action == 'visitor_entry':
                return JsonResponse({'status': 'success', 'message': f'Visitor pass verified for ID {target_id}'})
                
            return JsonResponse({'status': 'error', 'message': 'Unknown action'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def api_biometric_punch(request):
    """
    Hardware Biometric / RFID IoT Device API Endpoint.
    Receives attendance punches from physical devices (ZKTEco, Hikvision, RFID gate scanners).
    Payload: {"id_card_code": "ID-12345", "status": true, "subject_id": 1, "date": "2026-07-28"}
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id_card_code = data.get('id_card_code', '').strip()
            status_val = data.get('status', True)
            subject_id = data.get('subject_id')
            punch_date_str = data.get('date')
            
            from datetime import date as dt_date, datetime as dt_datetime
            punch_date = dt_datetime.strptime(punch_date_str, '%Y-%m-%d').date() if punch_date_str else dt_date.today()
            
            # Lookup student
            student = None
            if id_card_code:
                student = Student.objects.filter(id_card_code=id_card_code).first()
                if not student:
                    student = Student.objects.filter(unique_student_code=id_card_code).first()
                if not student:
                    student = Student.objects.filter(admin__email__iexact=id_card_code).first()
                    
            if not student:
                return JsonResponse({'status': 'error', 'message': f'Student with ID/Code "{id_card_code}" not found'}, status=404)
                
            from main_app.models import Attendance, Subject, Session, NotificationStudent
            subject = None
            if subject_id:
                subject = Subject.objects.filter(id=subject_id).first()
            if not subject:
                subject = Subject.objects.filter(course=student.course).first()
                
            if not subject:
                return JsonResponse({'status': 'error', 'message': 'No course subject mapped for attendance'}, status=400)
                
            session = student.session or Session.objects.first()
            if not session:
                return JsonResponse({'status': 'error', 'message': 'Academic session configuration missing'}, status=400)
                
            attendance_obj, _ = Attendance.objects.get_or_create(
                session=session,
                subject=subject,
                date=punch_date
            )
            
            report_obj, created = AttendanceReport.objects.get_or_create(
                student=student,
                attendance=attendance_obj,
                defaults={'status': bool(status_val)}
            )
            if not created:
                report_obj.status = bool(status_val)
                report_obj.save()
                
            # Evaluate low attendance threshold & auto-generate warning
            total_records = AttendanceReport.objects.filter(student=student).count()
            present_records = AttendanceReport.objects.filter(student=student, status=True).count()
            current_pct = round((present_records / total_records) * 100, 1) if total_records > 0 else 100.0
            
            condonation_warning_sent = False
            if current_pct < 75.0 and total_records >= 5:
                warning_msg = f"⚠️ AUTOMATED CONDONATION WARNING: Your attendance in {subject.name} is currently {current_pct}%, which is below the mandatory 75% rule."
                if not NotificationStudent.objects.filter(student=student, message__icontains="CONDONATION WARNING").exists():
                    NotificationStudent.objects.create(student=student, message=warning_msg)
                    condonation_warning_sent = True
                    
            trigger_realtime_event('biometric_punch', {
                'student': f"{student.admin.first_name} {student.admin.last_name}",
                'student_code': student.unique_student_code,
                'attendance_pct': current_pct,
                'status': 'Present' if status_val else 'Absent'
            })
            return JsonResponse({
                'status': 'success',
                'student': f"{student.admin.first_name} {student.admin.last_name}",
                'student_code': student.unique_student_code,
                'attendance_pct': current_pct,
                'condonation_warning_issued': condonation_warning_sent,
                'message': 'Biometric punch logged successfully'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


# --- REALTIME SYNC ENGINE ---
from django.core.cache import cache
import time
from django.http import StreamingHttpResponse

def trigger_realtime_event(event_type, payload):
    """Publish a realtime event to the global event cache stream."""
    import datetime
    event_data = {
        'type': event_type,
        'payload': payload,
        'timestamp': datetime.datetime.now().strftime('%H:%M:%S')
    }
    cache.set('latest_realtime_event', event_data, timeout=300)
    return event_data


@csrf_exempt
def realtime_events_stream(request):
    """
    Server-Sent Events (SSE) & Realtime Sync Stream Endpoint.
    Instantly streams changes made on Mobile App to the Web Application in Realtime.
    """
    def event_stream():
        last_event_ts = None
        for _ in range(60): # 60 seconds connection loop
            latest_event = cache.get('latest_realtime_event')
            if latest_event and latest_event.get('timestamp') != last_event_ts:
                last_event_ts = latest_event.get('timestamp')
                yield f"data: {json.dumps(latest_event)}\n\n"
            else:
                yield "data: {\"type\": \"heartbeat\"}\n\n"
            time.sleep(1)

    if request.GET.get('poll') == 'true':
        latest_event = cache.get('latest_realtime_event') or {'type': 'none'}
        return JsonResponse(latest_event)

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response


