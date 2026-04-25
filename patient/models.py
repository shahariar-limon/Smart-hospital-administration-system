from django.db import models
from django.contrib.auth.models import User

# Blood Group Choices
BLOOD_GROUP_CHOICES = [
    ('A+', 'A Positive'),
    ('A-', 'A Negative'),
    ('B+', 'B Positive'),
    ('B-', 'B Negative'),
    ('AB+', 'AB Positive'),
    ('AB-', 'AB Negative'),
    ('O+', 'O Positive'),
    ('O-', 'O Negative'),
    ('Unknown', 'Unknown'),
]

GENDER_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
]

# Create your models here.
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    image = models.ImageField(upload_to='patient/images/', blank=True, null=True)
    mobile_no = models.CharField(max_length = 12, blank=True, null=True)

    # Enhanced fields for medical history
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    blood_group = models.CharField(max_length=10, choices=BLOOD_GROUP_CHOICES, default='Unknown')
    address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)

    # Medical History
    allergies = models.TextField(blank=True, help_text="List of allergies")
    chronic_diseases = models.TextField(blank=True, help_text="Chronic diseases or conditions")
    current_medications = models.TextField(blank=True, help_text="Currently taking medications")
    past_surgeries = models.TextField(blank=True, help_text="Past surgeries and dates")
    family_medical_history = models.TextField(blank=True, help_text="Family medical history")

    # Additional fields
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Height in cm")
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Weight in kg")

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"