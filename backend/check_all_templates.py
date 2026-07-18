import os
import re

backend_dir = os.path.dirname(__file__)
main_app_dir = os.path.join(backend_dir, 'main_app')
templates_dir = os.path.abspath(os.path.join(backend_dir, '../frontend/templates'))

missing_templates = []
existing_templates = []
all_checked = 0

py_files = [f for f in os.listdir(main_app_dir) if f.endswith('.py')]

for py_file in py_files:
    file_path = os.path.join(main_app_dir, py_file)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    # Find all 'template.html' patterns in render(..., '...', ...) or render_to_string('...', ...)
    # Let's match any string containing .html inside quotes
    templates = re.findall(r"['\"]([^'\"]+\.html)['\"]", content)
    
    for t in templates:
        # Ignore common base files or external templates if any, but check all others
        t_path = os.path.join(templates_dir, t)
        all_checked += 1
        if not os.path.exists(t_path):
            missing_templates.append((py_file, t))
        else:
            existing_templates.append((py_file, t))

missing_templates = sorted(list(set(missing_templates)))
existing_templates = sorted(list(set(existing_templates)))

print(f"Total template references found: {all_checked}")
print(f"Unique existing templates: {len(existing_templates)}")
print(f"Unique missing templates: {len(missing_templates)}")

if missing_templates:
    print("\n--- MISSING TEMPLATES ---")
    for py_file, t in missing_templates:
        print(f"In {py_file}: {t}")
else:
    print("\nAll referenced templates exist!")
