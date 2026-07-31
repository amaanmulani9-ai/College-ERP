from django.db import connection
from .models import Permission, Role

DEFAULT_PERMISSIONS = [
    # Students
    {"code": "students.view", "name": "View Students", "module": "students", "action": "view"},
    {"code": "students.create", "name": "Create Students", "module": "students", "action": "create"},
    {"code": "students.update", "name": "Update Students", "module": "students", "action": "update"},
    {"code": "students.delete", "name": "Delete Students", "module": "students", "action": "delete"},
    # Attendance
    {"code": "attendance.mark", "name": "Mark Attendance", "module": "attendance", "action": "mark"},
    {"code": "attendance.edit", "name": "Edit Attendance", "module": "attendance", "action": "edit"},
    {"code": "attendance.view", "name": "View Attendance", "module": "attendance", "action": "view"},
    # Fees
    {"code": "fees.collect", "name": "Collect Fees", "module": "fees", "action": "collect"},
    {"code": "fees.refund", "name": "Refund Fees", "module": "fees", "action": "refund"},
    {"code": "fees.view", "name": "View Fees", "module": "fees", "action": "view"},
    # Library
    {"code": "library.issue", "name": "Issue Books", "module": "library", "action": "issue"},
    {"code": "library.return", "name": "Return Books", "module": "library", "action": "return"},
    {"code": "library.view", "name": "View Library", "module": "library", "action": "view"},
    # Placement
    {"code": "placement.manage", "name": "Manage Placements", "module": "placement", "action": "manage"},
    {"code": "placement.view", "name": "View Placements", "module": "placement", "action": "view"},
    # Academic & Exams
    {"code": "results.publish", "name": "Publish Results", "module": "exams", "action": "publish"},
    {"code": "results.view", "name": "View Results", "module": "exams", "action": "view"},
    # Admin & General
    {"code": "documents.verify", "name": "Verify Documents", "module": "documents", "action": "verify"},
    {"code": "notifications.send", "name": "Send Notifications", "module": "notifications", "action": "send"},
    {"code": "roles.manage", "name": "Manage Roles & RBAC", "module": "rbac", "action": "manage"},
]

DEFAULT_ROLES = [
    {"name": "College Admin", "priority": 100, "description": "Full administrative control over college tenant.", "perms": ["*"]},
    {"name": "HOD", "priority": 90, "description": "Head of Department administrative access.", "perms": ["students.view", "students.update", "attendance.mark", "attendance.view", "results.publish", "results.view"]},
    {"name": "Teacher", "priority": 80, "description": "Faculty member for marking attendance & viewing results.", "perms": ["students.view", "attendance.mark", "attendance.edit", "attendance.view", "results.view"]},
    {"name": "Student", "priority": 10, "description": "Student user for viewing attendance, fees & results.", "perms": ["attendance.view", "results.view", "library.view", "placement.view"]},
    {"name": "Parent", "priority": 10, "description": "Parent portal access for student monitoring.", "perms": ["attendance.view", "results.view", "fees.view"]},
    {"name": "Alumni", "priority": 10, "description": "Alumni member access for events and network.", "perms": ["placement.view"]},
    {"name": "Recruiter", "priority": 50, "description": "Corporate recruiter access for placements.", "perms": ["placement.view"]},
    {"name": "Accountant", "priority": 70, "description": "Financial management, fee collection & refunds.", "perms": ["fees.collect", "fees.refund", "fees.view", "students.view"]},
    {"name": "Librarian", "priority": 70, "description": "Library management for book issuance & returns.", "perms": ["library.issue", "library.return", "library.view", "students.view"]},
    {"name": "Hostel Warden", "priority": 60, "description": "Hostel supervision & student monitoring.", "perms": ["students.view", "notifications.send"]},
    {"name": "Transport Manager", "priority": 60, "description": "Vehicle fleet & transport route management.", "perms": ["students.view", "notifications.send"]},
    {"name": "Placement Officer", "priority": 75, "description": "Campus drive & placement management.", "perms": ["placement.manage", "placement.view", "students.view"]},
    {"name": "Admission Officer", "priority": 75, "description": "New student admissions & document verification.", "perms": ["students.create", "students.view", "documents.verify"]},
    {"name": "Back Office", "priority": 50, "description": "Administrative support & operational tasks.", "perms": ["students.view", "notifications.send"]},
]


def seed_rbac_defaults(tenant_schema=None):
    """Idempotently seeds permissions and 14 default roles for the active tenant schema."""
    current_schema = tenant_schema or getattr(connection, "schema_name", "public")
    
    # 1. Seed Permissions
    created_perms = {}
    for p_data in DEFAULT_PERMISSIONS:
        perm, _ = Permission.objects.get_or_create(
            code=p_data["code"],
            defaults={
                "name": p_data["name"],
                "module": p_data["module"],
                "action": p_data["action"],
                "is_system": True,
                "is_active": True,
            },
        )
        created_perms[p_data["code"]] = perm

    # 2. Seed Roles
    for r_data in DEFAULT_ROLES:
        role, created = Role.objects.get_or_create(
            name=r_data["name"],
            tenant_schema=current_schema,
            defaults={
                "description": r_data["description"],
                "priority": r_data["priority"],
                "is_system": True,
                "is_active": True,
            },
        )

        if r_data["perms"] == ["*"]:
            role.permissions.set(Permission.objects.filter(is_active=True))
        else:
            perms_to_add = [created_perms[code] for code in r_data["perms"] if code in created_perms]
            role.permissions.set(perms_to_add)

    return True
