<!-- Generated: 2026-07-06 | Scanned directories: 12 | Token estimate: ~250 -->
# Frontend Architecture & Assets Map

The frontend utilizes Django templates populated dynamically by the backend context, styled with Bootstrap, Custom Vanilla CSS, and enhanced with client-side interactive libraries.

## Template Hierarchy Tree
```
[frontend/templates/main_app/base.html] (Global AdminLTE/Bootstrap Layout Wrapper)
  |
  +-- [main_app/erpnext_sidebar.html] (Common Multi-role Navigation Sidebar)
  |
  +-- [hod_template/] (Admin Dashboard Panels)
  |     +-- manage_batches.html (Filters & Promotes semesters, bulk prints IDs)
  |     +-- print_batch_id_cards.html (Bulk CSS printable sheets of PVC IDs)
  |     +-- visitor_passes_admin.html (Approves/Rejects campus visitor passes)
  |
  +-- [staff_template/] (Teacher Dashboard Panels)
  |     +-- staff_id_card.html (Flippable 3D ID card with QR and employee details)
  |     +-- staff_scanner_desk.html (HTML5 QR scanner using local camera feed)
  |
  +-- [student_template/] (Student Dashboard Panels)
        +-- student_id_card.html (Flippable 3D digital ID card with QR & barcode)
```

## Key Frontend Libraries & Integrations
- **JsBarcode**: Used on ID cards (`student_id_card.html`, `staff_id_card.html`, and `print_batch_id_cards.html`) to render dynamic CODE128 barcodes from student/staff unique identifiers.
- **HTML5-QRcode / Instascan**: Integrates local webcam camera stream in the `/staff/scanner/` views for scanning QR codes on campus entries.
- **Chart.js**: Powering the advanced HOD dashboards (`analytics.html` and `home_content.html`) to render student counts, attendance trends, and staff performance metrics.
- **AdminLTE / Bootstrap 4/5**: Provides structural layouts, components, grids, and standard visual utilities.
