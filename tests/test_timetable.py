import datetime

import pytest
from apps.academics.models import AcademicSession, Department
from apps.academics.models import Faculty as FacultyDept
from apps.academics.models import Program, Semester, Subject
from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.timetable.models import Building, Classroom, TimeSlot
from apps.timetable.services import TimetableService
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestTimetableModule:
    @pytest.fixture(autouse=True)
    def setup_data(self):
        self.user = User.objects.create_superuser(
            email="admin@college.edu", password="AdminPassword123!", first_name="Admin", last_name="User"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Academics
        self.fac_dept = FacultyDept.objects.create(name="School of Engineering", code="ENG")
        self.dept = Department.objects.create(name="Computer Science", code="CS", faculty=self.fac_dept)
        self.program = Program.objects.create(
            name="B.Tech Computer Science", code="BSCS", department=self.dept, degree_level="bachelor"
        )
        self.semester1 = Semester.objects.create(program=self.program, semester_number=1, name="Semester 1")
        self.session = AcademicSession.objects.create(
            name="2026-2027", start_date=datetime.date(2026, 8, 1), end_date=datetime.date(2027, 5, 31), is_current=True
        )
        self.subject = Subject.objects.create(name="Data Structures", code="CS101", semester=self.semester1, credits=4)

        # Faculty Employee
        self.fac_user = User.objects.create_user(
            email="prof.john@college.edu", password="Password123!", first_name="John", last_name="Prof"
        )
        self.fac_profile, _ = UserProfile.objects.get_or_create(
            user=self.fac_user, defaults={"first_name": "John", "last_name": "Prof"}
        )
        self.designation = Designation.objects.create(name="Assistant Professor", code="ASST_PROF")
        self.faculty_emp = Employee.objects.create(
            employee_id="EMP-2026-00001",
            employee_number="EMP001",
            profile=self.fac_profile,
            department=self.dept,
            designation=self.designation,
            employment_type="full_time",
            joining_date=datetime.date(2026, 1, 1),
        )

        # Buildings, Classrooms, TimeSlots
        self.building = Building.objects.create(name="Science Block", code="SB", address="North Campus")
        self.classroom = Classroom.objects.create(
            building=self.building, room_number="101", capacity=60, floor=1, room_type="classroom"
        )
        self.classroom2 = Classroom.objects.create(
            building=self.building, room_number="102", capacity=40, floor=1, room_type="laboratory"
        )
        self.timeslot = TimeSlot.objects.create(
            day="Monday", start_time=datetime.time(9, 0), end_time=datetime.time(10, 0), period_number=1
        )
        self.timeslot2 = TimeSlot.objects.create(
            day="Monday", start_time=datetime.time(10, 0), end_time=datetime.time(11, 0), period_number=2
        )

    def test_building_classroom_timeslot_crud(self):
        # Building CRUD via API
        url_bld = reverse("building-list")
        res_bld = self.client.get(url_bld)
        assert res_bld.status_code == status.HTTP_200_OK

        # Classroom CRUD via API
        url_room = reverse("classroom-list")
        res_room = self.client.get(url_room)
        assert res_room.status_code == status.HTTP_200_OK

        # TimeSlot CRUD via API
        url_slot = reverse("timeslot-list")
        res_slot = self.client.get(url_slot)
        assert res_slot.status_code == status.HTTP_200_OK

    def test_timetable_creation_and_conflict_engine(self):
        data = {
            "academic_session": self.session,
            "program": self.program,
            "semester": self.semester1,
            "subject": self.subject,
            "faculty": self.faculty_emp,
            "classroom": self.classroom,
            "time_slot": self.timeslot,
            "batch": "all",
            "effective_from": datetime.date(2026, 8, 1),
            "status": "active",
        }
        entry = TimetableService.create(data, actor=self.user)
        assert entry.status == "active"
        assert entry.subject == self.subject

        # Attempt 1: Faculty Double-Booking Clash (Same faculty, same slot, different room)
        data_fac_clash = {
            "academic_session": self.session,
            "program": self.program,
            "semester": self.semester1,
            "subject": self.subject,
            "faculty": self.faculty_emp,
            "classroom": self.classroom2,
            "time_slot": self.timeslot,
            "batch": "all",
            "effective_from": datetime.date(2026, 8, 1),
            "status": "active",
        }
        with pytest.raises(ValueError, match="Faculty is already assigned"):
            TimetableService.create(data_fac_clash, actor=self.user)

        # Attempt 2: Classroom Double-Booking Clash (Different faculty, same room, same slot)
        fac_user2 = User.objects.create_user(
            email="prof.alice@college.edu", password="Password123!", first_name="Alice", last_name="Prof"
        )
        fac_profile2, _ = UserProfile.objects.get_or_create(
            user=fac_user2, defaults={"first_name": "Alice", "last_name": "Prof"}
        )
        faculty_emp2 = Employee.objects.create(
            employee_id="EMP-2026-00002",
            employee_number="EMP002",
            profile=fac_profile2,
            department=self.dept,
            designation=self.designation,
            employment_type="full_time",
            joining_date=datetime.date(2026, 1, 1),
        )

        data_room_clash = {
            "academic_session": self.session,
            "program": self.program,
            "semester": self.semester1,
            "subject": self.subject,
            "faculty": faculty_emp2,
            "classroom": self.classroom,
            "time_slot": self.timeslot,
            "batch": "all",
            "effective_from": datetime.date(2026, 8, 1),
            "status": "active",
        }
        with pytest.raises(ValueError, match="Classroom is already occupied"):
            TimetableService.create(data_room_clash, actor=self.user)

    def test_schedules_queries(self):
        data = {
            "academic_session": self.session,
            "program": self.program,
            "semester": self.semester1,
            "subject": self.subject,
            "faculty": self.faculty_emp,
            "classroom": self.classroom,
            "time_slot": self.timeslot,
            "batch": "all",
            "effective_from": datetime.date(2026, 8, 1),
            "status": "active",
        }
        TimetableService.create(data, actor=self.user)

        # Faculty Schedule
        fac_entries = TimetableService.faculty_schedule(str(self.faculty_emp.id))
        assert len(fac_entries) == 1

        # Student Schedule
        std_entries = TimetableService.student_schedule(str(self.program.id), str(self.semester1.id))
        assert len(std_entries) == 1

        # Room Schedule
        room_entries = TimetableService.room_schedule(str(self.classroom.id))
        assert len(room_entries) == 1

        # Weekly Schedule
        weekly_entries = TimetableService.weekly_schedule(str(self.session.id))
        assert len(weekly_entries) == 1
