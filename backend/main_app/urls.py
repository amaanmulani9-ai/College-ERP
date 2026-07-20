"""college_management_system URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from main_app.EditResultView import EditResultView

from . import hod_views, staff_views, student_views, parent_views, views, chat_views, smart_views, ai_views, analytics_views, mobile_api_views, finance_views, placement_views, backoffice_views

urlpatterns = [
    path("robots.txt", views.robots_txt, name="robots_txt"),
    path("sitemap.xml", views.sitemap_xml, name="sitemap_xml"),
    path("llms.txt", views.llms_txt, name="llms_txt"),
    path("", views.landing_page, name='landing_page'),
    path("login/", views.login_page, name='login_page'),
    path("healthz/", views.health_check, name='health_check'),
    path('offline/', views.offline, name='offline'),
    path('student/register/', views.online_registration, name='online_registration'),
    path("get_attendance", views.get_attendance, name='get_attendance'),
    path("firebase-messaging-sw.js", views.showFirebaseJS, name='showFirebaseJS'),
    path("doLogin/", views.doLogin, name='doLogin'),
    path("logout_user/", views.logout_user, name='logout_user'),
    path("set_locale/", views.set_locale, name='set_locale'),
    path("admin/home/", hod_views.admin_home, name='admin_home'),
    path("admin/library/", hod_views.admin_library_overview, name='admin_library_overview'),
    path("admin/library/catalog/", hod_views.admin_library_catalog, name='admin_library_catalog'),
    path("admin/library/issue/", hod_views.admin_library_issue, name='admin_library_issue'),
    path("admin/library/overdue/", hod_views.admin_library_overdue, name='admin_library_overdue'),
    path("admin/analytics/", analytics_views.admin_analytics, name='admin_analytics'),
    path("admin/analytics/export/<str:report_type>/", analytics_views.export_analytics_report, name='export_analytics_report'),
    path("metrics", analytics_views.prometheus_metrics, name='prometheus_metrics'),
    path("api/mobile/login/", mobile_api_views.mobile_login, name='mobile_login'),
    path("api/mobile/timetable/", mobile_api_views.get_user_timetable, name='mobile_timetable'),
    path("api/mobile/attendance/", mobile_api_views.get_user_attendance, name='mobile_attendance'),
    path("api/mobile/qr_scan/", mobile_api_views.process_qr_scan, name='mobile_qr_scan'),
    path("student/finances/", finance_views.student_finances, name='student_finances'),
    path("api/finance/razorpay/checkout/", finance_views.razorpay_checkout, name='razorpay_checkout'),
    path("api/finance/razorpay/webhook/", finance_views.razorpay_webhook, name='razorpay_webhook'),
    path("admin/finance/", finance_views.admin_finance_dashboard, name='admin_finance_dashboard'),
    path("admin/accounts/chart/", finance_views.chart_of_accounts, name='chart_of_accounts'),
    path("admin/accounts/income/add/", finance_views.add_income, name='add_income'),
    path("admin/accounts/expense/add/", finance_views.add_expense, name='add_expense'),
    path("admin/accounts/statement/", finance_views.account_statement, name='account_statement'),
    path("admin/finance/gst_report/", finance_views.generate_gst_report, name='generate_gst_report'),
    path("student/placement/", placement_views.student_placement_dashboard, name='student_placement_dashboard'),
    path("api/placement/resume/save/", placement_views.save_json_resume, name='save_json_resume'),
    path("api/placement/interviews/calendar/", placement_views.get_interviews_calendar_events, name='interviews_calendar'),
    path("admin/placement/", placement_views.admin_placement_dashboard, name='admin_placement_dashboard'),
    path("parent/home/", parent_views.parent_home, name='parent_home'),
    path("parent/attendance/", parent_views.parent_attendance_detail, name='parent_attendance'),
    path("parent/fees/", parent_views.parent_fee_view, name='parent_fees'),
    path("parent/results/", parent_views.parent_results_view, name='parent_results'),
    path("parent/timetable/", parent_views.parent_timetable, name='parent_timetable'),
    path("parent/feedback/", parent_views.parent_feedback, name='parent_feedback'),
    path("parent/profile/", parent_views.parent_profile, name='parent_profile'),
    # --- Settings URLs ---
    path("admin/settings/profile/", hod_views.admin_settings_profile, name='admin_settings_profile'),
    path("admin/settings/fees/", hod_views.admin_settings_fees, name='admin_settings_fees'),
    path("admin/settings/banks/", hod_views.admin_settings_banks, name='admin_settings_banks'),
    path("admin/settings/rules/", hod_views.admin_settings_rules, name='admin_settings_rules'),
    path("admin/registrations/", hod_views.view_online_registrations, name='view_online_registrations'),
    path("admin/registrations/read/<str:filename>/", hod_views.read_registration_csv, name='read_registration_csv'),
    path("admin/registrations/download/<str:filename>/", hod_views.download_registration_csv, name='download_registration_csv'),
    # --- Backoffice URLs ---
    path("backoffice/home/", backoffice_views.backoffice_home, name='backoffice_home'),
    path("backoffice/admissions/", backoffice_views.backoffice_admissions, name='backoffice_admissions'),
    path("backoffice/fees/", backoffice_views.backoffice_fees, name='backoffice_fees'),
    path("backoffice/certificates/", backoffice_views.backoffice_certificates, name='backoffice_certificates'),
    path("backoffice/certificates/<int:cert_id>/update/", backoffice_views.backoffice_update_certificate, name='backoffice_update_certificate'),
    path("backoffice/leaves/", backoffice_views.backoffice_leaves, name='backoffice_leaves'),
    path("backoffice/reports/", backoffice_views.backoffice_reports, name='backoffice_reports'),
    path("backoffice/profile/", backoffice_views.backoffice_profile, name='backoffice_profile'),
    path("admin/export_staff_analytics/", hod_views.export_staff_analytics, name='export_staff_analytics'),
    path("staff/add", hod_views.add_staff, name='add_staff'),
    path("staff/add/", hod_views.add_staff, name='add_staff_slash'),
    path("parent/add", hod_views.add_parent, name='add_parent'),
    path("course/add", hod_views.add_course, name='add_course'),
    path("course/add/", hod_views.add_course, name='add_course_slash'),
    path("send_student_notification/", hod_views.send_student_notification,
         name='send_student_notification'),
    path("send_staff_notification/", hod_views.send_staff_notification,
         name='send_staff_notification'),
    path("add_session/", hod_views.add_session, name='add_session'),
    path("session/add/", hod_views.add_session, name='add_session_slash'),
    path("admin_notify_student", hod_views.admin_notify_student,
         name='admin_notify_student'),
    path("admin_notify_staff", hod_views.admin_notify_staff,
         name='admin_notify_staff'),
    path("admin_view_profile", hod_views.admin_view_profile,
         name='admin_view_profile'),
    path("check_email_availability", hod_views.check_email_availability,
         name="check_email_availability"),
    path("session/manage/", hod_views.manage_session, name='manage_session'),
    path("session/edit/<int:session_id>",
         hod_views.edit_session, name='edit_session'),
    path("session/edit/<int:session_id>/",
         hod_views.edit_session, name='edit_session_slash'),
    path("student/view/feedback/", hod_views.student_feedback_message,
         name="student_feedback_message",),
    path("staff/view/feedback/", hod_views.staff_feedback_message,
         name="staff_feedback_message",),
    path("student/view/leave/", hod_views.view_student_leave,
         name="view_student_leave",),
    path("staff/view/leave/", hod_views.view_staff_leave, name="view_staff_leave",),
    path("attendance/view/", hod_views.admin_view_attendance,
         name="admin_view_attendance",),
    path("attendance/fetch/", hod_views.get_admin_attendance,
         name='get_admin_attendance'),
    path("student/add/", hod_views.add_student, name='add_student'),
    path("student/import/", hod_views.import_students_csv, name='import_students_csv'),
    path("subject/add/", hod_views.add_subject, name='add_subject'),
    path("staff/manage/", hod_views.manage_staff, name='manage_staff'),
    path("student/manage/", hod_views.manage_student, name='manage_student'),
    path("student/id-card/<int:student_id>/", hod_views.admin_view_student_id_card, name='admin_view_student_id_card'),
    path("parent/manage/", hod_views.manage_parent, name='manage_parent'),
    path("course/manage/", hod_views.manage_course, name='manage_course'),
    path("subject/manage/", hod_views.manage_subject, name='manage_subject'),
    path("staff/edit/<int:staff_id>", hod_views.edit_staff, name='edit_staff'),
    path("staff/delete/<int:staff_id>",
         hod_views.delete_staff, name='delete_staff'),

    path("course/delete/<int:course_id>",
         hod_views.delete_course, name='delete_course'),

    path("subject/delete/<int:subject_id>",
         hod_views.delete_subject, name='delete_subject'),

    path("session/delete/<int:session_id>",
         hod_views.delete_session, name='delete_session'),

    path("student/delete/<int:student_id>",
         hod_views.delete_student, name='delete_student'),
    path("parent/delete/<int:parent_id>",
         hod_views.delete_parent, name='delete_parent'),
    path("student/edit/<int:student_id>",
         hod_views.edit_student, name='edit_student'),
    path("student/report/<int:student_id>/",
         hod_views.admin_view_student_report, name='admin_view_student_report'),
    path("parent/edit/<int:parent_id>",
         hod_views.edit_parent, name='edit_parent'),
    path("course/edit/<int:course_id>",
         hod_views.edit_course, name='edit_course'),
    path("course/edit/<int:course_id>/",
         hod_views.edit_course, name='edit_course_slash'),
    path("subject/edit/<int:course_id>",
         hod_views.edit_subject, name='edit_subject'),

    # Student Extra Pages
    path("student/admission-letter/", hod_views.admission_letter, name='admission_letter'),
    path("student/id-cards/", hod_views.student_id_cards_admin, name='student_id_cards_admin'),
    path("student/print-basic-list/", hod_views.print_basic_list, name='print_basic_list'),
    path("student/manage-login/", hod_views.manage_login, name='manage_login'),
    path("student/report/<int:student_id>/", hod_views.admin_student_report, name='admin_student_report'),
    path("student/update-login/", hod_views.update_student_login, name='update_student_login'),
    path("student/send-login-sms/", hod_views.send_student_login_sms, name='send_student_login_sms'),
    path("student/promote/", hod_views.promote_students, name='promote_students'),


    # Staff
    path("staff/home/", staff_views.staff_home, name='staff_home'),
    path("staff/apply/leave/", staff_views.staff_apply_leave,
         name='staff_apply_leave'),
    path("staff/feedback/", staff_views.staff_feedback, name='staff_feedback'),
    path("staff/view/profile/", staff_views.staff_view_profile,
         name='staff_view_profile'),
    path("staff/attendance/take/", staff_views.staff_take_attendance,
         name='staff_take_attendance'),
    path("staff/attendance/update/", staff_views.staff_update_attendance,
         name='staff_update_attendance'),
    path("staff/parent/manage/", staff_views.staff_manage_parent,
         name='staff_manage_parent'),
    path("staff/get_students/", staff_views.get_students, name='get_students'),
     path("staff/addbook/", staff_views.add_book, name="add_book"),
    path("staff/issue_book/", staff_views.issue_book, name="issue_book"),
    path("staff/view_issued_book/", staff_views.view_issued_book, name="view_issued_book"),



    path("staff/attendance/fetch/", staff_views.get_student_attendance,
         name='get_student_attendance'),
    path("staff/attendance/save/",
         staff_views.save_attendance, name='save_attendance'),
    path("staff/attendance/update_save/",
         staff_views.update_attendance, name='update_attendance'),
    path("staff/fcmtoken/", staff_views.staff_fcmtoken, name='staff_fcmtoken'),
    path("staff/view/notification/", staff_views.staff_view_notification,
         name="staff_view_notification"),
    path("staff/result/add/", staff_views.staff_add_result, name='staff_add_result'),
    path("staff/result/edit/", EditResultView.as_view(),
         name='edit_student_result'),
    path('staff/result/fetch/', staff_views.fetch_student_result,
         name='fetch_student_result'),

    # Notification Bell API
    path("notifications/json/", views.get_notifications_json, name='get_notifications_json'),
    path("notifications/read/", views.mark_notifications_read, name='mark_notifications_read'),



    # Student
    path("student/home/", student_views.student_home, name='student_home'),
    path("student/view/attendance/", student_views.student_view_attendance,
         name='student_view_attendance'),
    path("student/apply/leave/", student_views.student_apply_leave,
         name='student_apply_leave'),
    path("student/feedback/", student_views.student_feedback,
         name='student_feedback'),
    path("student/view/profile/", student_views.student_view_profile,
         name='student_view_profile'),
    path("student/fcmtoken/", student_views.student_fcmtoken,
         name='student_fcmtoken'),
     # path('student/todo',student_views.todo,name='todo'),

     path("student/viewbooks/", student_views.view_books, name="view_books"),
     path("student/borrow-book/<str:isbn>/", student_views.borrow_book, name="borrow_book"),
     path("discussion-board/", views.discussion_board, name="discussion_board"),

    path("student/view/notification/", student_views.student_view_notification,
         name="student_view_notification"),
    path('student/view/result/', student_views.student_view_result,
         name='student_view_result'),

    # --- New ERP Modules Routes ---
    path("student/timetable/", student_views.student_timetable, name='student_timetable'),
    path("student/admission-letter-view/", student_views.student_admission_letter, name='student_admission_letter'),
    path("student/fee-slip/", student_views.student_fee_slip, name='student_fee_slip'),
    path("student/hall-ticket/", student_views.student_hall_ticket, name='student_hall_ticket'),
    path("student/payable-fees/", student_views.student_payable_fees, name='student_payable_fees'),
    path("student/fee-receipt/<int:payment_id>/", student_views.student_fee_receipt, name='student_fee_receipt'),
    path("student/print-fee/<int:fee_id>/", student_views.student_print_fee, name='student_print_fee'),
    path("student/certificates/", student_views.student_certificates, name='student_certificates'),
    path("student/certificates/request/", student_views.student_request_certificate, name='student_request_certificate'),
    path("student/placements/", student_views.student_placements, name='student_placements'),
    path("student/ai-assistant/chat/", student_views.student_ai_chat, name='student_ai_chat'),
    path("student/report-card/", student_views.student_report_card, name='student_report_card'),
    path("student/events/", student_views.student_events_calendar, name='student_events_calendar'),
    path("student/exams/", student_views.student_view_exams, name='student_view_exams'),
    path("student/exams/<int:exam_id>/take/", student_views.student_take_exam, name='student_take_exam'),
    path("student/exams/<int:exam_id>/submit/", student_views.submit_exam, name='submit_exam'),
    path("student/ai-assistant/", student_views.ai_chat_assistant, name='ai_chat_assistant'),

    # --- Online Registration Portal ---
    path("student/registration/personal/", student_views.student_reg_personal, name='student_reg_personal'),
    path("student/registration/address/", student_views.student_reg_address, name='student_reg_address'),
    path("student/registration/photo/", student_views.student_reg_photo, name='student_reg_photo'),
    path("student/registration/documents/", student_views.student_reg_documents, name='student_reg_documents'),
    path("student/registration/confirm/", student_views.student_reg_confirm, name='student_reg_confirm'),
    path("student/registration/print/", student_views.student_reg_print, name='student_reg_print'),

    # --- Event Calendar ---
    path("admin/events/", hod_views.admin_events, name='admin_events'),
    path("admin/events/delete/<int:event_id>/", hod_views.admin_delete_event, name='admin_delete_event'),

    # --- Admin ERP Management Routes ---
    path("admin/placements/", hod_views.admin_manage_placements, name='admin_manage_placements'),
    path("admin/certificates/", hod_views.admin_manage_certificates, name='admin_manage_certificates'),
    path("admin/certificates/approve/<int:req_id>/", hod_views.admin_approve_certificate, name='admin_approve_certificate'),
    path("admin/certificates/reject/<int:req_id>/", hod_views.admin_reject_certificate, name='admin_reject_certificate'),
    path("admin/fees/manage/", hod_views.admin_manage_fees, name='admin_manage_fees'),
    path("admin/fees/collect/", hod_views.admin_collect_fees, name='admin_collect_fees'),
    path("admin/fees/paid-slip/", hod_views.admin_fees_paid_slip, name='admin_fees_paid_slip'),
    path("admin/fees/defaulters/", hod_views.admin_fees_defaulters, name='admin_fees_defaulters'),
    path("admin/fees/add/", hod_views.admin_add_fee, name='admin_add_fee'),
    path("admin/fees/edit/<int:fee_id>/", hod_views.admin_edit_fee, name='admin_edit_fee'),
    path("admin/fees/print/<int:fee_id>/", hod_views.admin_print_fee, name='admin_print_fee'),
    
    # Salary
    path("admin/salary/pay/", hod_views.admin_pay_salary, name='admin_pay_salary'),
    path("admin/salary/slip/", hod_views.admin_salary_slip, name='admin_salary_slip'),
    
    # Attendance
    path("admin/attendance/students/", hod_views.admin_students_attendance, name='admin_students_attendance'),
    path("admin/attendance/employees/", hod_views.admin_employees_attendance, name='admin_employees_attendance'),
    path("admin/attendance/report/classwise/", hod_views.admin_classwise_report, name='admin_classwise_report'),
    path("admin/attendance/report/students/", hod_views.admin_students_attendance_report, name='admin_students_attendance_report'),
    path("admin/attendance/report/employees/", hod_views.admin_employees_attendance_report, name='admin_employees_attendance_report'),

    # Homework
    path("admin/homework/", hod_views.admin_homework, name='admin_homework'),
    
    # Live Class
    path("admin/live-class/", hod_views.admin_live_class, name='admin_live_class'),
    
    # Exams
    path("admin/exams/create/", hod_views.admin_create_exam, name='admin_create_exam'),
    path("admin/exams/update-marks/", hod_views.admin_update_exam_marks, name='admin_update_exam_marks'),
    path("admin/exams/result-card/", hod_views.admin_result_card, name='admin_result_card'),

    # Class Tests
    path("admin/class-tests/marks/", hod_views.admin_test_marks, name='admin_test_marks'),
    path("admin/class-tests/results/", hod_views.admin_test_results, name='admin_test_results'),

    # Reports
    path("admin/reports/students-info/", hod_views.admin_students_info_report, name='admin_students_info_report'),

    # Certificates
    path("admin/certificates/generate/", hod_views.admin_certificates, name='admin_certificates'),

    # General Settings
    path("admin/settings/account/", hod_views.admin_account_settings, name='admin_settings_account'),
    path("admin/settings/profile/", hod_views.admin_institute_profile, name='admin_settings_profile'),
    path("admin/settings/fees-structure/", hod_views.admin_settings_fees_structure, name='admin_settings_fees_structure'),
    path("admin/settings/discount-type/", hod_views.admin_settings_discount_type, name='admin_settings_discount_type'),
    path("admin/settings/banks/", hod_views.admin_settings_banks, name='admin_settings_banks'),
    path("admin/staff/id-cards/", hod_views.admin_staff_id_cards, name='admin_staff_id_cards'),
    path("admin/question-bank/", hod_views.admin_question_bank, name='admin_question_bank'),
    path("admin/result-sheet/", hod_views.admin_result_sheet, name='admin_result_sheet'),
    path("admin/exam-schedule/", hod_views.admin_exam_schedule, name='admin_exam_schedule'),
    path("admin/date-sheet/", hod_views.admin_date_sheet, name='admin_date_sheet'),
    path("admin/blank-award-list/", hod_views.admin_blank_award_list, name='admin_blank_award_list'),

    # Messaging
    path("admin/messaging/", hod_views.admin_messaging, name='admin_messaging'),

    path("admin/staff/login-credentials/", hod_views.admin_staff_login_credentials, name='admin_staff_login_credentials'),
    path("admin/timetable/", hod_views.admin_manage_timetable, name='admin_manage_timetable'),
    path("admin/timetable/add/", hod_views.admin_add_timetable_slot, name='admin_add_timetable_slot'),
    path("admin/registrations/", hod_views.admin_manage_registrations, name='admin_manage_registrations'),
    path("admin/registrations/view/<int:reg_id>/", hod_views.admin_view_registration, name='admin_view_registration'),
    path("admin/registrations/edit/<int:reg_id>/", hod_views.admin_edit_registration, name='admin_edit_registration'),
    path("admin/registrations/delete/<int:reg_id>/", hod_views.admin_delete_registration, name='admin_delete_registration'),

    # --- Staff ERP Routes ---
    path("staff/timetable/", staff_views.staff_view_timetable, name='staff_view_timetable'),
    path("staff/registrations/", staff_views.staff_manage_registrations, name='staff_manage_registrations'),
    path("staff/registrations/view/<int:reg_id>/", staff_views.staff_view_registration, name='staff_view_registration'),
    path("staff/events/", staff_views.staff_events_calendar, name='staff_events_calendar'),
    path("staff/exams/", staff_views.staff_manage_exams, name='staff_manage_exams'),
    path("staff/exams/create/", staff_views.staff_create_exam, name='staff_create_exam'),
    path("staff/exams/<int:exam_id>/add_question/", staff_views.staff_add_question, name='staff_add_question'),

    # --- Staff LMS Routes ---
    path("staff/lms/", staff_views.staff_lms_home, name='staff_lms_home'),
    path("staff/lms/courses/add/", staff_views.staff_add_course, name='staff_add_course'),
    path("staff/lms/courses/<int:course_id>/lessons/", staff_views.staff_manage_lessons, name='staff_manage_lessons'),
    path("staff/lms/assignments/add/", staff_views.staff_add_assignment, name='staff_add_assignment'),
    path("staff/lms/assignments/<int:assignment_id>/submissions/", staff_views.staff_view_submissions, name='staff_view_submissions'),
    path("staff/lms/materials/add/", staff_views.staff_add_material, name='staff_add_material'),

    # --- Student LMS Routes ---
    path("student/lms/", student_views.student_lms_home, name='student_lms_home'),
    path("student/lms/course/<int:course_id>/", student_views.student_view_course, name='student_view_course'),
    path("student/lms/lesson/<int:lesson_id>/", student_views.student_watch_lesson, name='student_watch_lesson'),
    path("student/lms/assignments/", student_views.student_assignments, name='student_assignments'),
    path("student/lms/assignments/<int:assignment_id>/submit/", student_views.student_submit_assignment, name='student_submit_assignment'),
    path("student/lms/materials/", student_views.student_materials, name='student_materials'),

    # --- Live Virtual Classrooms (Version 2.5) ---
    # Staff routes
    path("staff/live_classes/", staff_views.staff_live_classes, name='staff_live_classes'),
    path("staff/live_classes/schedule/", staff_views.staff_schedule_live_class, name='staff_schedule_live_class'),
    path("staff/live_classes/host/<int:class_id>/", staff_views.staff_host_live_class, name='staff_host_live_class'),
    path("staff/live_classes/end/<int:class_id>/", staff_views.staff_end_live_class, name='staff_end_live_class'),
    # Student routes
    path("student/live_classes/", student_views.student_live_classes, name='student_live_classes'),
    path("student/live_classes/join/<int:class_id>/", student_views.student_join_live_class, name='student_join_live_class'),
    path("student/live_classes/leave/<int:class_id>/", student_views.student_leave_live_class, name='student_leave_live_class'),
    
    # --- Online Store ---
    path("student/store/", student_views.student_online_store, name='student_online_store'),
    path("student/homework/", student_views.student_homework, name='student_homework'),
    path("student/test-results/", student_views.student_test_results, name='student_test_results'),
    path("student/report-card/", student_views.student_report_card, name='student_report_card'),
    path("student/report-card/pdf/", student_views.student_report_card_pdf, name='student_report_card_pdf'),

    # --- Communication (Version 3.0) ---
    path("chat/", chat_views.chat_home, name='chat_home'),
    path("chat/send/", chat_views.send_chat_message, name='send_chat_message'),
    path("chat/fetch/", chat_views.get_chat_messages, name='get_chat_messages'),
    path("announcements/", chat_views.announcements_board, name='announcements_board'),
    path("announcements/post/", chat_views.post_announcement, name='post_announcement'),
    path("whatsapp/", chat_views.whatsapp_center, name='whatsapp_center'),
    path("whatsapp/admin/", chat_views.whatsapp_center, name='admin_whatsapp'),

    # --- Smart Campus (Version 3.5) ---
    path("student/id-card/", smart_views.student_id_card, name='student_id_card'),
    path("staff/id-card/", smart_views.staff_id_card, name='staff_id_card'),
    path("student/id-card/qr/<int:student_id>/", smart_views.generate_student_qr, name='generate_student_qr'),
    path("staff/id-card/qr/<int:staff_id>/", smart_views.generate_staff_qr, name='generate_staff_qr'),
    
    path("staff/scanner/", smart_views.staff_scanner_desk, name='staff_scanner_desk'),
    path("staff/scanner/attendance/", smart_views.scan_attendance_qr, name='scan_attendance_qr'),
    path("staff/scanner/library/", smart_views.scan_library_qr, name='scan_library_qr'),
    
    path("visitor/request/", smart_views.visitor_pass_request, name='visitor_pass_request'),
    path("admin/visitors/", smart_views.admin_visitor_passes, name='admin_visitor_passes'),
    path("staff/scanner/visitor/", smart_views.verify_visitor_pass, name='verify_visitor_pass'),
    
    # Batch Management & Print ID Cards
    path("admin/batches/", hod_views.admin_manage_batches, name='admin_manage_batches'),
    path("admin/verification-center/", hod_views.admin_verification_center, name='admin_verification_center'),
    path("admin/batches/promote/", hod_views.admin_promote_batch, name='admin_promote_batch'),
    path("admin/batches/print-ids/", hod_views.admin_print_batch_ids, name='admin_print_batch_ids'),
    path("admin/students/print-ids/", hod_views.print_batch_id_cards, name='print_batch_id_cards'),
    path("staff/id-card/<int:staff_id>/", hod_views.admin_view_staff_id_card, name='admin_view_staff_id_card'),

    # --- AI Suite (Version 4.0) ---
    path("student/resume-builder/", ai_views.student_resume_builder, name='student_resume_builder'),
    path("student/ai-quiz/", ai_views.student_ai_quiz, name='student_ai_quiz'),
    
    path("staff/ai-paper/", ai_views.staff_generate_paper, name='staff_generate_paper'),
    path("staff/ai-timetable/", ai_views.staff_generate_timetable, name='staff_generate_timetable'),
    path("staff/ai-grade/", ai_views.staff_ai_grade_assignment, name='staff_ai_grade_assignment'),
    path("api/ai/format-address/", ai_views.ai_format_address, name='ai_format_address'),
    path("api/ai/helpdesk-chat/", ai_views.ai_helpdesk_chat, name='ai_helpdesk_chat'),
    path("api/ai/predictive-analytics/", ai_views.predictive_analytics_api, name='predictive_analytics_api'),
    path("api/ai/predictive-analytics/<int:student_id>/", ai_views.predictive_analytics_api, name='predictive_analytics_student'),
    path("api/ai/receipt-fraud-audit/<int:payment_id>/", ai_views.receipt_fraud_audit_api, name='receipt_fraud_audit_api'),
    

    # --- Settings Tabs ---
    path("admin/settings/grading/", hod_views.admin_settings_grading, name='admin_settings_grading'),
    path("admin/settings/rules/", hod_views.admin_settings_rules, name='admin_settings_rules'),
    path("admin/settings/theme/", hod_views.admin_settings_theme, name='admin_settings_theme'),
    path("admin/settings/account/", hod_views.admin_settings_account, name='admin_settings_account'),
    
    # --- Generic Feature Coming Soon Route ---
    path("feature/<str:feature_name>/", hod_views.feature_coming_soon, name='feature_coming_soon'),

    # --- Staff Job Letter ---
    path("admin/staff/job-letter/", hod_views.admin_job_letter, name='admin_job_letter'),
    path("admin/staff/job-letter/print/<int:staff_id>/", hod_views.admin_print_job_letter, name='admin_print_job_letter'),
    path("admin/staff/login-credentials/", hod_views.admin_staff_login_credentials, name='admin_staff_login_credentials'),

    # --- Administration Features ---
    path("admin/manage_queries/", hod_views.manage_queries, name='manage_queries'),
    path("admin/manage_complaints/", hod_views.manage_complaints, name='manage_complaints'),
    path("admin/manage_postal/", hod_views.manage_postal, name='manage_postal'),
    path("admin/manage_call_logs/", hod_views.manage_call_logs, name='manage_call_logs'),

    # --- Behaviour/Incidents Features ---
    path("admin/manage_incidents/", hod_views.manage_incidents, name='manage_incidents'),
    path("admin/student_behaviour_records/", hod_views.student_behaviour_records, name='student_behaviour_records'),

    # --- Certificate Templates ---
    path("admin/manage_certificate_templates/", hod_views.manage_certificate_templates, name='manage_certificate_templates'),


]
