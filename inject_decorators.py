import os
import re

files_to_modify = [
    ('backend/main_app/hod_views.py', '@admin_required'),
    ('backend/main_app/staff_views.py', '@staff_required'),
    ('backend/main_app/student_views.py', '@student_required')
]

for filepath, decorator in files_to_modify:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, not found.")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add imports at the top
    if 'from django.contrib.auth.decorators import login_required' not in content:
        import_str = "from django.contrib.auth.decorators import login_required\nfrom .decorators import admin_required, staff_required, student_required\n"
        content = import_str + content
    
    new_content = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        if line.startswith('def ') and '(request' in line:
            is_decorated = False
            # check previous few lines for @login_required
            for j in range(i-1, max(-1, i-5), -1):
                if '@login_required' in lines[j] or decorator in lines[j]:
                    is_decorated = True
                    break
                if not lines[j].strip().startswith('@') and lines[j].strip() != '':
                    break
            
            if not is_decorated:
                new_content.append("@login_required(login_url='/')")
                new_content.append(decorator)
        new_content.append(line)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_content))

print("Injection complete.")
