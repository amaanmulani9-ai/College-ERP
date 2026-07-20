import os
import re

TEMPLATE_DIR = r"c:\Users\Amaan\OneDrive\Desktop\College-ERP-main\College-ERP-main\frontend\templates\hod_template"

files_to_fix = [
    "account_settings.html",
    "certificates.html",
    "institute_profile.html",
    "students_info_report.html",
    "bank_details.html",
    "discount_type.html",
    "employees_attendance_report.html",
    "fees_structure.html",
    "messaging.html",
    "student_report.html",
    "settings_account.html",
    "settings_banks.html",
    "settings_fees.html",
    "settings_grading.html",
    "settings_profile.html",
    "settings_rules.html",
    "settings_theme.html"
]

def fix_html_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    style_classes = []
    
    # 1. Extract inline styles and replace with auto-generated classes
    def style_replacer(match):
        style_content = match.group(1)
        if not style_content.strip():
            return ''
            
        class_name = f"auto-style-{len(style_classes) + 1}"
        style_classes.append(f".{class_name} {{ {style_content} }}")
        
        # Check if element already has class attribute
        full_match = match.group(0) # e.g. style="..."
        return f'class="{class_name}"'

    # The regex needs to carefully replace style="...", but since we replace with class="",
    # if the element already has a class attribute, we will have two class attributes which is invalid HTML.
    # A safer approach for a naive script is to just wrap the extracted styles in a <style> block
    # and use the generated class. We can merge class attributes in a second pass.
    
    # Let's use a simpler approach: just find style="..." and replace.
    # To handle existing classes, we can search for `<tag ... style="...">`.
    # Actually, if we just replace `style="..."` with `class="auto-style-X"`, modern browsers usually apply the first or merge them, but HTML linter might complain about duplicate classes.
    # Let's do a smarter regex replacement:
    
    # Extract styles
    extracted_styles = []
    idx = 1
    
    def extract_style(match):
        nonlocal idx
        style_val = match.group(1)
        cname = f"extracted-style-{idx}"
        extracted_styles.append(f".{cname} {{ {style_val} }}")
        idx += 1
        return cname

    # Find elements with style and possibly class
    def element_replacer(match):
        tag_start = match.group(1)
        attrs = match.group(2)
        tag_end = match.group(3)
        
        # Check if there is a style attribute
        style_match = re.search(r'style=([\'"])(.*?)\1', attrs)
        if not style_match:
            return match.group(0)
            
        style_val = style_match.group(2)
        if not style_val.strip():
            # empty style, just remove it
            attrs = re.sub(r'\s*style=[\'"].*?[\'"]', '', attrs)
            return f"<{tag_start}{attrs}{tag_end}"
            
        # extract
        cname = extract_style(style_match)
        
        # remove style from attrs
        attrs = re.sub(r'\s*style=[\'"].*?[\'"]', '', attrs)
        
        # add to class
        class_match = re.search(r'class=([\'"])(.*?)\1', attrs)
        if class_match:
            old_class = class_match.group(2)
            new_class = f"{old_class} {cname}".strip()
            attrs = re.sub(r'class=[\'"].*?[\'"]', f'class="{new_class}"', attrs)
        else:
            attrs += f' class="{cname}"'
            
        return f"<{tag_start}{attrs}{tag_end}"

    content = re.sub(r'<([a-zA-Z0-9\-]+)([^>]*?)(/?>)', element_replacer, content)

    # 2. Add accessible names (title) to select and input elements
    def input_replacer(match):
        tag = match.group(1)
        attrs = match.group(2)
        end = match.group(3)
        
        if 'title=' not in attrs:
            # try to find name or id to use as title
            name_match = re.search(r'name=[\'"](.*?)[\'"]', attrs)
            title_val = name_match.group(1) if name_match else tag
            attrs += f' title="{title_val}"'
            
        if tag.lower() in ['input', 'textarea'] and 'placeholder=' not in attrs and 'type="hidden"' not in attrs.lower() and 'type="checkbox"' not in attrs.lower() and 'type="radio"' not in attrs.lower() and 'type="submit"' not in attrs.lower():
             name_match = re.search(r'name=[\'"](.*?)[\'"]', attrs)
             ph_val = name_match.group(1).replace('_', ' ').title() if name_match else "Enter value"
             attrs += f' placeholder="{ph_val}"'
             
        return f"<{tag}{attrs}{end}"

    content = re.sub(r'<(input|select|textarea)([^>]*?)(/?>)', input_replacer, content, flags=re.IGNORECASE)

    # 3. Add extracted styles to a custom_css block
    if extracted_styles:
        style_block = "<style>\n" + "\n".join(extracted_styles) + "\n</style>\n"
        
        # Check if custom_css block exists
        if "{% block custom_css %}" in content:
            content = content.replace("{% block custom_css %}", "{% block custom_css %}\n" + style_block)
        else:
            # Add after extends
            content = re.sub(r'({% extends .*? %}\n?)', r'\1{% block custom_css %}\n' + style_block + '{% endblock %}\n', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
    else:
        print(f"No changes needed for {filepath}")

for fname in files_to_fix:
    fix_html_file(os.path.join(TEMPLATE_DIR, fname))
    
print("All files processed.")
