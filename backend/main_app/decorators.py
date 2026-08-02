from django.contrib.auth.decorators import user_passes_test

def is_admin(user):
    return bool(user and user.is_authenticated and str(getattr(user, 'user_type', '')) in ['1', '8'])


def is_staff(user):
    return bool(user and user.is_authenticated and str(getattr(user, 'user_type', '')) in ['2', '1', '8'])


def is_student(user):
    return bool(user and user.is_authenticated and str(getattr(user, 'user_type', '')) in ['3', '1', '8'])


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


def is_admin_or_backoffice(user):
    return bool(user and user.is_authenticated and str(getattr(user, 'user_type', '')) in ['1', '7', '8'])


def admin_or_backoffice_required(function=None, login_url='/login/'):
    actual_decorator = user_passes_test(
        is_admin_or_backoffice,
        login_url=login_url,
        redirect_field_name=None
    )
    if function:
        return actual_decorator(function)
    return actual_decorator

