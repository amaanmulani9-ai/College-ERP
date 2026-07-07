from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime,timedelta
import uuid




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
    USER_TYPE = ((1, "HOD"), (2, "Staff"), (3, "Student"), (4, "Parent"), (5, "Alumni"), (6, "CompanyHR"), (7, "Backoffice"))
    GENDER = [("M", "Male"), ("F", "Female")]
    
    
    username = None  # Removed username, using email instead
    email = models.EmailField(unique=True)
    user_type = models.CharField(default='1', choices=USER_TYPE, max_length=1)
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


class Backoffice(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    department = models.CharField(max_length=100, default="Admissions & Finance")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.admin.get_full_name() or self.admin.email



class Course(models.Model):
    name = models.CharField(max_length=120)
    monthly_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    class_teacher = models.ForeignKey('Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='class_teacher_of')
    total_semesters = models.IntegerField(default=6, help_text="Total semesters for this course (e.g., 6 for BSCIT, 4 for MSCIT)")
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
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=False)
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True)
    batch_year = models.IntegerField(default=2022)
    current_semester = models.IntegerField(default=1)
    division = models.CharField(max_length=50, blank=True, null=True, help_text="Batch or Division (e.g. Batch A)")
    id_card_code = models.CharField(max_length=50, blank=True, null=True, unique=True)

    # eSkooly student admission fields
    registration_no = models.CharField(max_length=50, blank=True, null=True)
    discount_in_fee = models.IntegerField(default=0, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    cnic = models.CharField(max_length=50, blank=True, null=True)
    orphan = models.CharField(max_length=10, choices=[('Yes', 'Yes'), ('No', 'No')], default='No', blank=True, null=True)
    cast = models.CharField(max_length=50, blank=True, null=True)
    osc = models.CharField(max_length=10, choices=[('Yes', 'Yes'), ('No', 'No')], default='No', blank=True, null=True)
    identification_mark = models.CharField(max_length=150, blank=True, null=True)
    previous_school = models.CharField(max_length=150, blank=True, null=True)
    religion = models.CharField(max_length=50, blank=True, null=True)
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    previous_roll_no = models.CharField(max_length=50, blank=True, null=True)
    disease = models.CharField(max_length=150, blank=True, null=True)
    additional_note = models.TextField(blank=True, null=True)
    siblings = models.IntegerField(default=0, blank=True, null=True)
    
    # Father/Guardian Details
    father_name = models.CharField(max_length=150, blank=True, null=True)
    father_nic = models.CharField(max_length=50, blank=True, null=True)
    father_occupation = models.CharField(max_length=100, blank=True, null=True)
    father_education = models.CharField(max_length=100, blank=True, null=True)
    father_mobile = models.CharField(max_length=20, blank=True, null=True)
    father_profession = models.CharField(max_length=100, blank=True, null=True)
    father_income = models.CharField(max_length=50, blank=True, null=True)
    
    # Mother Details
    mother_name = models.CharField(max_length=150, blank=True, null=True)
    mother_nic = models.CharField(max_length=50, blank=True, null=True)
    mother_occupation = models.CharField(max_length=100, blank=True, null=True)
    mother_education = models.CharField(max_length=100, blank=True, null=True)
    mother_mobile = models.CharField(max_length=20, blank=True, null=True)
    mother_profession = models.CharField(max_length=100, blank=True, null=True)
    mother_income = models.CharField(max_length=50, blank=True, null=True)

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
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=False)
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    id_card_code = models.CharField(max_length=50, blank=True, null=True, unique=True)
    monthly_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    experience = models.PositiveIntegerField(default=0, help_text="Years of experience")
    religion = models.CharField(max_length=50, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    picture = models.ImageField(upload_to='staff_pictures/', blank=True, null=True)
    job_letter_password = models.CharField(max_length=128, blank=True, null=True, help_text="Temporary password for job letter display")

    def __str__(self):
        return self.admin.first_name + " " +  self.admin.last_name


class Subject(models.Model):
    name = models.CharField(max_length=120)
    marks = models.IntegerField(default=100)
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
        if instance.user_type == 1 or instance.user_type == '1':
            Admin.objects.create(admin=instance)
        if instance.user_type == 2 or instance.user_type == '2':
            Staff.objects.create(admin=instance)
        if instance.user_type == 3 or instance.user_type == '3':
            Student.objects.create(admin=instance)
        if instance.user_type == 7 or instance.user_type == '7':
            Backoffice.objects.create(admin=instance)



@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    if instance.user_type == 1 or instance.user_type == '1':
        instance.admin.save()
    if instance.user_type == 2 or instance.user_type == '2':
        instance.staff.save()
    if instance.user_type == 3 or instance.user_type == '3':
        instance.student.save()
    if instance.user_type == 7 or instance.user_type == '7':
        try:
            instance.backoffice.save()
        except Backoffice.DoesNotExist:
            Backoffice.objects.create(admin=instance)

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
            
            # Sync division and semester
            if instance.student.division and reg.division != instance.student.division:
                reg.division = instance.student.division
                reg_changed = True
            if reg.current_semester != instance.student.current_semester:
                reg.current_semester = instance.student.current_semester
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

    @property
    def balance(self):
        return self.amount - self.amount_paid


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
    current_semester = models.IntegerField(default=1)
    division = models.CharField(max_length=50, default="")
    
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

class Parent(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='parents')
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.admin.get_full_name()} (Parent of {self.student.admin.get_full_name()})"


