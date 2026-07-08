import os
import re

backend_dir = os.path.dirname(__file__)
templates_dir = os.path.abspath(os.path.join(backend_dir, '../frontend/templates'))

view_files = [
    'main_app/views.py',
    'main_app/hod_views.py',
    'main_app/staff_views.py',
    'main_app/student_views.py',
]

missing_templates = []

for vf in view_files:
    file_path = os.path.join(backend_dir, vf)
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find all render(..., 'path/to/template.html', ...)
    templates = re.findall(r"render\([^,]+,\s*['\"]([^'\"]+\.html)['\"]", content)
    
    for t in templates:
        t_path = os.path.join(templates_dir, t)
        if not os.path.exists(t_path):
            missing_templates.append((vf, t))

missing_templates = sorted(list(set(missing_templates)))

print(f"Checked templates in view files.")
if missing_templates:
    print("\n--- MISSING TEMPLATES ---")
    for vf, t in missing_templates:
        print(f"In {vf}: {t}")
else:
    print("All referenced templates exist!")
