import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from main_app.models import Course
from django_tenants.utils import schema_context

def seed_india_courses():
    courses_data = [
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

    print("Adding All-India Courses from 11th standard onwards to the demo tenant...")
    count = 0
    for name, level, semesters in courses_data:
        course, created = Course.objects.get_or_create(
            name=name,
            defaults={
                'degree_level': level,
                'total_semesters': semesters
            }
        )
        if created:
            print(f"Created Course: {name}")
            count += 1
        else:
            print(f"Course already exists: {name}")
            
    print(f"Successfully added/verified {count} new courses.")

if __name__ == "__main__":
    with schema_context('demo'):
        seed_india_courses()
