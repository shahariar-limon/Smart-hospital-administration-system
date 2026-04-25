from django.db import models
from patient.models import Patient

AGE_GROUP_CHOICES = [
    ('Infant', 'Infant (0-2 years)'),
    ('Child', 'Child (2-12 years)'),
    ('Teenager', 'Teenager (13-18 years)'),
    ('Adult', 'Adult (18-60 years)'),
    ('Senior', 'Senior (60+ years)'),
    ('All', 'All Ages'),
]

DOSE_STATUS = [
    ('Scheduled', 'Scheduled'),
    ('Completed', 'Completed'),
    ('Missed', 'Missed'),
    ('Cancelled', 'Cancelled'),
]


class Vaccine(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    manufacturer = models.CharField(max_length=200)
    disease_prevented = models.CharField(max_length=200, help_text="Disease(s) this vaccine prevents")
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES)
    total_doses = models.IntegerField(default=1, help_text="Total number of doses required")
    dose_interval_days = models.IntegerField(null=True, blank=True, help_text="Days between doses")
    side_effects = models.TextField(blank=True, help_text="Common side effects")
    precautions = models.TextField(blank=True, help_text="Precautions before taking")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.disease_prevented}"

    class Meta:
        verbose_name = 'Vaccine'
        verbose_name_plural = 'Vaccines'


class VaccinationRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='vaccination_records')
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE, related_name='records')
    dose_number = models.IntegerField(default=1, help_text="Which dose number (1, 2, 3, etc.)")
    scheduled_date = models.DateField()
    administered_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=DOSE_STATUS, default='Scheduled')
    administered_by = models.CharField(max_length=200, blank=True, help_text="Doctor/Nurse who administered")
    hospital_name = models.CharField(max_length=200, blank=True)
    batch_number = models.CharField(max_length=100, blank=True, help_text="Vaccine batch number")
    notes = models.TextField(blank=True, help_text="Any additional notes or reactions")
    next_dose_date = models.DateField(null=True, blank=True, help_text="Next dose scheduled date")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.user.username} - {self.vaccine.name} - Dose {self.dose_number}"

    class Meta:
        ordering = ['-scheduled_date']
        verbose_name = 'Vaccination Record'
        verbose_name_plural = 'Vaccination Records'


class VaccineSchedule(models.Model):
    name = models.CharField(max_length=200, help_text="Schedule name (e.g., 'India Immunization Schedule')")
    description = models.TextField()
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES)
    vaccines = models.ManyToManyField(Vaccine, related_name='schedules')
    is_recommended = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.age_group}"

    class Meta:
        verbose_name = 'Vaccine Schedule'
        verbose_name_plural = 'Vaccine Schedules'
