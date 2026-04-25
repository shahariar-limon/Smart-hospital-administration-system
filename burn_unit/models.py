from django.db import models
from patient.models import Patient
from doctor.models import Doctor

BURN_SEVERITY = [
    ('First Degree', 'First Degree (Minor)'),
    ('Second Degree', 'Second Degree (Moderate)'),
    ('Third Degree', 'Third Degree (Severe)'),
    ('Fourth Degree', 'Fourth Degree (Critical)'),
]

TREATMENT_STATUS = [
    ('Admitted', 'Admitted'),
    ('Under Treatment', 'Under Treatment'),
    ('Recovering', 'Recovering'),
    ('Discharged', 'Discharged'),
]


class BurnDoctor(models.Model):
    doctor = models.OneToOneField(Doctor, on_delete=models.CASCADE, related_name='burn_specialist')
    specialization = models.CharField(max_length=200, help_text="Burn treatment specialization")
    years_of_experience = models.IntegerField()
    certifications = models.TextField(help_text="Relevant certifications")
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.doctor.user.get_full_name()} - Burn Specialist"

    class Meta:
        verbose_name = 'Burn Doctor'
        verbose_name_plural = 'Burn Doctors'


class BurnPatient(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='burn_cases')
    burn_severity = models.CharField(max_length=20, choices=BURN_SEVERITY)
    affected_area_percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage of body affected")
    burn_location = models.TextField(help_text="Description of burn location on body")
    cause_of_burn = models.TextField(help_text="How the burn occurred")
    admission_date = models.DateField()
    discharge_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=TREATMENT_STATUS, default='Admitted')
    assigned_doctor = models.ForeignKey(BurnDoctor, on_delete=models.SET_NULL, null=True, related_name='patients')
    room_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.user.username} - {self.burn_severity}"

    class Meta:
        ordering = ['-admission_date']
        verbose_name = 'Burn Patient'
        verbose_name_plural = 'Burn Patients'


class BurnTreatment(models.Model):
    burn_patient = models.ForeignKey(BurnPatient, on_delete=models.CASCADE, related_name='treatments')
    treatment_date = models.DateField()
    treatment_type = models.CharField(max_length=200, help_text="Type of treatment (e.g., Skin Graft, Dressing, etc.)")
    medications = models.TextField(help_text="Medications administered")
    notes = models.TextField(help_text="Treatment notes and observations")
    performed_by = models.ForeignKey(BurnDoctor, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.burn_patient.patient.user.username} - {self.treatment_type} - {self.treatment_date}"

    class Meta:
        ordering = ['-treatment_date']
        verbose_name = 'Burn Treatment'
        verbose_name_plural = 'Burn Treatments'


class BurnUnit(models.Model):
    name = models.CharField(max_length=200)
    hospital_name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    emergency_contact = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    total_beds = models.IntegerField()
    available_beds = models.IntegerField()
    has_icu = models.BooleanField(default=True, help_text="Has ICU facility")
    has_operation_theater = models.BooleanField(default=True)
    is_24x7 = models.BooleanField(default=True)
    facilities = models.TextField(help_text="Available facilities and equipment")

    def __str__(self):
        return f"{self.name} - {self.hospital_name}"

    class Meta:
        verbose_name = 'Burn Unit'
        verbose_name_plural = 'Burn Units'
