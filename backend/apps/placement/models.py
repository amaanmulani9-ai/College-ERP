"""
Enterprise Placement & Career Development System Models
=========================================================
Covers Company, CompanyContact, CampusDrive, DriveEligibility, StudentApplication,
Shortlist, InterviewSchedule, InterviewRound, InterviewFeedback, OfferLetter,
OfferAcceptance, Internship, InternshipEvaluation, PlacementRecord, PlacementStatistics,
PlacementEvent, CareerCounselling, Resume, ResumeReview, MockInterview, and PlacementAuditLog.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.students.models import Student
from apps.academics.models import Department, Program


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Corporate Recruiters & Contacts
# ---------------------------------------------------------------------------
class Company(models.Model):
    STATUS_CHOICES = [
        ("active", "Active Recruiter"),
        ("inactive", "Inactive"),
        ("blacklisted", "Blacklisted"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_code = models.CharField(max_length=50, unique=True, db_index=True)
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, default="Information Technology")
    website = models.CharField(max_length=200, blank=True, default="")
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, default="")
    package_range = models.CharField(max_length=100, default="6.0 LPA - 12.0 LPA")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)
    
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["company_name"]
        verbose_name = "Recruiting Company"
        verbose_name_plural = "Recruiting Companies"

    def __str__(self):
        return f"{self.company_name} [{self.company_code}]"


class CompanyContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=150)
    designation = models.CharField(max_length=100, default="HR Manager")
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    class Meta:
        verbose_name = "Company Contact"
        verbose_name_plural = "Company Contacts"

    def __str__(self):
        return f"{self.name} ({self.company.company_name})"


# ---------------------------------------------------------------------------
# Campus Recruitment Drives & Eligibility
# ---------------------------------------------------------------------------
class CampusDrive(models.Model):
    MODE_CHOICES = [
        ("Online", "Online"),
        ("Offline", "Offline"),
        ("Hybrid", "Hybrid"),
    ]

    STATUS_CHOICES = [
        ("Upcoming", "Upcoming"),
        ("Registration Open", "Registration Open"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    drive_code = models.CharField(max_length=50, unique=True, db_index=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="drives")
    campus = models.CharField(max_length=150, default="Main Campus")
    job_role = models.CharField(max_length=200)
    ctc = models.DecimalField(max_digits=12, decimal_places=2, default=800000.00)
    location = models.CharField(max_length=200, default="Pan India / Remote")
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default="Online")
    registration_start = models.DateField()
    registration_end = models.DateField()
    drive_date = models.DateField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Registration Open", db_index=True)
    description = models.TextField(blank=True, default="")
    
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-drive_date"]
        verbose_name = "Campus Drive"
        verbose_name_plural = "Campus Drives"

    def __str__(self):
        return f"{self.company.company_name} - {self.job_role} [{self.drive_code}]"


class DriveEligibility(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    drive = models.OneToOneField(CampusDrive, on_delete=models.CASCADE, related_name="eligibility")
    minimum_cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=6.00)
    allowed_departments = models.JSONField(default=list, blank=True)
    allowed_programs = models.JSONField(default=list, blank=True)
    backlog_limit = models.PositiveIntegerField(default=0)
    passing_year = models.PositiveIntegerField(default=2026)

    class Meta:
        verbose_name = "Drive Eligibility"
        verbose_name_plural = "Drive Eligibilities"

    def __str__(self):
        return f"Eligibility: {self.drive.drive_code} (Min CGPA: {self.minimum_cgpa})"


# ---------------------------------------------------------------------------
# Applications & Shortlisting
# ---------------------------------------------------------------------------
class Resume(models.Model):
    APPROVAL_CHOICES = [
        ("Draft", "Draft"),
        ("Approved", "Approved"),
        ("Needs Revision", "Needs Revision"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="resumes")
    version = models.CharField(max_length=50, default="v1.0")
    skills = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default="Draft")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"Resume {self.version} - {self.student.student_id}"


class StudentApplication(models.Model):
    STATUS_CHOICES = [
        ("Applied", "Applied"),
        ("Shortlisted", "Shortlisted"),
        ("Interview", "Interview"),
        ("Selected", "Selected"),
        ("Rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="placement_applications")
    campus_drive = models.ForeignKey(CampusDrive, on_delete=models.CASCADE, related_name="applications")
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Applied", db_index=True)
    applied_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "campus_drive")
        ordering = ["-applied_date"]
        verbose_name = "Student Application"
        verbose_name_plural = "Student Applications"

    def __str__(self):
        return f"{self.student.student_id} -> {self.campus_drive.drive_code} [{self.status}]"


class Shortlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus_drive = models.ForeignKey(CampusDrive, on_delete=models.CASCADE, related_name="shortlists")
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    round_number = models.PositiveIntegerField(default=1)
    shortlisted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Shortlist"
        verbose_name_plural = "Shortlists"

    def __str__(self):
        return f"Shortlist: R{self.round_number} - {self.student.student_id}"


# ---------------------------------------------------------------------------
# Interview Schedules & Feedback
# ---------------------------------------------------------------------------
class InterviewSchedule(models.Model):
    MODE_CHOICES = [
        ("Online", "Online"),
        ("Offline", "Offline"),
        ("Hybrid", "Hybrid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="interviews")
    drive = models.ForeignKey(CampusDrive, on_delete=models.CASCADE, related_name="interviews")
    round = models.CharField(max_length=100, default="Round 1 - Technical")
    date = models.DateField()
    time = models.TimeField()
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default="Online")
    panel = models.CharField(max_length=200, default="Technical Panel A")
    location_or_link = models.CharField(max_length=300, blank=True, default="https://meet.google.com/xyz-abc")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "time"]
        verbose_name = "Interview Schedule"
        verbose_name_plural = "Interview Schedules"

    def __str__(self):
        return f"Interview: {self.student.student_id} ({self.round}) on {self.date}"


class InterviewRound(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    drive = models.ForeignKey(CampusDrive, on_delete=models.CASCADE, related_name="rounds")
    round_name = models.CharField(max_length=100)
    round_order = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["round_order"]
        verbose_name = "Interview Round"
        verbose_name_plural = "Interview Rounds"

    def __str__(self):
        return f"{self.round_name} (Order: {self.round_order})"


class InterviewFeedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interview_schedule = models.OneToOneField(InterviewSchedule, on_delete=models.CASCADE, related_name="feedback")
    round = models.CharField(max_length=100)
    communication = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    technical = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    hr = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    overall_rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    remarks = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Interview Feedback"
        verbose_name_plural = "Interview Feedbacks"

    def __str__(self):
        return f"Feedback: {self.interview_schedule.student.student_id} Rating: {self.overall_rating}"


# ---------------------------------------------------------------------------
# Offers & Internships
# ---------------------------------------------------------------------------
class OfferLetter(models.Model):
    STATUS_CHOICES = [
        ("Offered", "Offered"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Expired", "Expired"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    offer_number = models.CharField(max_length=50, unique=True, db_index=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="offers")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="offers")
    campus_drive = models.ForeignKey(CampusDrive, on_delete=models.SET_NULL, null=True, blank=True)
    package = models.DecimalField(max_digits=12, decimal_places=2, default=800000.00)
    joining_date = models.DateField()
    offer_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Offered", db_index=True)
    document_url = models.CharField(max_length=300, blank=True, default="/media/offers/placeholder.pdf")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Offer Letter"
        verbose_name_plural = "Offer Letters"

    def __str__(self):
        return f"Offer {self.offer_number}: {self.student.student_id} @ {self.company.company_name}"


class OfferAcceptance(models.Model):
    STATUS_CHOICES = [
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Pending", "Pending"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    offer_letter = models.OneToOneField(OfferLetter, on_delete=models.CASCADE, related_name="acceptance")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    acceptance_date = models.DateField(null=True, blank=True)
    remarks = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Offer Acceptance"
        verbose_name_plural = "Offer Acceptances"

    def __str__(self):
        return f"Acceptance: {self.offer_letter.offer_number} [{self.status}]"


class Internship(models.Model):
    STATUS_CHOICES = [
        ("Ongoing", "Ongoing"),
        ("Completed", "Completed"),
        ("Terminated", "Terminated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="internships")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="internships")
    title = models.CharField(max_length=150, default="Software Engineering Intern")
    mentor = models.CharField(max_length=150, default="Corporate Industry Mentor")
    start_date = models.DateField()
    end_date = models.DateField()
    duration = models.CharField(max_length=50, default="6 Months")
    stipend = models.DecimalField(max_digits=10, decimal_places=2, default=25000.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Ongoing")

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Internship"
        verbose_name_plural = "Internships"

    def __str__(self):
        return f"Internship: {self.student.student_id} @ {self.company.company_name}"


class InternshipEvaluation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    internship = models.OneToOneField(Internship, on_delete=models.CASCADE, related_name="evaluation")
    performance = models.CharField(max_length=50, default="Excellent")
    attendance = models.DecimalField(max_digits=5, decimal_places=2, default=95.00)
    certificate = models.CharField(max_length=300, blank=True, default="/media/internships/cert.pdf")
    remarks = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Internship Evaluation"
        verbose_name_plural = "Internship Evaluations"

    def __str__(self):
        return f"Evaluation: {self.internship.student.student_id} [{self.performance}]"


# ---------------------------------------------------------------------------
# Records, Statistics & Events
# ---------------------------------------------------------------------------
class PlacementRecord(models.Model):
    STATUS_CHOICES = [
        ("Joined", "Joined"),
        ("Deferred", "Deferred"),
        ("Declined", "Declined"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="placement_records")
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    role = models.CharField(max_length=150)
    package = models.DecimalField(max_digits=12, decimal_places=2)
    joining_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Joined")

    class Meta:
        ordering = ["-package"]
        verbose_name = "Placement Record"
        verbose_name_plural = "Placement Records"

    def __str__(self):
        return f"Placed: {self.student.student_id} @ {self.company.company_name} (₹{self.package})"


class PlacementStatistics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    academic_year = models.CharField(max_length=50, unique=True)
    placed_students = models.PositiveIntegerField(default=0)
    highest_package = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    average_package = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    companies_visited = models.PositiveIntegerField(default=0)
    offers_made = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-academic_year"]
        verbose_name = "Placement Statistics"
        verbose_name_plural = "Placement Statistics"

    def __str__(self):
        return f"Stats {self.academic_year}: Placed {self.placed_students} (Avg CTC: ₹{self.average_package})"


class PlacementEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_name = models.CharField(max_length=200)
    event_type = models.CharField(max_length=50, default="Pre-Placement Talk")
    date = models.DateField()
    venue = models.CharField(max_length=200, default="Auditorium Hall B")
    organizer = models.CharField(max_length=150, default="T&P Cell")

    class Meta:
        ordering = ["-date"]
        verbose_name = "Placement Event"
        verbose_name_plural = "Placement Events"

    def __str__(self):
        return f"Event: {self.event_name} on {self.date}"


# ---------------------------------------------------------------------------
# Counselling, Resume Review & Mock Interviews
# ---------------------------------------------------------------------------
class CareerCounselling(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="counselling_sessions")
    counsellor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_date = models.DateField()
    topic = models.CharField(max_length=200, default="Career Guidance & Domain Alignment")
    remarks = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["-session_date"]
        verbose_name = "Career Counselling"
        verbose_name_plural = "Career Counselling Sessions"

    def __str__(self):
        return f"Counselling: {self.student.student_id} on {self.session_date}"


class ResumeReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    suggestions = models.TextField()
    score = models.DecimalField(max_digits=4, decimal_places=1, default=8.5)

    class Meta:
        verbose_name = "Resume Review"
        verbose_name_plural = "Resume Reviews"

    def __str__(self):
        return f"Review Score: {self.score} for {self.resume.student.student_id}"


class MockInterview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="mock_interviews")
    faculty = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    technical_score = models.DecimalField(max_digits=4, decimal_places=1, default=8.0)
    hr_score = models.DecimalField(max_digits=4, decimal_places=1, default=8.5)
    remarks = models.TextField(blank=True, default="")
    date = models.DateField()

    class Meta:
        ordering = ["-date"]
        verbose_name = "Mock Interview"
        verbose_name_plural = "Mock Interviews"

    def __str__(self):
        return f"Mock Interview: {self.student.student_id} (Tech: {self.technical_score})"


class PlacementAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Placement Audit Log"
        verbose_name_plural = "Placement Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] Action: {self.action}"
