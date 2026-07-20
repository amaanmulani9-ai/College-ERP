import os
import json
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import CustomUser, Student, Staff, Course, Subject, Session, Assignment, AssignmentSubmission
# AI helper functions will be imported locally in views to save memory during startup

def check_ai_limit(request, limit=2):
    usage = request.session.get('ai_usage_count', 0)
    if usage >= limit:
        return False
    request.session['ai_usage_count'] = usage + 1
    return True

@login_required
def student_resume_builder(request):
    student = get_object_or_404(Student, admin=request.user)
    
    generated_resume = None
    if request.method == "POST":
        if not check_ai_limit(request):
            messages.error(request, "AI usage limit reached for this demo (max 2 requests).")
            return redirect('student_resume_builder')
        skills = request.POST.get('skills')
        projects = request.POST.get('projects')
        experience = request.POST.get('experience')
        education = request.POST.get('education')
        
        profile_data = {
            'name': student.admin.get_full_name(),
            'email': student.admin.email,
            'skills': skills,
            'projects': projects,
            'experience': experience,
            'education': education,
            'course': student.course.name if student.course else 'N/A'
        }
        
        from .ai_helper import ai_generate_resume
        generated_resume = ai_generate_resume(profile_data)
        
    context = {
        'page_title': 'AI Resume Builder',
        'generated_resume': generated_resume,
        'student': student
    }
    return render(request, "student_template/student_resume_builder.html", context)

@login_required
def student_ai_quiz(request):
    student = get_object_or_404(Student, admin=request.user)
    subjects = Subject.objects.filter(course=student.course) if student.course else Subject.objects.none()
    
    context = {
        'page_title': 'AI Practice Quizzes',
        'subjects': subjects
    }
    
    if request.method == "POST":
        if not check_ai_limit(request):
            return JsonResponse({'status': 'error', 'message': 'AI usage limit reached for this demo (max 2 requests).'})
        # AJAX Quiz generation
        try:
            data = json.loads(request.body)
            subject_id = data.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            
            from .ai_helper import ai_generate_quiz
            quiz_data = ai_generate_quiz(subject.name)
            return JsonResponse({'status': 'success', 'quiz': quiz_data})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    return render(request, "student_template/student_ai_quiz.html", context)

@login_required
def staff_generate_paper(request):
    if request.user.user_type not in ['1', '2']: # HOD or Staff
        messages.error(request, "Access Denied")
        return redirect(reverse('login_page'))
        
    staff = getattr(request.user, 'staff', None)
    subjects = Subject.objects.filter(staff=staff) if staff else Subject.objects.all()
    
    generated_paper = None
    selected_subject = None
    
    if request.method == "POST":
        if not check_ai_limit(request):
            messages.error(request, "AI usage limit reached for this demo (max 2 requests).")
            return redirect('staff_generate_paper')
        subject_id = request.POST.get('subject')
        total_marks = request.POST.get('marks', 50)
        selected_subject = get_object_or_404(Subject, id=subject_id)
        
        from .ai_helper import ai_generate_question_paper
        generated_paper = ai_generate_question_paper(selected_subject.name, total_marks)
        
    context = {
        'page_title': 'AI Exam Paper Generator',
        'subjects': subjects,
        'generated_paper': generated_paper,
        'selected_subject': selected_subject
    }
    return render(request, "staff_template/staff_generate_paper.html", context)

@login_required
def staff_generate_timetable(request):
    if request.user.user_type not in ['1', '2']: # HOD or Staff
        messages.error(request, "Access Denied")
        return redirect(reverse('login_page'))
        
    courses = Course.objects.all()
    generated_timetable = None
    selected_course = None
    
    if request.method == "POST":
        if not check_ai_limit(request):
            messages.error(request, "AI usage limit reached for this demo (max 2 requests).")
            return redirect('staff_generate_timetable')
        course_id = request.POST.get('course')
        selected_course = get_object_or_404(Course, id=course_id)
        
        subjects = Subject.objects.filter(course=selected_course)
        subject_names = [sub.name for sub in subjects]
        
        if not subject_names:
            messages.warning(request, "No subjects found for this course to generate timetable.")
        else:
            from .ai_helper import ai_generate_timetable
            generated_timetable = ai_generate_timetable(selected_course.name, subject_names)
            
    context = {
        'page_title': 'AI Timetable Planner',
        'courses': courses,
        'generated_timetable': generated_timetable,
        'selected_course': selected_course
    }
    return render(request, "staff_template/staff_generate_timetable.html", context)

