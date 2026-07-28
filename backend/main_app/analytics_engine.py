"""
AI Predictive Student Risk & Retention Analytics Engine for College ERP.
Evaluates student performance, attendance records, and fee payment history
to calculate individual Risk Profiles (High Risk, Moderate Risk, Safe) for proactive intervention.
"""

from main_app.models import Student, AttendanceReport, StudentResult, OnlineExamResult, FeeRecord
from django.db.models import Avg, Sum, Count


def calculate_student_risk(student):
    """
    Calculates risk metrics for an individual student.
    Returns dict with attendance_pct, academic_avg, fee_arrears, risk_level, and risk_factors.
    """
    risk_factors = []
    
    # 1. Attendance Percentage Calculation
    total_attendance = AttendanceReport.objects.filter(student=student).count()
    present_attendance = AttendanceReport.objects.filter(student=student, status=True).count()
    attendance_pct = round((present_attendance / total_attendance) * 100, 1) if total_attendance > 0 else 100.0
    
    if attendance_pct < 60.0:
        risk_factors.append(f"Critically Low Attendance ({attendance_pct}%)")
    elif attendance_pct < 75.0:
        risk_factors.append(f"Below Condonation Threshold Attendance ({attendance_pct}%)")
        
    # 2. Academic Score Average Calculation
    exam_results = StudentResult.objects.filter(student=student)
    offline_avg = 0.0
    if exam_results.exists():
        total_marks = 0
        scored_marks = 0
        for res in exam_results:
            total_marks += (res.subject.marks if res.subject else 100)
            scored_marks += (res.test + res.exam)
        offline_avg = (scored_marks / total_marks * 100) if total_marks > 0 else 0.0
        
    online_results = OnlineExamResult.objects.filter(student=student)
    online_avg = 0.0
    if online_results.exists():
        tot_online = 0
        got_online = 0
        for o_res in online_results:
            tot_online += (o_res.total_marks or 100)
            got_online += o_res.score
        online_avg = (got_online / tot_online * 100) if tot_online > 0 else 0.0
        
    if exam_results.exists() and online_results.exists():
        academic_avg = round((offline_avg + online_avg) / 2, 1)
    elif exam_results.exists():
        academic_avg = round(offline_avg, 1)
    elif online_results.exists():
        academic_avg = round(online_avg, 1)
    else:
        academic_avg = 75.0 # Default benchmark when no exam data exists
        
    if academic_avg < 40.0:
        risk_factors.append(f"Failing Academic Score ({academic_avg}%)")
    elif academic_avg < 55.0:
        risk_factors.append(f"Borderline Academic Performance ({academic_avg}%)")
        
    # 3. Fee Arrears Calculation
    fee_records = FeeRecord.objects.filter(student=student)
    pending_fees = sum([record.balance for record in fee_records if record.balance > 0])
    
    if pending_fees > 0:
        risk_factors.append(f"Pending Fee Balance (₹{pending_fees:,.2f})")
        
    # 4. Overall Risk Classification
    if attendance_pct < 60.0 or academic_avg < 40.0:
        risk_level = "High Risk"
    elif attendance_pct < 75.0 or academic_avg < 55.0 or pending_fees > 5000:
        risk_level = "Moderate Risk"
    else:
        risk_level = "Safe"
        
    return {
        "student_id": student.id,
        "name": f"{student.admin.first_name} {student.admin.last_name}".strip() or student.admin.email,
        "student_code": student.unique_student_code or f"STU-{student.id}",
        "course": student.course.name if student.course else "Unassigned",
        "semester": student.current_semester,
        "attendance_pct": attendance_pct,
        "academic_avg": academic_avg,
        "pending_fees": round(pending_fees, 2),
        "risk_level": risk_level,
        "risk_factors": risk_factors,
    }


def generate_system_risk_analytics():
    """
    Computes overall AI risk analysis across all active students for Admin Dashboard.
    """
    students = Student.objects.select_related('admin', 'course').filter(is_passed_out=False)
    
    high_risk_list = []
    moderate_risk_list = []
    safe_count = 0
    
    for student in students:
        profile = calculate_student_risk(student)
        if profile["risk_level"] == "High Risk":
            high_risk_list.append(profile)
        elif profile["risk_level"] == "Moderate Risk":
            moderate_risk_list.append(profile)
        else:
            safe_count += 1
            
    total_eval = len(students) or 1
    
    return {
        "total_evaluated": len(students),
        "high_risk_count": len(high_risk_list),
        "moderate_risk_count": len(moderate_risk_list),
        "safe_count": safe_count,
        "high_risk_pct": round((len(high_risk_list) / total_eval) * 100, 1),
        "high_risk_students": high_risk_list[:10], # Top 10 for dashboard
        "moderate_risk_students": moderate_risk_list[:5],
    }
