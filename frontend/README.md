# Frontend

HTML templates, static assets, and translations for College ERP.

## Contents

| Path | Description |
|------|-------------|
| `templates/` | Django HTML templates (admin, staff, student, parent portals) |
| `static/` | CSS, JavaScript, images, PWA files |
| `locale/` | Translation files (English, Hindi, Arabic) |

## Template layout

```
templates/
├── main_app/          # Shared pages (login, base layouts)
├── hod_template/      # Admin portal
├── staff_template/    # Staff portal
├── student_template/  # Student portal
├── parent_template/   # Parent portal
└── registration/      # Registration forms
```

## Static assets

- `static/dist/` — AdminLTE theme (CSS/JS)
- `static/plugins/` — jQuery, Bootstrap, Chart.js, etc.
- `static/icons/` — PWA icons
- `static/sw.js` — Service worker for offline support

## Editing the UI

1. **Templates** — Edit HTML in `templates/`
2. **Styles/Scripts** — Edit files in `static/dist/css/` and `static/dist/js/`
3. **Translations** — Update `.po` files in `locale/`, then run `python manage.py compilemessages` from the project root
