import re
import os

def check_views():
    urls_path = 'backend/main_app/urls.py'
    with open(urls_path, 'r', encoding='utf-8') as f:
        urls_content = f.read()

    # Find all path(..., module.view_function, ...)
    # Match pattern like: path("some/url/", module.function_name, name='...')
    matches = re.findall(r'path\([^,]+,\s*([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)', urls_content)
    
    missing_views = []
    
    for module, function in matches:
        if module == 'views' or module.endswith('_views'):
            module_file = f"backend/main_app/{module}.py"
            if not os.path.exists(module_file):
                missing_views.append(f"Module {module} does not exist.")
                continue
            
            with open(module_file, 'r', encoding='utf-8') as mf:
                mf_content = mf.read()
                # Check if function exists (def function_name or class function_name)
                if not re.search(r'(def|class)\s+' + function + r'\b', mf_content):
                    missing_views.append(f"View '{function}' is missing in {module}.py")

    print("=== MISSING VIEWS ===")
    if not missing_views:
        print("(0 missing views)")
    else:
        for mv in set(missing_views):
            print(mv)

if __name__ == '__main__':
    check_views()
