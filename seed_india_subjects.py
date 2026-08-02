import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from main_app.models import Course, Subject, Staff
from django_tenants.utils import schema_context

def seed_india_subjects():
    # Subject mappings for each course code pattern
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

    # Fetch default staff
    default_staff = Staff.objects.first()
    if not default_staff:
        print("Error: No Staff member exists in the database. Please seed staff first.")
        return

    print(f"Using default staff: {default_staff} ({default_staff.admin.email})")
    
    courses = Course.objects.all()
    count = 0
    
    for course in courses:
        # Determine the key/code pattern from the course name, e.g. [11-SCI] -> "11-SCI"
        key = None
        for k in subject_map.keys():
            if f"[{k}]" in course.name:
                key = k
                break
        
        if key and key in subject_map:
            subjects = subject_map[key]
            for sub_name in subjects:
                clean_name = "".join(c for c in sub_name if c.isalnum()).upper()
                code_val = f"{clean_name[:3]}-{key}"
                subject, created = Subject.objects.get_or_create(
                    name=sub_name,
                    course=course,
                    defaults={'staff': default_staff, 'subject_code': code_val}
                )
                if not subject.subject_code:
                    subject.subject_code = code_val
                    subject.save()
                
                if created:
                    print(f"Created Subject '{sub_name}' [{code_val}] for Course '{course.name}'")
                    count += 1
                else:
                    print(f"Updated Subject '{sub_name}' [{code_val}] for Course '{course.name}'")

    print(f"Successfully seeded {count} subjects corresponding to the course list.")

if __name__ == "__main__":
    with schema_context('demo'):
        seed_india_subjects()
