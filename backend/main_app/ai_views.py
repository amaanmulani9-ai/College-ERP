import json
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import CustomUser, Student, Staff, Course, Subject, Session, Assignment, AssignmentSubmission
from .ai_helper import ai_generate_resume, ai_generate_quiz, ai_generate_question_paper, ai_generate_timetable, ai_check_assignment

@login_required
def student_resume_builder(request):
    student = get_object_or_404(Student, admin=request.user)
    
    generated_resume = None
    if request.method == "POST":
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
        # AJAX Quiz generation
        try:
            data = json.loads(request.body)
            subject_id = data.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            
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
        subject_id = request.POST.get('subject')
        total_marks = request.POST.get('marks', 50)
        selected_subject = get_object_or_404(Subject, id=subject_id)
        
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
        course_id = request.POST.get('course')
        selected_course = get_object_or_404(Course, id=course_id)
        
        subjects = Subject.objects.filter(course=selected_course)
        subject_names = [sub.name for sub in subjects]
        
        if not subject_names:
            messages.warning(request, "No subjects found for this course to generate timetable.")
        else:
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
        try:
            data = json.loads(request.body)
            submission_id = data.get('submission_id')
            
            sub = get_object_or_404(AssignmentSubmission, id=submission_id)
            assignment_desc = sub.assignment.description
            submission_text = sub.submission_text or "No submission text available. Document attached."
            
            result = ai_check_assignment(submission_text, assignment_desc)
            return JsonResponse({
                'status': 'success',
                'score': result.get('score', 80),
                'feedback': result.get('feedback', '')
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    return JsonResponse({'status': 'error', 'message': 'Invalid action'})
