import os
import re

backend_dir = os.path.dirname(__file__)
templates_dir = os.path.abspath(os.path.join(backend_dir, '../frontend/templates'))

missing_refs = []
checked_count = 0

for root, dirs, files in os.walk(templates_dir):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            rel_file_path = os.path.relpath(file_path, templates_dir)
            
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Regex for {% extends '...' %} or {% include '...' %}
            # Handle variable extends like {% extends base_template %} by ignoring non-quoted
            extends_matches = re.findall(r"{%\s*extends\s*['\"]([^'\"]+)['\"]\s*%}", content)
            include_matches = re.findall(r"{%\s*include\s*['\"]([^'\"]+)['\"]\s*%}", content)
            
            for ref in extends_matches + include_matches:
                checked_count += 1
                ref_path = os.path.join(templates_dir, ref)
                if not os.path.exists(ref_path):
                    missing_refs.append((rel_file_path, ref))

print(f"Total HTML extends/includes checked: {checked_count}")
print(f"Unique missing templates: {len(set(missing_refs))}")

if missing_refs:
    print("\n--- MISSING REFERENCED TEMPLATES ---")
    for file, ref in sorted(list(set(missing_refs))):
        print(f"In template {file}: referenced template '{ref}' is missing")
else:
    print("\nAll templates extended/included exist!")
