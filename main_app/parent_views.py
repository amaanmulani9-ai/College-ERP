import json
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Parent, StudentResult, AttendanceReport, OnlineExamResult

def parent_home(request):
    parent = get_object_or_404(Parent, admin=request.user)
    student = parent.student
    
    # Attendance Data
    total_attendance = AttendanceReport.objects.filter(student=student).count()
    attendance_present = AttendanceReport.objects.filter(student=student, status=True).count()
    attendance_absent = total_attendance - attendance_present
    
    # Results Data (Offline Exams)
    results = StudentResult.objects.filter(student=student)
    
    # Online Exams Data
    online_results = OnlineExamResult.objects.filter(student=student).order_by('-submitted_at')
    
    context = {
        'page_title': f'Parent Dashboard - {student.admin.first_name} {student.admin.last_name}',
        'student': student,
        'total_attendance': total_attendance,
        'attendance_present': attendance_present,
        'attendance_absent': attendance_absent,
        'results': results,
        'online_results': online_results
    }
    return render(request, 'parent_template/home_content.html', context)
