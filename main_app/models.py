from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime,timedelta




class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = CustomUser(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        assert extra_fields["is_staff"]
        assert extra_fields["is_superuser"]
        return self._create_user(email, password, **extra_fields)


class Session(models.Model):
    start_year = models.DateField()
    end_year = models.DateField()

    def __str__(self):
        return "From " + str(self.start_year) + " to " + str(self.end_year)


class CustomUser(AbstractUser):
    USER_TYPE = ((1, "HOD"), (2, "Staff"), (3, "Student"))
    GENDER = [("M", "Male"), ("F", "Female")]
    
    
    username = None  # Removed username, using email instead
    email = models.EmailField(unique=True)
    user_type = models.CharField(default=1, choices=USER_TYPE, max_length=1)
    gender = models.CharField(max_length=1, choices=GENDER)
    profile_pic = models.ImageField()
    address = models.TextField()
    fcm_token = models.TextField(default="")  # For firebase notifications
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return (self.first_name + " " + self.last_name).strip() or self.email


class Admin(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)



class Course(models.Model):
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    name = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    isbn = models.PositiveIntegerField()
    category = models.CharField(max_length=50)

    def __str__(self):
        return str(self.name) + " ["+str(self.isbn)+']'


class Student(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.DO_NOTHING, null=True, blank=False)
    session = models.ForeignKey(Session, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return self.admin.last_name + ", " + self.admin.first_name

class Library(models.Model):
    student = models.ForeignKey(Student,  on_delete=models.CASCADE, null=True, blank=False)
    book = models.ForeignKey(Book,  on_delete=models.CASCADE, null=True, blank=False)
    def __str__(self):
        return str(self.student)

def expiry():
    return datetime.today() + timedelta(days=14)
class IssuedBook(models.Model):
    student_id = models.CharField(max_length=100, blank=True) 
    isbn = models.CharField(max_length=13)
    issued_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField(default=expiry)



class Staff(models.Model):
    course = models.ForeignKey(Course, on_delete=models.DO_NOTHING, null=True, blank=False)
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.admin.first_name + " " +  self.admin.last_name


class Subject(models.Model):
    name = models.CharField(max_length=120)
    staff = models.ForeignKey(Staff,on_delete=models.CASCADE,)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Attendance(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AttendanceReport(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class LeaveReportStudent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.CharField(max_length=60)
    message = models.TextField()
    status = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class LeaveReportStaff(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    date = models.CharField(max_length=60)
    message = models.TextField()
    status = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FeedbackStudent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    feedback = models.TextField()
    reply = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FeedbackStaff(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    feedback = models.TextField()
    reply = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class NotificationStaff(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class NotificationStudent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CollegeEvent(models.Model):
    EVENT_TYPE_CHOICES = [
        ('exam', 'Exam'),
        ('holiday', 'Holiday'),
        ('event', 'Event/Fest'),
        ('seminar', 'Seminar'),
        ('deadline', 'Deadline'),
    ]
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='event')
    date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_event_type_display()}) on {self.date}"




class StudentResult(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    test = models.FloatField(default=0)
    exam = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 1:
            Admin.objects.create(admin=instance)
        if instance.user_type == 2:
            Staff.objects.create(admin=instance)
        if instance.user_type == 3:
            Student.objects.create(admin=instance)


@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    if instance.user_type == 1:
        instance.admin.save()
    if instance.user_type == 2:
        instance.staff.save()
    if instance.user_type == 3:
        instance.student.save()
        # Synchronize from CustomUser/Student to StudentRegistration
        try:
            reg, created = StudentRegistration.objects.get_or_create(student=instance.student)
            reg_changed = False
            if instance.first_name and reg.first_name != instance.first_name.upper():
                reg.first_name = instance.first_name.upper()
                reg_changed = True
            if instance.last_name and reg.surname != instance.last_name.upper():
                reg.surname = instance.last_name.upper()
                reg_changed = True
            if instance.email and reg.student_email != instance.email.lower():
                reg.student_email = instance.email.lower()
                reg_changed = True
            if instance.address and reg.address != instance.address:
                reg.address = instance.address
                reg_changed = True
            if instance.gender:
                gender_str = 'MALE' if instance.gender == 'M' else 'FEMALE'
                if reg.gender != gender_str:
                    reg.gender = gender_str
                    reg_changed = True
            
            # Sync course
            if instance.student.course and reg.course_name != instance.student.course.name.upper():
                reg.course_name = instance.student.course.name.upper()
                reg_changed = True
            # Sync session
            if instance.student.session and reg.session != str(instance.student.session):
                reg.session = str(instance.student.session)
                reg_changed = True
                
            if reg_changed:
                if not getattr(instance, '_syncing_registration', False):
                    instance._syncing_registration = True
                    reg.save()
                    instance._syncing_registration = False
        except Exception:
            pass

# todos

class DiscussionMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.subject.name} ({self.created_at.strftime('%Y-%m-%d')})"


# --- New ERP Modules Models ---

class FeeRecord(models.Model):
    STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Unpaid', 'Unpaid'),
        ('Partial', 'Partial'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    category = models.CharField(max_length=100) # e.g. Tuition Fee, Exam Fee, Library Fee
    amount = models.FloatField()
    amount_paid = models.FloatField(default=0.0)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Unpaid')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.category} ({self.status})"


class FeePayment(models.Model):
    fee_record = models.ForeignKey(FeeRecord, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100)
    amount_paid = models.FloatField()
    payment_method = models.CharField(max_length=50) # UPI, Card, Net Banking
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of {self.amount_paid} for {self.fee_record.category} (TXN: {self.transaction_id})"


class Timetable(models.Model):
    DAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
    ]
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    classroom = models.CharField(max_length=50, default="Room 101")

    def __str__(self):
        return f"{self.course.name} - {self.subject.name} on {self.get_day_of_week_display()} ({self.start_time} - {self.end_time})"


class PlacementDrive(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Completed', 'Completed'),
    ]
    company_name = models.CharField(max_length=200)
    job_role = models.CharField(max_length=200)
    eligibility = models.CharField(max_length=255) # e.g. CGPA > 7.5, All branches
    package = models.CharField(max_length=100) # e.g. 8.5 LPA
    drive_date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Active')
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} - {self.job_role} ({self.package})"


class PlacementRegistration(models.Model):
    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    drive = models.ForeignKey(PlacementDrive, on_delete=models.CASCADE)
    resume_url = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Applied')
    applied_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} applied to {self.drive.company_name} ({self.status})"


class CertificateRequest(models.Model):
    CERT_CHOICES = [
        ('Bonafide', 'Bonafide Certificate'),
        ('Character', 'Character Certificate'),
        ('Leaving', 'Leaving Certificate'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    certificate_type = models.CharField(max_length=50, choices=CERT_CHOICES)
    reason = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Pending')
    approved_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.certificate_type} ({self.status})"


# --- Registration Portal Models ---

class StudentRegistration(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    application_no = models.CharField(max_length=100, default="")
    session = models.CharField(max_length=50, default="")
    course_name = models.CharField(max_length=100, default="")
    
    # Personal details
    surname = models.CharField(max_length=100, default="")
    first_name = models.CharField(max_length=100, default="")
    father_name = models.CharField(max_length=100, default="")
    mother_name = models.CharField(max_length=100, default="")
    marathi_name = models.CharField(max_length=100, default="")
    gender = models.CharField(max_length=20, default="")
    dob = models.DateField(null=True, blank=True)
    place_of_birth = models.CharField(max_length=100, default="")
    marital_status = models.CharField(max_length=50, default="")
    religion = models.CharField(max_length=50, default="")
    nationality = models.CharField(max_length=50, default="INDIAN")
    blood_group = models.CharField(max_length=10, default="")
    aadhaar_no = models.CharField(max_length=50, default="")
    mother_tongue = models.CharField(max_length=50, default="")
    passport_no = models.CharField(max_length=50, default="")
    voter_id = models.CharField(max_length=50, default="")
    ncc_nss = models.CharField(max_length=10, default="NO")
    employment_status = models.CharField(max_length=50, default="Unemployed")
    birth_state = models.CharField(max_length=50, default="")
    birth_district = models.CharField(max_length=50, default="")
    birth_tehsil = models.CharField(max_length=50, default="")
    caste_category = models.CharField(max_length=50, default="")
    caste = models.CharField(max_length=50, default="")
    prn_no = models.CharField(max_length=50, default="")
    handicap = models.CharField(max_length=10, default="NO")
    is_orphan = models.CharField(max_length=10, default="NO")
    has_device = models.CharField(max_length=10, default="NO")
    municipal_ward = models.CharField(max_length=50, default="")
    has_internet = models.CharField(max_length=10, default="NO")
    height = models.FloatField(default=0.0)
    weight = models.FloatField(default=0.0)
    abc_id = models.CharField(max_length=50, default="")
    
    # Parent details
    guardian_occupation = models.CharField(max_length=100, default="")
    guardian_mobile = models.CharField(max_length=50, default="")
    guardian_income = models.FloatField(default=0.0)
    
    # Address
    address = models.TextField(default="")
    state = models.CharField(max_length=100, default="")
    district = models.CharField(max_length=100, default="")
    tehsil = models.CharField(max_length=100, default="")
    city = models.CharField(max_length=100, default="")
    pincode = models.CharField(max_length=20, default="")
    
    # Permanent Address
    perm_address = models.TextField(default="")
    perm_state = models.CharField(max_length=100, default="")
    perm_district = models.CharField(max_length=100, default="")
    perm_tehsil = models.CharField(max_length=100, default="")
    perm_city = models.CharField(max_length=100, default="")
    perm_pincode = models.CharField(max_length=20, default="")
    
    # Contact
    student_phone = models.CharField(max_length=50, default="")
    student_email = models.EmailField(default="")
    
    # Document Uploads
    aadhar_file = models.FileField(upload_to='student_documents/aadhar/', null=True, blank=True)
    marksheet_file = models.FileField(upload_to='student_documents/marksheet/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Registration {self.application_no} for {self.student.admin.get_full_name()}"

    def save(self, *args, **kwargs):
        super(StudentRegistration, self).save(*args, **kwargs)
        try:
            student = self.student
            user = student.admin
            changed = False
            if self.first_name and user.first_name != self.first_name:
                user.first_name = self.first_name
                changed = True
            if self.surname and user.last_name != self.surname:
                user.last_name = self.surname
                changed = True
            if self.student_email:
                new_email = self.student_email.lower()
                if user.email != new_email:
                    from main_app.models import CustomUser
                    if not CustomUser.objects.filter(email=new_email).exclude(id=user.id).exists():
                        user.email = new_email
                        changed = True
            if self.address and user.address != self.address:
                user.address = self.address
                changed = True
            if self.gender:
                g_val = 'M' if self.gender.upper() in ['M', 'MALE'] else 'F'
                if user.gender != g_val:
                    user.gender = g_val
                    changed = True
            if changed:
                if not getattr(user, '_syncing_registration', False):
                    user._syncing_registration = True
                    user.save()
                    user._syncing_registration = False
        except Exception:
            pass

class Event(models.Model):
    EVENT_TYPES = (
        ('Exam', 'Exam'),
        ('Holiday', 'Holiday'),
        ('General', 'General Event'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='General')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Exam(models.Model):
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    duration_minutes = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.subject.name}"

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_1 = models.CharField(max_length=200)
    option_2 = models.CharField(max_length=200)
    option_3 = models.CharField(max_length=200)
    option_4 = models.CharField(max_length=200)
    correct_option = models.CharField(max_length=1, choices=[('1', 'Option 1'), ('2', 'Option 2'), ('3', 'Option 3'), ('4', 'Option 4')])
    marks = models.IntegerField(default=1)

    def __str__(self):
        return self.question_text

class OnlineExamResult(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_marks = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.admin.get_full_name()} - {self.exam.title} : {self.score}/{self.total_marks}"
