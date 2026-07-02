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
