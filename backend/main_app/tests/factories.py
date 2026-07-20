import factory
from main_app.models import CustomUser, Course, Session, Student, Staff, Subject
from django.utils import timezone
from datetime import datetime, date
from django.db.models.signals import post_save

@factory.django.mute_signals(post_save)
class CustomUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    user_type = '3' # Default to student
    gender = 'M'
    address = factory.Faker('address')

class CourseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Course
    
    name = factory.Sequence(lambda n: f"Course {n}")

class SessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Session
    
    start_year = factory.LazyFunction(lambda: date(datetime.now().year, 1, 1))
    end_year = factory.LazyFunction(lambda: date(datetime.now().year + 1, 1, 1))

@factory.django.mute_signals(post_save)
class StudentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Student
    
    admin = factory.SubFactory(CustomUserFactory, user_type='3')
    course = factory.SubFactory(CourseFactory)
    session = factory.SubFactory(SessionFactory)

@factory.django.mute_signals(post_save)
class StaffFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Staff
    
    admin = factory.SubFactory(CustomUserFactory, user_type='2')
    course = factory.SubFactory(CourseFactory)

class SubjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Subject
    
    name = factory.Sequence(lambda n: f"Subject {n}")
    course = factory.SubFactory(CourseFactory)
    staff = factory.SubFactory(StaffFactory)