@csrf_exempt
@login_required
def staff_ai_grade_assignment(request):
    if request.method == 'POST' and request.user.user_type in ['1', '2']:
        if not check_ai_limit(request):
            return JsonResponse({'status': 'error', 'message': 'AI usage limit reached for this demo (max 2 requests).'})
        try:
            data = json.loads(request.body)
            submission_id = data.get('submission_id')
            
            sub = get_object_or_404(AssignmentSubmission, id=submission_id)
            assignment_desc = sub.assignment.description
            submission_text = sub.submission_text or "No submission text available. Document attached."
            
            from .ai_helper import ai_check_assignment
            result = ai_check_assignment(submission_text, assignment_desc)
            return JsonResponse({
                'status': 'success',
                'score': result.get('score', 80),
                'feedback': result.get('feedback', '')
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    return JsonResponse({'status': 'error', 'message': 'Invalid action'})

import jwt
from datetime import datetime, timedelta
from django.conf import settings




@csrf_exempt
@login_required
def ai_format_address(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            raw_address = data.get('address', '')
            if not raw_address:
                return JsonResponse({'status': 'error', 'message': 'Address text is empty'})
            
            system_prompt = "You are a data formatting assistant. Your job is to format and expand raw address notes into a clean, professional, multi-line postal address. Format the output with clear lines (building, street, area, city, state, postal code). Output ONLY the formatted address, nothing else."
            prompt = f"Format this raw address: {raw_address}"
            
            from .ai_helper import generate_ollama_response
            formatted_address = generate_ollama_response(prompt, system_prompt=system_prompt)
            if not formatted_address:
                formatted_address = raw_address.title()
                
            return JsonResponse({'status': 'success', 'address': formatted_address})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    return JsonResponse({'status': 'error', 'message': 'Invalid action'})


@csrf_exempt
@login_required
def ai_helpdesk_chat(request):
    """
    24/7 AI Chatbot AJAX Handler for instant student & staff helpdesk queries.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '').strip()
            if not user_message:
                return JsonResponse({'status': 'error', 'message': 'Message cannot be empty.'})
                
            from .ai_helper import ai_helpdesk_answer
            answer = ai_helpdesk_answer(request.user, user_message)
            return JsonResponse({'status': 'success', 'response': answer})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method.'})


@login_required
def predictive_analytics_api(request, student_id=None):
    """
    Detailed Predictive Analytics API endpoint triggered when clicking a student risk card.
    """
    try:
        from .models import Student
        if student_id:
            student = get_object_or_404(Student, id=student_id)
        elif hasattr(request.user, 'student'):
            student = request.user.student
        else:
            student = Student.objects.first()
            
        if not student:
            return JsonResponse({'status': 'error', 'message': 'No student record found.'})
            
        from .ai_helper import predict_student_risk
        risk_data = predict_student_risk(student)
        return JsonResponse({'status': 'success', 'data': risk_data})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


@login_required
def receipt_fraud_audit_api(request, payment_id):
    """
    Cryptographic Receipt Fraud Verification API endpoint triggered when clicking a receipt.
    """
    try:
        from .models import FeePayment
        payment = get_object_or_404(FeePayment, id=payment_id)
        
        # Verify receipt hash consistency
        expected_hash = payment.generate_receipt_hash()
        is_authentic = (payment.receipt_hash == expected_hash)
        
        data = {
            'payment_id': payment.id,
            'student_name': payment.fee_record.student.admin.get_full_name(),
            'category': payment.fee_record.category,
            'amount_paid': payment.amount_paid,
            'payment_method': payment.payment_method,
            'payment_date': payment.payment_date.strftime('%Y-%m-%d %H:%M:%S'),
            'transaction_id': payment.transaction_id,
            'receipt_hash': payment.receipt_hash,
            'expected_hash': expected_hash,
            'is_authentic': is_authentic,
            'verification_status': payment.verification_status,
            'verification_notes': payment.verification_notes or 'Receipt hash matches internal ledger signature.'
        }
        return JsonResponse({'status': 'success', 'data': data})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

