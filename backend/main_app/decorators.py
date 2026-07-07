from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import PermissionDenied

def is_admin(user):
    if user.is_authenticated and str(getattr(user, 'user_type', '')) == '1':
        return True
    raise PermissionDenied


def is_staff(user):
    if user.is_authenticated and str(getattr(user, 'user_type', '')) == '2':
        return True
    raise PermissionDenied

def is_student(user):
    if user.is_authenticated and str(getattr(user, 'user_type', '')) == '3':
        return True
    raise PermissionDenied

def admin_required(function=None, login_url='/login/'):
    actual_decorator = user_passes_test(
        is_admin,
        login_url=login_url,
        redirect_field_name=None
    )
    if function:
        return actual_decorator(function)
    return actual_decorator

def staff_required(function=None, login_url='/login/'):
    actual_decorator = user_passes_test(
        is_staff,
        login_url=login_url,
        redirect_field_name=None
    )
    if function:
        return actual_decorator(function)
    return actual_decorator

def student_required(function=None, login_url='/login/'):
    actual_decorator = user_passes_test(
        is_student,
        login_url=login_url,
        redirect_field_name=None
    )
    if function:
        return actual_decorator(function)
    return actual_decorator

