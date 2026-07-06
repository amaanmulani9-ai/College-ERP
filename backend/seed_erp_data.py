import os
import django
from datetime import datetime, date, time, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from main_app.models import (
    Student, Course, Subject, FeeRecord, FeePayment, 
    Timetable, PlacementDrive, PlacementRegistration, 
    CertificateRequest, StudentResult, CustomUser, StudentRegistration
)

def seed_erp():
    print("Seeding new ERP module data...")
    
    # 1. Get default student Amaan Mulani
    student = Student.objects.filter(admin__email="studentone@student.com").first()
    if not student:
        print("Student Amaan Mulani (studentone@student.com) not found. Please seed primary data first.")
        return
    
    course = student.course
    print(f"Found student: {student.admin.get_full_name()} in Course: {course.name}")
    
    # 2. Clear existing entries to prevent duplicates
    FeeRecord.objects.filter(student=student).delete()
    Timetable.objects.filter(course=course).delete()
    PlacementDrive.objects.all().delete()
    CertificateRequest.objects.filter(student=student).delete()
    
    # 3. Seed Fee Records
    print("Seeding fee records...")
    f1 = FeeRecord.objects.create(
        student=student,
        category="Academic Tuition Fee (Year 2026)",
        amount=45000.0,
        amount_paid=30000.0,
        due_date=date(2026, 9, 15),
        status="Partial"
    )
    # Log a payment for f1
    FeePayment.objects.create(
        fee_record=f1,
        transaction_id="TXN9832410294",
        amount_paid=30000.0,
        payment_method="UPI (GPay)",
        payment_date=datetime.now() - timedelta(days=20)
    )
    
    f2 = FeeRecord.objects.create(
        student=student,
        category="University Examination Fee (Sem IV)",
        amount=2500.0,
        amount_paid=2500.0,
        due_date=date(2026, 6, 30),
        status="Paid"
    )
    # Log payment for f2
    FeePayment.objects.create(
        fee_record=f2,
        transaction_id="TXN1827401928",
        amount_paid=2500.0,
        payment_method="Net Banking (HDFC)",
        payment_date=datetime.now() - timedelta(days=5)
    )
    
    f3 = FeeRecord.objects.create(
        student=student,
        category="Library Caution Deposit & Lab Fee",
        amount=1500.0,
        amount_paid=0.0,
        due_date=date(2026, 7, 15),
        status="Unpaid"
    )
    
    # 4. Seed Subjects Results if missing
    print("Verifying and seeding student results...")
    subjects = Subject.objects.filter(course=course)
    for index, subject in enumerate(subjects):
        result_exists = StudentResult.objects.filter(student=student, subject=subject).exists()
        if not result_exists:
            # Seed realistic marks (test out of 20, exam out of 80)
            test_score = 16 + (index % 3)
            exam_score = 60 + (index * 5)
            StudentResult.objects.create(
                student=student,
                subject=subject,
                test=test_score,
                exam=exam_score
            )
            
    # 5. Seed Timetable
    print("Seeding weekly class timetable...")
    sub_ds = Subject.objects.filter(name__icontains="Data Structures").first()
    sub_db = Subject.objects.filter(name__icontains="Database").first()
    sub_se = Subject.objects.filter(name__icontains="Software").first()
    
    # Fallback to any subject if names don't match
    sub_list = list(subjects)
    if not sub_ds and len(sub_list) > 0: sub_ds = sub_list[0]
    if not sub_db and len(sub_list) > 1: sub_db = sub_list[1]
    if not sub_se and len(sub_list) > 2: sub_se = sub_list[2]
    
    timetable_slots = [
        # Monday
        (0, sub_ds, time(9, 0), time(10, 0), "Room 102"),
        (0, sub_db, time(10, 15), time(11, 15), "Lab 3"),
        # Tuesday
        (1, sub_se, time(9, 0), time(10, 0), "Room 102"),
        (1, sub_db, time(11, 30), time(12, 30), "Room 102"),
        # Wednesday
        (2, sub_ds, time(9, 0), time(10, 0), "Room 102"),
        (2, sub_se, time(10, 15), time(11, 15), "Room 102"),
        # Thursday
        (3, sub_db, time(9, 0), time(10, 0), "Room 102"),
        (3, sub_se, time(13, 30), time(14, 30), "Room 102"),
        # Friday
        (4, sub_ds, time(9, 0), time(10, 0), "Room 102"),
        (4, sub_db, time(14, 0), time(15, 0), "Lab 3"),
    ]
    
    for day, sub, start, end, room in timetable_slots:
        if sub:
            Timetable.objects.create(
                course=course,
                subject=sub,
                day_of_week=day,
                start_time=start,
                end_time=end,
                classroom=room
            )
            
    # 6. Seed Placement Drives
    print("Seeding placement drives...")
    d1 = PlacementDrive.objects.create(
        company_name="Google India",
        job_role="Associate Software Engineer",
        eligibility="CGPA > 8.0, No active backlogs",
        package="32.5 LPA",
        drive_date=date(2026, 9, 20),
        status="Active",
        description="Google India University Graduate hiring drive. Roles include core systems development and software engineering. Multiple rounds of technical and algorithmic coding interviews."
    )
    
    d2 = PlacementDrive.objects.create(
        company_name="Tata Consultancy Services (TCS)",
        job_role="Assistant System Engineer (TCS Digital/Ninja)",
        eligibility="CGPA > 6.0, CSE/IT/ECE branches",
        package="7.2 LPA",
        drive_date=date(2026, 8, 10),
        status="Active",
        description="TCS National Qualifier Test (NQT) for premium college hiring. Digital roles focus on advanced analytics, cloud solutions, and full-stack engineering. Ninja roles focus on application development."
    )
    
    d3 = PlacementDrive.objects.create(
        company_name="Infosys Ltd",
        job_role="Specialist Programmer",
        eligibility="CGPA > 6.5, CSE/IT",
        package="9.5 LPA",
        drive_date=date(2026, 7, 25),
        status="Active",
        description="Infosys HackWithInfy and Specialist Programmer recruitment drive. Focusing on complex algorithmic problem solving, cloud solutions, and enterprise app design."
    )
    
    # Apply to one drive to show registration status
    PlacementRegistration.objects.create(
        student=student,
        drive=d3,
        resume_url="https://drive.google.com/file/d/sample_resume/view",
        status="Applied"
    )
    
    # 7. Seed Certificate Requests
    print("Seeding certificate requests...")
    CertificateRequest.objects.create(
        student=student,
        certificate_type="Bonafide",
        reason="For applying to State Government EBC Scholarship",
        status="Approved",
        approved_date=date.today() - timedelta(days=3)
    )
    
    CertificateRequest.objects.create(
        student=student,
        certificate_type="Character",
        reason="For application to Ministry of External Affairs Passport Service",
        status="Pending"
    )
    
    # 8. Seed Student Registration Details
    print("Seeding student registration and admission details...")
    StudentRegistration.objects.filter(student=student).delete()
    StudentRegistration.objects.create(
        student=student,
        application_no="MASTER OF SCIENCE (INFORMATION TECHNOLOGY) - III /17",
        session="2026-2027",
        course_name="M.SC .IT- PART- II",
        surname="MULANI",
        first_name="AMAAN",
        father_name="ASIF",
        mother_name="SHAHINA",
        marathi_name="मुलानी अमान आसिफ",
        gender="MALE",
        dob=date(2003, 6, 20),
        place_of_birth="MUMBAI",
        marital_status="UNMARRIED",
        religion="MUSLIM",
        nationality="INDIAN",
        blood_group="B+",
        aadhaar_no="283896384668",
        mother_tongue="HINDI",
        passport_no="X4176043",
        voter_id="YZI7524861",
        ncc_nss="NO",
        employment_status="Unemployed",
        birth_state="maharastra",
        birth_district="andheri",
        birth_tehsil="andheri",
        caste_category="OBC",
        caste="OBC",
        prn_no="MSIT250021",
        handicap="NO",
        is_orphan="NO",
        has_device="YES",
        municipal_ward="andheri",
        has_internet="NO",
        height=171.00,
        weight=58.00,
        abc_id="234458422362",
        guardian_occupation="OTHER",
        guardian_mobile="8652304022",
        guardian_income=150000.0,
        address="Omkar sra blg,b1,2011,20th floor,Malad East, Mumbai 97",
        state="Maharashtra",
        district="MUMBAI",
        tehsil="MALAD",
        city="MUMBAI",
        pincode="400097",
        perm_address="Omkar sra blg,b1,2011,20th floor,Malad East, Mumbai 97",
        perm_state="Maharashtra",
        perm_district="MUMBAI",
        perm_tehsil="MALAD",
        perm_city="MUMBAI",
        perm_pincode="400097",
        student_phone="9324832187",
        student_email="amaanmulani9@gmail.com"
    )
    
    print("All ERP module seed data populated successfully!")

if __name__ == "__main__":
    from django_tenants.utils import schema_context
    with schema_context('demo'):
        seed_erp()
