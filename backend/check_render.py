import os
import sys
import django
from django.template.loader import render_to_string
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "college_management_system.settings")
django.setup()

request = RequestFactory().get('/student/view/result/')
request.user = AnonymousUser()

try:
    content = render_to_string('student_template/student_view_result.html', {'request': request, 'user': AnonymousUser()})
    if "View Attendance" in content:
        print("YES, View Attendance IS in the rendered output.")
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if "View Attendance" in line:
                print(f"Line {i}: {line}")
    else:
        print("NO, View Attendance is NOT in the rendered output.")
except Exception as e:
    print(f"Error: {e}")
