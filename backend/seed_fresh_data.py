import os
import django
from datetime import datetime, date

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from main_app.models import CustomUser, Session, Course, Subject, Book, Staff, Student

def seed_data():
    print("Starting database seeding with fresh, clean data...")
    
    # 1. Clear existing data just in case
    print("Clearing any existing records...")
    CustomUser.objects.all().delete()
    Session.objects.all().delete()
    Course.objects.all().delete()
    Subject.objects.all().delete()
    Book.objects.all().delete()
    
    # 2. Create Session
    print("Creating academic session...")
    academic_session = Session.objects.create(
        start_year=date(2026, 1, 1),
        end_year=date(2027, 1, 1)
    )
    
    # 3. Create Courses
    print("Creating courses...")
    cs_course = Course.objects.create(
        name="Computer Science & Engineering"
    )
    
    courses_to_seed = [
        # HSC / Secondary Level
        ("[11-SCI] 11th Science", "HSC", 2),
        ("[11-COM] 11th Commerce", "HSC", 2),
        ("[11-ART] 11th Arts", "HSC", 2),
        ("[12-SCI] 12th Science", "HSC", 2),
        ("[12-COM] 12th Commerce", "HSC", 2),
        ("[12-ART] 12th Arts", "HSC", 2),
        
        # Undergraduate Level (UG)
        ("[BTECH] Bachelor of Technology", "UG", 8),
        ("[BE] Bachelor of Engineering", "UG", 8),
        ("[BSC] Bachelor of Science", "UG", 6),
        ("[BCOM] Bachelor of Commerce", "UG", 6),
        ("[BA] Bachelor of Arts", "UG", 6),
        ("[BBA] Bachelor of Business Administration", "UG", 6),
        ("[BCA] Bachelor of Computer Applications", "UG", 6),
        ("[BED] Bachelor of Education", "UG", 4),
        ("[LLB] Bachelor of Laws", "UG", 6),
        ("[MBBS] Bachelor of Medicine, Bachelor of Surgery", "UG", 9),
        ("[BARCH] Bachelor of Architecture", "UG", 10),
        ("[BPHARMA] Bachelor of Pharmacy", "UG", 8),
        
        # Postgraduate Level (PG)
        ("[MTECH] Master of Technology", "PG", 4),
        ("[ME] Master of Engineering", "PG", 4),
        ("[MSC] Master of Science", "PG", 4),
        ("[MCOM] Master of Commerce", "PG", 4),
        ("[MA] Master of Arts", "PG", 4),
        ("[MBA] Master of Business Administration", "PG", 4),
        ("[MCA] Master of Computer Applications", "PG", 4),
        ("[MED] Master of Education", "PG", 4),
        ("[LLM] Master of Laws", "PG", 4),
        ("[MD] Doctor of Medicine", "PG", 6),
        ("[MS] Master of Surgery", "PG", 6),
        
        # Doctorate Level
        ("[PHD] Doctor of Philosophy", "DOC", 6),
    ]

    for name, level, semesters in courses_to_seed:
        Course.objects.get_or_create(
            name=name,
            defaults={
                'degree_level': level,
                'total_semesters': semesters
            }
        )
    
    # 4. Create HOD/Admin User
    print("Creating HOD/Admin account...")
    admin_user = CustomUser.objects.create(
        email="admin@admin.com",
        password=make_password("admin123"),
        user_type=1,
        gender="M",
        first_name="System",
        last_name="Administrator",
        address="University Main Campus"
    )
    
    # 5. Create Staff User
    print("Creating Staff account...")
    staff_user = CustomUser.objects.create(
        email="staffone@staff.com",
        password=make_password("staff123"),
        user_type=2,
        gender="M",
        first_name="John",
        last_name="Doe",
        address="Faculty Quarters, Sector 4"
    )
    # Associate staff profile with course
    staff_profile = staff_user.staff
    staff_profile.course = cs_course
    staff_profile.save()
    
    # 6. Create Student User (Amaan Mulani)
    print("Creating Student account...")
    student_user = CustomUser.objects.create(
        email="studentone@student.com",
        password=make_password("student123"),
        user_type=3,
        gender="M",
        first_name="Amaan",
        last_name="Mulani",
        address="Omkar sra blg,b1,2011,20th floor,Malad East, Mumbai 97"
    )
    # Associate student profile with course and session
    student_profile = student_user.student
    student_profile.course = cs_course
    student_profile.session = academic_session
    student_profile.save()
    
    # 7. Create Subjects
    print("Creating academic subjects...")
    Subject.objects.create(
        name="Software Engineering",
        staff=staff_profile,
        course=cs_course
    )
    Subject.objects.create(
        name="Database Management Systems",
        staff=staff_profile,
        course=cs_course
    )
    Subject.objects.create(
        name="Data Structures and Algorithms",
        staff=staff_profile,
        course=cs_course
    )

    subject_map = {
        "11-SCI": ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
        "11-COM": ["Book Keeping & Accountancy", "Organization of Commerce & Management", "Economics", "English"],
        "11-ART": ["History", "Geography", "Political Science", "Sociology", "English"],
        "12-SCI": ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
        "12-COM": ["Book Keeping & Accountancy", "Organization of Commerce & Management", "Economics", "English"],
        "12-ART": ["History", "Geography", "Political Science", "Sociology", "English"],
        
        "BTECH": ["Engineering Mathematics", "Engineering Physics", "Computer Programming", "Basic Electrical Engineering", "Engineering Mechanics"],
        "BE": ["Engineering Mathematics", "Engineering Physics", "Computer Programming", "Basic Electrical Engineering", "Engineering Mechanics"],
        "BSC": ["Physics Fundamentals", "Organic Chemistry", "Mathematical Analysis", "Plant Physiology"],
        "BCOM": ["Financial Accounting", "Business Law", "Business Economics", "Corporate Accounting"],
        "BA": ["Intro to Literature", "World History", "Microeconomics", "Intro to Philosophy"],
        "BBA": ["Principles of Management", "Organizational Behavior", "Business Communication", "Financial Management"],
        "BCA": ["Programming in C", "Computer Architecture", "Web Technology", "Software Engineering"],
        "BED": ["Childhood and Growing Up", "Contemporary India and Education", "Learning and Teaching"],
        "LLB": ["Constitutional Law", "Law of Torts", "Family Law", "Law of Crimes"],
        "MBBS": ["Anatomy", "Physiology", "Biochemistry", "Pathology"],
        "BARCH": ["Architectural Design", "Building Construction", "Theory of Design"],
        "BPHARMA": ["Pharmaceutics", "Pharmaceutical Chemistry", "Pharmacology"],
        
        "MTECH": ["Advanced Software Engineering", "Advanced Computer Networks", "Machine Learning", "Research Methodology"],
        "ME": ["Advanced Software Engineering", "Advanced Computer Networks", "Machine Learning", "Research Methodology"],
        "MSC": ["Advanced Physics", "Advanced Chemistry", "Real Analysis", "Advanced Zoology"],
        "MCOM": ["Strategic Management", "Corporate Finance", "Advanced Cost Accounting", "Business Research Methods"],
        "MA": ["Classical Literature", "Modern History", "Macroeconomic Theory", "Ethics & Morality"],
        "MBA": ["Marketing Management", "Human Resource Management", "Financial Management", "Operations Management"],
        "MCA": ["Advanced Algorithms", "Advanced Java Programming", "Web Application Development", "Cloud Computing"],
        "MED": ["Advanced Educational Psychology", "Philosophy of Education", "Education Technology"],
        "LLM": ["Comparative Constitutional Law", "International Law", "Intellectual Property Rights"],
        "MD": ["Advanced Clinical Medicine", "Clinical Diagnosis", "Pharmacology & Therapeutics"],
        "MS": ["General Surgery Principles", "Operative Techniques", "Surgical Anatomy"],
        
        "PHD": ["Research Methodology", "Quantitative Techniques", "Literature Review & Research Ethics"]
    }

    for course in Course.objects.all():
        key = None
        for k in subject_map.keys():
            if f"[{k}]" in course.name:
                key = k
                break
        
        if key and key in subject_map:
            for sub_name in subject_map[key]:
                Subject.objects.get_or_create(
                    name=sub_name,
                    course=course,
                    defaults={'staff': staff_profile}
                )
    
    # 8. Create Library Books
    print("Creating library books...")
    Book.objects.create(
        name="Introduction to Algorithms",
        author="Thomas H. Cormen",
        isbn=978026203,
        category="Computer Science"
    )
    Book.objects.create(
        name="Clean Code",
        author="Robert C. Martin",
        isbn=978013235,
        category="Software Engineering"
    )
    Book.objects.create(
        name="Design Patterns",
        author="Erich Gamma",
        isbn=978020163,
        category="Software Engineering"
    )
    Book.objects.create(
        name="Database System Concepts",
        author="Abraham Silberschatz",
        isbn=978007352,
        category="Databases"
    )
    
    print("Database seeding completed successfully!")
    print("\nFresh Credentials for Testing:")
    print("---------------------------------")
    print("Admin:   admin@admin.com / admin123")
    print("Staff:   staffone@staff.com / staff123")
    print("Student: studentone@student.com / student123")
    print("---------------------------------")

if __name__ == "__main__":
    from django_tenants.utils import schema_context
    with schema_context('demo'):
        seed_data()
