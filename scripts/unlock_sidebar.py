import re
import os

sidebar_path = r'c:\Users\Amaan\OneDrive\Desktop\College-ERP-main\College-ERP-main\frontend\templates\main_app\erpnext_sidebar.html'

with open(sidebar_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Regular expressions to find locked items. 
# We need to extract the feature name from the span to construct the URL.

def replacer(match):
    # match.group(1) is the inner HTML of the link, containing the span with the text
    inner_html = match.group(1)
    
    # Extract feature name
    text_match = re.search(r'<span class="nav-text"[^>]*>([^<]+)</span>', inner_html)
    feature_name = "Feature"
    if text_match:
        feature_name = text_match.group(1).strip()
    
    # Create url safe slug
    slug = feature_name.lower().replace(' ', '-').replace('/', '-').replace('&', 'and')
    
    # Remove the lock icon from inner_html
    inner_html = re.sub(r'<i class="fas fa-lock"[^>]*></i>', '', inner_html).strip()
    
    # Remove color: #999 from span
    inner_html = re.sub(r'style="color:\s*#999;"', '', inner_html)
    
    return f'href="{{% url \'feature_coming_soon\' \'{slug}\' %}}" class="nav-link">{inner_html}</a>'


# We have different formats of disabled links.
# Format 1: href="#" class="nav-link disabled" ... > ... </a>
pattern1 = r'href="#"\s+class="nav-link disabled"[^>]*>(.*?)</a>'
content = re.sub(pattern1, replacer, content, flags=re.DOTALL)

# Format 2: For top level items like WhatsApp, it might be slightly different.
# Let's just find any link containing the lock icon.
def replacer_any_lock(match):
    full_link = match.group(0)
    
    # Extract feature name
    text_match = re.search(r'<span class="nav-text"[^>]*>([^<]+)</span>', full_link)
    feature_name = "Feature"
    if text_match:
        feature_name = text_match.group(1).strip()
    
    # Create url safe slug
    slug = feature_name.lower().replace(' ', '-').replace('/', '-').replace('&', 'and')
    
    # Remove lock
    full_link = re.sub(r'<i class="fas fa-lock"[^>]*></i>', '', full_link)
    
    # Replace href
    full_link = re.sub(r'href="#"', f'href="{{% url \'feature_coming_soon\' \'{slug}\' %}}"', full_link)
    
    # Remove disabled class if any
    full_link = full_link.replace('disabled', '')
    
    # Remove inline styles that make it look disabled
    full_link = re.sub(r'style="[^"]*display:\s*flex[^"]*"', '', full_link)
    full_link = re.sub(r'style="color:\s*#999;"', '', full_link)
    
    return full_link

pattern2 = r'<a [^>]*href="#"[^>]*>.*?<i class="fas fa-lock".*?</a>'
content = re.sub(pattern2, replacer_any_lock, content, flags=re.DOTALL)

with open(sidebar_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Sidebar unlocked successfully.")
