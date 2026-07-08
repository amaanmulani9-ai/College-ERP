import re
import os

views_file = r'c:\Users\Amaan\OneDrive\Desktop\College-ERP-main\College-ERP-main\backend\main_app\hod_views.py'
urls_file = r'c:\Users\Amaan\OneDrive\Desktop\College-ERP-main\College-ERP-main\backend\main_app\urls.py'

# 1. Read all hod_views.* from urls.py
with open(urls_file, 'r', encoding='utf-8') as f:
    urls_content = f.read()

# find all hod_views.something
view_names = set(re.findall(r'hod_views\.([a-zA-Z0-9_]+)', urls_content))

# 2. Read existing views in hod_views.py
with open(views_file, 'r', encoding='utf-8') as f:
    views_content = f.read()

# find all def something(
existing_views = set(re.findall(r'def ([a-zA-Z0-9_]+)\(', views_content))

missing_views = view_names - existing_views

print(f"Missing views in hod_views.py: {missing_views}")

# 3. Append missing views
if missing_views:
    with open(views_file, 'a', encoding='utf-8') as f:
        f.write("\n\n")
        for view in sorted(list(missing_views)):
            if view == "admin_certificates":
                # Will implement admin_certificates manually
                continue
            if view == "manage_certificate_templates":
                # Will implement manage_certificate_templates manually
                continue

            template_name = f"hod_template/{view.replace('admin_', '')}.html"
            page_title = view.replace('_', ' ').title()
            
            f.write(f"@login_required(login_url='/')\n")
            f.write(f"@admin_required\n")
            if view in ['admin_approve_certificate', 'admin_reject_certificate', 'admin_edit_fee', 'admin_print_fee', 'admin_view_registration', 'admin_edit_registration', 'admin_delete_registration', 'admin_print_job_letter', 'admin_view_staff_id_card']:
                f.write(f"def {view}(request, req_id=None, fee_id=None, reg_id=None, staff_id=None):\n")
            elif view == 'admin_update_exam_marks':
                f.write(f"def {view}(request, exam_id=None):\n")
            else:
                f.write(f"def {view}(request):\n")
            f.write(f"    return render(request, \"{template_name}\", {{'page_title': '{page_title}'}})\n\n")
    print("Successfully appended stub views!")
