from django.db import models
from patient.models import Patient
from django.contrib.auth.models import User

# Emergency Request Status Choices
EMERGENCY_STATUS = [
    ('Pending', 'Pending'),
    ('Accepted', 'Accepted'),
    ('On the Way', 'On the Way'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled'),
]

EMERGENCY_TYPE = [
    ('Medical Emergency', 'Medical Emergency'),
    ('Accident', 'Accident'),
    ('Heart Attack', 'Heart Attack'),
    ('Stroke', 'Stroke'),
    ('Respiratory Distress', 'Respiratory Distress'),
    ('Other', 'Other'),
]

class EmergencyRequest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='emergency_requests')
    emergency_type = models.CharField(choices=EMERGENCY_TYPE, max_length=30)
    location = models.CharField(max_length=255, help_text="Current location of the patient")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    description = models.TextField(help_text="Describe the emergency situation")
    contact_number = models.CharField(max_length=15)
    status = models.CharField(choices=EMERGENCY_STATUS, max_length=15, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_ambulance = models.ForeignKey('Ambulance', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    estimated_arrival_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Emergency - {self.patient.user.username} - {self.emergency_type} - {self.status}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Emergency Request'
        verbose_name_plural = 'Emergency Requests'


class Ambulance(models.Model):
    vehicle_number = models.CharField(max_length=20, unique=True)
    driver_name = models.CharField(max_length=100)
    driver_phone = models.CharField(max_length=15)
    hospital_name = models.CharField(max_length=200)
    hospital_address = models.TextField()
    hospital_phone = models.CharField(max_length=15)
    is_available = models.BooleanField(default=True)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_number} - {self.driver_name}"

    class Meta:
        verbose_name = 'Ambulance'
        verbose_name_plural = 'Ambulances'


class EmergencyContact(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    hospital_name = models.CharField(max_length=200)
    address = models.TextField()
    is_24x7 = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.hospital_name}"

    class Meta:
        verbose_name = 'Emergency Contact'
        verbose_name_plural = 'Emergency Contacts'
