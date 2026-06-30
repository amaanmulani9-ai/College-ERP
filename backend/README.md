# Backend

Django API and server logic for College ERP.

## Contents

| Path | Description |
|------|-------------|
| `college_management_system/` | Django project settings, URLs, WSGI |
| `main_app/` | Models, views, forms, URLs, migrations |
| `media/` | User-uploaded files |
| `db.sqlite3` | SQLite database (development) |
| `manage.py` | Django CLI entry point |
| `requirements.txt` | Python dependencies |
| `seed_*.py` | Database seed scripts |

## Run the server

From the **project root**:

```bash
python manage.py runserver
```

Or from this folder:

```bash
cd backend
python manage.py runserver
```

## Common commands

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
python manage.py test
```
