"""
Enterprise Alumni Management System Models
============================================
Covers AlumniProfile, AlumniMembership, AlumniEmployment, AlumniAchievement,
AlumniHigherEducation, AlumniBusiness, MentorshipProgram, MentorAssignment,
AlumniEvent, EventRegistration, AlumniChapter, Donation, FundraisingCampaign,
Newsletter, CommunicationLog, SuccessStory, JobReferral, NetworkingRequest,
AlumniDirectory, and AlumniAuditLog.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.students.models import Student


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# 1. Alumni Profile & Membership
# ---------------------------------------------------------------------------
class AlumniProfile(models.Model):
    STATUS_CHOICES = [
        ("Employed", "Employed"),
        ("Higher Studies", "Higher Studies"),
        ("Entrepreneur", "Entrepreneur"),
        ("Unemployed", "Seeking Opportunities"),
        ("Other", "Other"),
    ]

    VISIBILITY_CHOICES = [
        ("Public", "Public Directory"),
        ("Members Only", "Verified Members Only"),
        ("Private", "Private"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni_id = models.CharField(max_length=50, unique=True, db_index=True)
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="alumni_profile")
    graduation_year = models.PositiveIntegerField(default=2024, db_index=True)
    current_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Employed")
    profile_photo = models.CharField(max_length=300, blank=True, default="/media/alumni/default.png")
    bio = models.TextField(blank=True, default="")
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default="Public")
    
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-graduation_year", "alumni_id"]
        verbose_name = "Alumni Profile"
        verbose_name_plural = "Alumni Profiles"

    def __str__(self):
        return f"Alumni [{self.alumni_id}] - {self.student.student_id} (Batch {self.graduation_year})"


class AlumniMembership(models.Model):
    TYPE_CHOICES = [
        ("Standard", "Standard Member"),
        ("Premium", "Premium Member"),
        ("Lifetime", "Lifetime Patron"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Expired", "Expired"),
        ("Suspended", "Suspended"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="memberships")
    membership_number = models.CharField(max_length=50, unique=True, db_index=True)
    membership_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="Standard")
    join_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active", db_index=True)

    class Meta:
        ordering = ["-join_date"]
        verbose_name = "Alumni Membership"
        verbose_name_plural = "Alumni Memberships"

    def __str__(self):
        return f"{self.membership_number} ({self.membership_type}) - {self.alumni.alumni_id}"


# ---------------------------------------------------------------------------
# 2. Employment, Achievements, Higher Ed & Ventures
# ---------------------------------------------------------------------------
class AlumniEmployment(models.Model):
    STATUS_CHOICES = [
        ("Full-Time", "Full-Time"),
        ("Part-Time", "Part-Time"),
        ("Contract", "Contract"),
        ("Self-Employed", "Self-Employed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="employments")
    company = models.CharField(max_length=200)
    designation = models.CharField(max_length=150)
    industry = models.CharField(max_length=100, default="Technology")
    location = models.CharField(max_length=150, default="Remote / Global")
    salary_range = models.CharField(max_length=100, blank=True, default="15.0 LPA - 25.0 LPA")
    employment_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Full-Time")
    start_date = models.DateField()
    is_current = models.BooleanField(default=True)

    class Meta:
        ordering = ["-is_current", "-start_date"]
        verbose_name = "Alumni Employment"
        verbose_name_plural = "Alumni Employment History"

    def __str__(self):
        return f"{self.designation} @ {self.company} ({self.alumni.alumni_id})"


class AlumniAchievement(models.Model):
    CATEGORY_CHOICES = [
        ("Awards", "Awards & Honors"),
        ("Patents", "Patents & Innovations"),
        ("Publications", "Research Publications"),
        ("Leadership", "Executive Leadership"),
        ("Community", "Social & Community Impact"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="achievements")
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="Awards")
    description = models.TextField(blank=True, default="")
    achievement_date = models.DateField()
    recognition = models.CharField(max_length=200, blank=True, default="National / International Recognition")

    class Meta:
        ordering = ["-achievement_date"]
        verbose_name = "Alumni Achievement"
        verbose_name_plural = "Alumni Achievements"

    def __str__(self):
        return f"Achievement: {self.title} ({self.alumni.alumni_id})"


class AlumniHigherEducation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="higher_education")
    university = models.CharField(max_length=200)
    program = models.CharField(max_length=150, default="M.S. Computer Science")
    country = models.CharField(max_length=100, default="United States")
    start_year = models.PositiveIntegerField(default=2024)
    completion_year = models.PositiveIntegerField(default=2026)

    class Meta:
        ordering = ["-completion_year"]
        verbose_name = "Alumni Higher Education"
        verbose_name_plural = "Alumni Higher Education History"

    def __str__(self):
        return f"{self.program} @ {self.university} ({self.country})"


class AlumniBusiness(models.Model):
    STAGE_CHOICES = [
        ("Ideation", "Ideation / Pre-Seed"),
        ("Early Stage", "Early Stage / Seed Funded"),
        ("Growth", "Growth / Series A+"),
        ("Established", "Established Enterprise"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="businesses")
    business_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, default="Fintech / Artificial Intelligence")
    website = models.CharField(max_length=200, blank=True, default="https://startup.io")
    startup_stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default="Early Stage")

    class Meta:
        verbose_name = "Alumni Venture / Business"
        verbose_name_plural = "Alumni Ventures & Startups"

    def __str__(self):
        return f"Venture: {self.business_name} ({self.startup_stage})"


# ---------------------------------------------------------------------------
# 3. Mentorship Programs & Assignments
# ---------------------------------------------------------------------------
class MentorshipProgram(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("Completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    capacity = models.PositiveIntegerField(default=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    class Meta:
        verbose_name = "Mentorship Program"
        verbose_name_plural = "Mentorship Programs"

    def __str__(self):
        return f"Program: {self.program_name} [{self.status}]"


class MentorAssignment(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("Terminated", "Terminated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(MentorshipProgram, on_delete=models.CASCADE, related_name="assignments")
    mentor = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="mentor_assignments")
    mentee = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="mentee_assignments")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Mentor Assignment"
        verbose_name_plural = "Mentor Assignments"

    def __str__(self):
        return f"Mentor {self.mentor.alumni_id} -> Mentee {self.mentee.student_id}"


# ---------------------------------------------------------------------------
# 4. Alumni Events, Registrations & Chapters
# ---------------------------------------------------------------------------
class AlumniEvent(models.Model):
    TYPE_CHOICES = [
        ("Reunion", "Global Alumni Reunion"),
        ("Seminar", "Academic Seminar"),
        ("Webinar", "Virtual Webinar"),
        ("Networking", "Networking Dinner"),
        ("Workshop", "Skill Workshop"),
    ]

    STATUS_CHOICES = [
        ("Upcoming", "Upcoming"),
        ("Ongoing", "Ongoing"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_code = models.CharField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default="Reunion")
    venue = models.CharField(max_length=200, default="Main Auditorium / Zoom Link")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Upcoming", db_index=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Alumni Event"
        verbose_name_plural = "Alumni Events"

    def __str__(self):
        return f"{self.title} [{self.event_code}] ({self.type})"


class EventRegistration(models.Model):
    STATUS_CHOICES = [
        ("Registered", "Registered"),
        ("Attended", "Attended"),
        ("Absent", "Absent"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(AlumniEvent, on_delete=models.CASCADE, related_name="registrations")
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="event_registrations")
    attendance_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Registered")
    certificate_url = models.CharField(max_length=300, blank=True, default="/media/events/cert_placeholder.pdf")

    class Meta:
        unique_together = ("event", "alumni")
        verbose_name = "Event Registration"
        verbose_name_plural = "Event Registrations"

    def __str__(self):
        return f"EventReg: {self.alumni.alumni_id} -> {self.event.event_code}"


class AlumniChapter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chapter_name = models.CharField(max_length=150, unique=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, default="")
    country = models.CharField(max_length=100, default="India")
    coordinator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["chapter_name"]
        verbose_name = "Alumni Chapter"
        verbose_name_plural = "Alumni Chapters"

    def __str__(self):
        return f"Chapter: {self.chapter_name} ({self.city}, {self.country})"


# ---------------------------------------------------------------------------
# 5. Fundraising Campaigns & Donations
# ---------------------------------------------------------------------------
class FundraisingCampaign(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("Paused", "Paused"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign_name = models.CharField(max_length=200)
    goal_amount = models.DecimalField(max_digits=14, decimal_places=2, default=1000000.00)
    collected_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Fundraising Campaign"
        verbose_name_plural = "Fundraising Campaigns"

    def __str__(self):
        return f"Campaign: {self.campaign_name} (Goal: ₹{self.goal_amount})"


class Donation(models.Model):
    STATUS_CHOICES = [
        ("Completed", "Completed"),
        ("Pending", "Pending"),
        ("Failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="donations")
    campaign = models.ForeignKey(FundraisingCampaign, on_delete=models.SET_NULL, null=True, blank=True, related_name="donations")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Completed")
    receipt_url = models.CharField(max_length=300, blank=True, default="/media/donations/receipt.pdf")
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Alumni Donation"
        verbose_name_plural = "Alumni Donations"

    def __str__(self):
        return f"Donation: ₹{self.amount} by {self.donor.alumni_id} [{self.payment_status}]"


# ---------------------------------------------------------------------------
# 6. Newsletters, Job Referrals, Networking & Stories
# ---------------------------------------------------------------------------
class Newsletter(models.Model):
    AUDIENCE_CHOICES = [
        ("All Alumni", "All Registered Alumni"),
        ("Chapter Wise", "Chapter Specific"),
        ("Batch Wise", "Batch Specific"),
    ]

    STATUS_CHOICES = [
        ("Draft", "Draft"),
        ("Published", "Published"),
        ("Archived", "Archived"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    publish_date = models.DateField()
    target_audience = models.CharField(max_length=30, choices=AUDIENCE_CHOICES, default="All Alumni")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Draft")

    class Meta:
        ordering = ["-publish_date"]
        verbose_name = "Alumni Newsletter"
        verbose_name_plural = "Alumni Newsletters"

    def __str__(self):
        return f"Newsletter: {self.title} [{self.status}]"


class CommunicationLog(models.Model):
    CHANNEL_CHOICES = [
        ("Email", "Email Notification"),
        ("SMS", "SMS Message"),
        ("WhatsApp", "WhatsApp Message"),
    ]

    STATUS_CHOICES = [
        ("Sent", "Sent"),
        ("Failed", "Failed"),
        ("Pending", "Pending"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default="Email")
    subject = models.CharField(max_length=200)
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Sent")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Communication Log"
        verbose_name_plural = "Communication Logs"

    def __str__(self):
        return f"[{self.channel}] {self.subject} ({self.status})"


class SuccessStory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="success_stories")
    title = models.CharField(max_length=200)
    story = models.TextField()
    featured = models.BooleanField(default=True)
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Success Story"
        verbose_name_plural = "Success Stories"

    def __str__(self):
        return f"Story: {self.title} ({self.alumni.alumni_id})"


class JobReferral(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referrer = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="job_referrals")
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=150)
    openings = models.PositiveIntegerField(default=1)
    expiry_date = models.DateField()
    contact_email = models.EmailField()

    class Meta:
        ordering = ["-expiry_date"]
        verbose_name = "Job Referral"
        verbose_name_plural = "Job Referrals"

    def __str__(self):
        return f"Referral: {self.role} @ {self.company} (by {self.referrer.alumni_id})"


class NetworkingRequest(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requester = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE, related_name="received_requests")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    message = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Networking Request"
        verbose_name_plural = "Networking Requests"

    def __str__(self):
        return f"Networking: {self.requester.alumni_id} -> {self.receiver.alumni_id} [{self.status}]"


class AlumniDirectory(models.Model):
    """Proxy directory index model for alumni search."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alumni = models.OneToOneField(AlumniProfile, on_delete=models.CASCADE, related_name="directory_entry")
    search_vector = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Alumni Directory Entry"
        verbose_name_plural = "Alumni Directory Index"

    def __str__(self):
        return f"Directory Entry: {self.alumni.alumni_id}"


class AlumniAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Alumni Audit Log"
        verbose_name_plural = "Alumni Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] Action: {self.action}"
