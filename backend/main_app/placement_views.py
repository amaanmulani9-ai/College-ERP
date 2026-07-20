import json
import uuid
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from main_app.models import Company, JobPosting, Resume, Interview, OfferLetter, Student, CustomUser
from django.contrib import messages

def student_placement_dashboard(request):
    """ View for students to see job postings, build their resume, and view interviews """
    if not request.user.is_authenticated or request.user.user_type != '3':
        return redirect('login_page')
    
    student = Student.objects.get(admin=request.user)
    job_postings = JobPosting.objects.filter(is_active=True)
    interviews = Interview.objects.filter(student=student)
    offers = OfferLetter.objects.filter(student=student)
    
    try:
        resume = Resume.objects.get(student=student)
    except Resume.DoesNotExist:
        resume = None
        
    context = {
        'job_postings': job_postings,
        'interviews': interviews,
        'offers': offers,
        'resume': resume
    }
    return render(request, 'student_template/placement.html', context)

@csrf_exempt
def save_json_resume(request):
    """ API to save the structured JSON Resume payload from the frontend builder """
    if request.method == 'POST':
        if not request.user.is_authenticated or request.user.user_type != '3':
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
            
        student = Student.objects.get(admin=request.user)
        data = json.loads(request.body)
        resume_data = data.get('resume_json', {})
        
        resume, created = Resume.objects.get_or_create(student=student)
        resume.json_data = resume_data
        resume.save()
        
        return JsonResponse({'status': 'success', 'message': 'Resume saved successfully!'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


def get_interviews_calendar_events(request):
    """ API to feed FullCalendar.js with Interview events """
    if not request.user.is_authenticated:
        return JsonResponse([], safe=False)
        
    events = []
    
    # If Student, only their interviews. If Admin, all interviews.
    if request.user.user_type == '3':
        student = Student.objects.get(admin=request.user)
        interviews = Interview.objects.filter(student=student)
    elif request.user.user_type == '1': # HOD/Admin
        interviews = Interview.objects.all()
    else:
        return JsonResponse([], safe=False)
        
    for interview in interviews:
        events.append({
            'title': f'Interview with {interview.company.name}',
            'start': interview.scheduled_time.isoformat(),
            'url': interview.jitsi_meet_url,
            'color': 'green' if interview.status == 'Completed' else 'blue'
        })
        
    return JsonResponse(events, safe=False)


def admin_placement_dashboard(request):
    """ HOD Dashboard to manage Companies, Jobs, Schedule Interviews, and Alumni """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return redirect('login_page')
        
    companies = Company.objects.all()
    jobs = JobPosting.objects.all()
    students = Student.objects.all()
    interviews = Interview.objects.all()
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'schedule_interview':
            student_id = request.POST.get('student_id')
            company_id = request.POST.get('company_id')
            dt = request.POST.get('datetime')
            
            student = Student.objects.get(id=student_id)
            company = Company.objects.get(id=company_id)
            
            # Generate Jitsi URL
            room_id = uuid.uuid4().hex[:12]
            jitsi_url = f"https://meet.jit.si/college-erp-{room_id}"
            
            Interview.objects.create(
                student=student,
                company=company,
                scheduled_time=dt,
                jitsi_meet_url=jitsi_url
            )
            messages.success(request, f"Interview scheduled successfully for {student.admin.first_name} with {company.name}.")
            return redirect('admin_placement_dashboard')
            
        elif action == 'convert_alumni':
            student_id = request.POST.get('student_id')
            student = Student.objects.get(id=student_id)
            
            user = student.admin
            user.user_type = '5' # Alumni
            user.save()
            messages.success(request, f"{user.first_name} has been transitioned to Alumni status.")
            return redirect('admin_placement_dashboard')
            
    context = {
        'companies': companies,
        'jobs': jobs,
        'students': students,
        'interviews': interviews,
    }
    return render(request, 'hod_template/placement_dashboard.html', context)