class FeedbackParent(models.Model):
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    feedback = models.TextField()
    reply = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Feedback from {self.parent.admin.get_full_name()}"


# --- Version 2.0 LMS Models ---

class CourseCategory(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class VideoCourse(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class VideoLesson(models.Model):
    course = models.ForeignKey(VideoCourse, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    video_file = models.FileField(upload_to='course_videos/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)  # For external links like YouTube
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class CourseProgress(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    lesson = models.ForeignKey(VideoLesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student} - {self.lesson.title} ({'Completed' if self.is_completed else 'In Progress'})"

class Assignment(models.Model):
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    description = models.TextField()
    attachment = models.FileField(upload_to='assignments/staff/', blank=True, null=True)
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    submission_text = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to='assignments/students/', blank=True, null=True)
    marks_obtained = models.FloatField(default=0.0)
    feedback = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.assignment.title}"

class StudyMaterial(models.Model):
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    file = models.FileField(upload_to='study_materials/')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


def generate_room_name():
    return f"PatkarERP-Live-{uuid.uuid4().hex[:8].upper()}"

class LiveClass(models.Model):
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    room_name = models.CharField(max_length=100, default=generate_room_name, unique=True)
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.room_name})"

class LiveClassAttendance(models.Model):
    live_class = models.ForeignKey(LiveClass, on_delete=models.CASCADE, related_name='attendances')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('live_class', 'student')

    def __str__(self):
        return f"{self.student} in {self.live_class.title}"


class ChatMessage(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='group_messages', null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.course:
            return f"Group Chat ({self.course.name}): {self.sender} - {self.message[:20]}"
        return f"Direct Chat: {self.sender} -> {self.recipient} - {self.message[:20]}"


class VisitorPass(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    purpose = models.TextField()
    host_person = models.CharField(max_length=150)
    visit_date = models.DateField()
    pass_code = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visitor Pass: {self.name} -> {self.host_person} ({self.status})"

# --- FINANCE MODULE MODELS ---

class FeeType(models.Model):
    name = models.CharField(max_length=100) # e.g., Tuition, Hostel, Transport
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Invoice(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    fee_type = models.ForeignKey(FeeType, on_delete=models.DO_NOTHING)
    session = models.ForeignKey('Session', on_delete=models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0) # e.g., 18.0 for 18%
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Invoice {self.id} - {self.student} ({self.fee_type.name})"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    gateway = models.CharField(max_length=50, default="Razorpay")
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} for Invoice {self.invoice.id} - {self.status}"


class Scholarship(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    is_active = models.BooleanField(default=True)
    granted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.discount_percentage}%) - {self.student}"


class Refund(models.Model):
    STATUS_CHOICES = [
        ('Requested', 'Requested'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Processed', 'Processed'),
    ]
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Requested')
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Refund for Payment {self.payment.id} - {self.status}"

# --- PLACEMENT MODULE MODELS ---

class Company(models.Model):
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=150)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CompanyHR(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.admin.first_name} ({self.company.name})"

class JobPosting(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    ctc_offered = models.CharField(max_length=100) # e.g. "8 LPA"
    requirements = models.TextField()
    deadline = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

class Resume(models.Model):
    student = models.OneToOneField('Student', on_delete=models.CASCADE)
    json_data = models.JSONField(default=dict, help_text="Stored in JSON Resume format")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume for {self.student}"

class Interview(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_posting = models.ForeignKey(JobPosting, on_delete=models.SET_NULL, null=True)
    scheduled_time = models.DateTimeField()
    jitsi_meet_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview: {self.student} with {self.company.name}"

class OfferLetter(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Declined', 'Declined'),
    ]
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_posting = models.ForeignKey(JobPosting, on_delete=models.SET_NULL, null=True)
    ctc_final = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    issued_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Offer: {self.student} by {self.company.name}"


# --- GENERAL SETTINGS MODELS ---

class InstituteProfile(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='institute_logos/', blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    target_line = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.name

class FeeParticular(models.Model):
    label = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_fixed = models.BooleanField(default=True)
    
    def __str__(self):
        return self.label

class BankDetail(models.Model):
    bank_name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='bank_logos/', blank=True, null=True)
    branch_address = models.TextField(blank=True, null=True)
    account_number = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.bank_name

class RulesRegulation(models.Model):
    student_rules = models.TextField(blank=True, null=True)
    employee_rules = models.TextField(blank=True, null=True)

    def __str__(self):
        return "Rules & Regulations"

class MarksGrading(models.Model):
    grade = models.CharField(max_length=10)
    percent_from = models.IntegerField()
    percent_upto = models.IntegerField()
    status = models.CharField(max_length=20, default='PASS', choices=[('PASS', 'PASS'), ('FAIL', 'FAIL')])

    def __str__(self):
        return f"{self.grade} ({self.percent_from}-{self.percent_upto}%)"

class FailCriteria(models.Model):
    overall_percentage = models.IntegerField(default=40)
    subject_percentage = models.IntegerField(default=33)
    subject_count = models.IntegerField(default=1)

    def __str__(self):
        return f"Fail Criteria (Overall <= {self.overall_percentage}%, Subject <= {self.subject_percentage}%, Count >= {self.subject_count})"

class ThemeLanguageSettings(models.Model):
    theme_placement = models.CharField(max_length=10, default='LTR')
    sidebar_background = models.CharField(max_length=20, default='Light')
    header_background = models.CharField(max_length=20, default='White')
    active_item_background = models.CharField(max_length=20, default='#6c5ce7')
    language = models.CharField(max_length=50, default='English')

    def __str__(self):
        return "Theme & Language Settings"

class AccountSettings(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='account_settings')
    time_zone = models.CharField(max_length=100, default='Asia/Karachi')
    currency = models.CharField(max_length=100, default='Dollars (USD)')
    currency_symbol = models.CharField(max_length=10, default='$')
    subscription = models.CharField(max_length=50, default='YEARLY')
    expiry_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Account Settings - {self.admin.email}"


# --- ADMINISTRATION MODULE MODELS ---

class AdmissionQuery(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    query_date = models.DateField(auto_now_add=True)
    follow_up_date = models.DateField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True) # e.g., Walk-in, Website, Advert
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Active')
    
    def __str__(self):
        return f"Query from {self.name} ({self.status})"

class Complaint(models.Model):
    COMPLAINT_BY_CHOICES = [
        ('Student', 'Student'),
        ('Parent', 'Parent'),
        ('Staff', 'Staff'),
    ]
    complaint_by = models.CharField(max_length=50, choices=COMPLAINT_BY_CHOICES)
    complainer_name = models.CharField(max_length=150)
    complaint_type = models.CharField(max_length=100) # e.g., Academic, Facilities
    source = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    description = models.TextField()
    action_taken = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Complaint by {self.complainer_name} - {self.complaint_type}"

class PostalReceive(models.Model):
    from_title = models.CharField(max_length=150)
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    to_title = models.CharField(max_length=150, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    document = models.FileField(upload_to='postal_records/receive/', blank=True, null=True)
    
    def __str__(self):
        return f"Postal Receive from {self.from_title}"

class PostalDispatch(models.Model):
    to_title = models.CharField(max_length=150)
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    from_title = models.CharField(max_length=150, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    document = models.FileField(upload_to='postal_records/dispatch/', blank=True, null=True)
    
    def __str__(self):
        return f"Postal Dispatch to {self.to_title}"

class PhoneCallLog(models.Model):
    CALL_TYPE_CHOICES = [
        ('Incoming', 'Incoming'),
        ('Outgoing', 'Outgoing'),
    ]
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    date = models.DateField(auto_now_add=True)
    follow_up_date = models.DateField(blank=True, null=True)
    call_duration = models.CharField(max_length=50, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    call_type = models.CharField(max_length=20, choices=CALL_TYPE_CHOICES, default='Incoming')
    
    def __str__(self):
        return f"{self.call_type} Call with {self.name}"


# --- STUDENT BEHAVIOUR & INCIDENT MODELS ---

class Incident(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    point = models.IntegerField(default=0) # E.g. +5 for good, -2 for bad
    is_negative = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.title} ({self.point} pts)"

class StudentBehaviourRecord(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='behaviour_records')
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey('Staff', on_delete=models.SET_NULL, null=True, blank=True)
    comment = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"Record for {self.student.admin.get_full_name()} - {self.incident.title}"


# --- DYNAMIC CERTIFICATE GENERATOR MODELS ---

class CertificateTemplate(models.Model):
    title = models.CharField(max_length=200)
    applicable_for = models.CharField(max_length=50, choices=[('Student', 'Student'), ('Staff', 'Staff')])
    header_left_text = models.CharField(max_length=255, blank=True, null=True)
    body_text = models.TextField(help_text="Use variables like [name], [course], [dob], etc.")
    footer_left_text = models.CharField(max_length=255, blank=True, null=True)
    footer_center_text = models.CharField(max_length=255, blank=True, null=True)
    footer_right_text = models.CharField(max_length=255, blank=True, null=True)
    background_image = models.ImageField(upload_to='certificate_templates/backgrounds/', blank=True, null=True)
    signature_image = models.ImageField(upload_to='certificate_templates/signatures/', blank=True, null=True)
    logo_image = models.ImageField(upload_to='certificate_templates/logos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
