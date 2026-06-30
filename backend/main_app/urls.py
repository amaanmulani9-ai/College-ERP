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

from . import hod_views, staff_views, student_views, parent_views, views

urlpatterns = [
    path("", views.login_page, name='login_page'),
    path('offline/', views.offline, name='offline'),
    path("get_attendance", views.get_attendance, name='get_attendance'),
    path("firebase-messaging-sw.js", views.showFirebaseJS, name='showFirebaseJS'),
    path("doLogin/", views.doLogin, name='doLogin'),
    path("logout_user/", views.logout_user, name='logout_user'),
    path("admin/home/", hod_views.admin_home, name='admin_home'),
    path("parent/home/", parent_views.parent_home, name='parent_home'),
    path("admin/export_staff_analytics/", hod_views.export_staff_analytics, name='export_staff_analytics'),
    path("staff/add", hod_views.add_staff, name='add_staff'),
    path("parent/add", hod_views.add_parent, name='add_parent'),
    path("course/add", hod_views.add_course, name='add_course'),
    path("send_student_notification/", hod_views.send_student_notification,
         name='send_student_notification'),
    path("send_staff_notification/", hod_views.send_staff_notification,
         name='send_staff_notification'),
    path("add_session/", hod_views.add_session, name='add_session'),
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
    path("subject/add/", hod_views.add_subject, name='add_subject'),
    path("staff/manage/", hod_views.manage_staff, name='manage_staff'),
    path("student/manage/", hod_views.manage_student, name='manage_student'),
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
    path("parent/edit/<int:parent_id>",
         hod_views.edit_parent, name='edit_parent'),
    path("course/edit/<int:course_id>",
         hod_views.edit_course, name='edit_course'),
    path("subject/edit/<int:subject_id>",
         hod_views.edit_subject, name='edit_subject'),


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
    path("admin/fees/", hod_views.admin_manage_fees, name='admin_manage_fees'),
    path("admin/fees/add/", hod_views.admin_add_fee, name='admin_add_fee'),
    path("admin/fees/edit/<int:fee_id>/", hod_views.admin_edit_fee, name='admin_edit_fee'),
    path("admin/fees/print/<int:fee_id>/", hod_views.admin_print_fee, name='admin_print_fee'),
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
]
