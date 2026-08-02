import os
import sys
import re

def check_sidebar_links():
    import django
    from django.urls import reverse, resolve
    from django.urls.exceptions import NoReverseMatch
    
    sys.path.append(os.path.join(os.path.dirname(__file__), '../../backend'))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
    django.setup()

    sidebar_path = os.path.join(os.path.dirname(__file__), '../../frontend/templates/main_app/erpnext_sidebar.html')
    
    with open(sidebar_path, 'r') as f:
        content = f.read()

    # Find all {% url 'name' %}
    url_names = re.findall(r"{%\s*url\s+'([^']+)'\s*%}", content)
    url_names = sorted(list(set(url_names)))

    missing_urls = []
    working_urls = []
    
    for url_name in url_names:
        try:
            path = reverse(url_name)
            working_urls.append((url_name, path))
        except NoReverseMatch:
            missing_urls.append(url_name)
            
    print(f"Found {len(url_names)} unique URL names in sidebar.")
    print("\n--- MISSING URLS ---")
    for mu in missing_urls:
        print(mu)

    print("\n--- WORKING URLS ---")
    for wu, p in working_urls:
        print(f"{wu} -> {p}")

if __name__ == '__main__':
    check_sidebar_links()
