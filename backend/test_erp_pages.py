import urllib.request, urllib.parse, http.cookiejar

BASE = 'http://127.0.0.1:8000'

def make_session(email, password):
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
    resp = opener.open(BASE + '/')
    csrf_token = next((c.value for c in jar if c.name == 'csrftoken'), None)
    data = urllib.parse.urlencode({'email': email, 'password': password, 'csrfmiddlewaretoken': csrf_token or ''}).encode()
    req = urllib.request.Request(BASE + '/doLogin/', data=data,
        headers={'Referer': BASE + '/', 'Content-Type': 'application/x-www-form-urlencoded'})
    resp = opener.open(req)
    _ = resp.read()
    return opener, resp.url

def check_page(opener, path, label):
    try:
        resp = opener.open(BASE + path)
        content = resp.read().decode('utf-8', errors='replace')
        has_error = 'Traceback' in content or 'TemplateSyntaxError' in content or 'Server Error' in content or 'AttributeError' in content
        status = resp.status
        ok = status == 200 and not has_error
        icon = 'PASS' if ok else 'FAIL'
        print(f'  [{icon}] {label} ({path}) -> HTTP {status}{"  !! CODE/TEMPLATE CRASH !!" if has_error else ""}')
        return ok
    except urllib.error.HTTPError as e:
        print(f'  [FAIL] {label} ({path}) -> HTTP Error {e.code}')
        return False
    except Exception as e:
        print(f'  [FAIL] {label} ({path}) -> {e}')
        return False

print('='*75)
print('  College ERP - New MasterSoft ERP Modules Verification')
print('='*75)

# ---- Student Login & Verification ----
print('\n[STUDENT - studentone@student.com]')
try:
    opener, url = make_session('studentone@student.com', 'student123')
    print(f'  Login -> {url}')
    
    # Core Dashboard
    check_page(opener, '/student/home/', 'Student Redesigned Dashboard')
    
    # New Modules
    check_page(opener, '/student/timetable/', 'Class Timetable Module')
    check_page(opener, '/student/hall-ticket/', 'Examination Hall Ticket Module')
    check_page(opener, '/student/payable-fees/', 'Fee Management Portal Module')
    check_page(opener, '/student/certificates/', 'Certificates Request Portal')
    check_page(opener, '/student/placements/', 'Campus Placements Portal')
    
except Exception as e:
    print(f'Error during session testing: {e}')

print()
print('='*75)
print('Verification complete!')
