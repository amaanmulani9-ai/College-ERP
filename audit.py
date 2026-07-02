import os
import re

def audit_templates():
    frontend_dir = os.path.join('frontend', 'templates')
    all_templates = set()
    for root, dirs, files in os.walk(frontend_dir):
        for file in files:
            if file.endswith('.html'):
                # Store relative path
                rel_path = os.path.relpath(os.path.join(root, file), frontend_dir)
                all_templates.add(rel_path.replace('\\', '/'))

    # Read all python view files
    views_dir = os.path.join('backend', 'main_app')
    view_files = [f for f in os.listdir(views_dir) if f.endswith('_views.py') or f == 'views.py']
    
    missing_templates = []
    
    for vf in view_files:
        with open(os.path.join(views_dir, vf), 'r', encoding='utf-8') as f:
            content = f.read()
            # Find all render(..., "template_name.html")
            # Using regex to find strings ending with .html
            matches = re.findall(r'[\'"]([a-zA-Z0-9_/\-\\]+\.html)[\'"]', content)
            for m in matches:
                m_clean = m.replace('\\', '/')
                if m_clean not in all_templates:
                    missing_templates.append((vf, m_clean))
                    
    print("=== MISSING TEMPLATES ===")
    for vf, m in set(missing_templates):
        print(f"View File: {vf} -> Missing Template: {m}")

if __name__ == '__main__':
    audit_templates()
