import os
d = r'frontend\templates'
for r, _, fs in os.walk(d):
    for f in fs:
        if f.endswith('.html'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            if 'main_app/erpnext_base.html' in content:
                content = content.replace('main_app/erpnext_base.html', 'main_app/base.html')
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Replaced in {p}")
