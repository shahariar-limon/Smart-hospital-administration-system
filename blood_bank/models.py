from django.db import models
from patient.models import Patient
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
]

REQUEST_STATUS = [
    ('Pending', 'Pending'),
    ('Accepted', 'Accepted'),
    ('Fulfilled', 'Fulfilled'),
    ('Cancelled', 'Cancelled'),
]


class BloodDonor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    date_of_birth = models.DateField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    last_donation_date = models.DateField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    medical_history = models.TextField(blank=True, help_text="Any relevant medical conditions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.blood_group}"

    class Meta:
        verbose_name = 'Blood Donor'
        verbose_name_plural = 'Blood Donors'


class BloodRequest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='blood_requests')
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    units_required = models.IntegerField(default=1)
    urgency = models.CharField(max_length=20, choices=[
        ('Critical', 'Critical'),
        ('Urgent', 'Urgent'),
        ('Normal', 'Normal')
    ], default='Normal')
    reason = models.TextField(help_text="Reason for blood requirement")
    hospital_name = models.CharField(max_length=200)
    hospital_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    required_by_date = models.DateField()
    status = models.CharField(max_length=15, choices=REQUEST_STATUS, default='Pending')
    assigned_donor = models.ForeignKey(BloodDonor, on_delete=models.SET_NULL, null=True, blank=True, related_name='fulfilled_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.user.username} - {self.blood_group} - {self.urgency}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blood Request'
        verbose_name_plural = 'Blood Requests'


class BloodDonation(models.Model):
    donor = models.ForeignKey(BloodDonor, on_delete=models.CASCADE, related_name='donations')
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    donation_date = models.DateField()
    units_donated = models.IntegerField(default=1)
    hospital_name = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor.user.username} - {self.donation_date}"

    class Meta:
        ordering = ['-donation_date']
        verbose_name = 'Blood Donation'
        verbose_name_plural = 'Blood Donations'


class BloodBank(models.Model):
    name = models.CharField(max_length=200)
    hospital_name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Blood availability
    a_positive_units = models.IntegerField(default=0)
    a_negative_units = models.IntegerField(default=0)
    b_positive_units = models.IntegerField(default=0)
    b_negative_units = models.IntegerField(default=0)
    ab_positive_units = models.IntegerField(default=0)
    ab_negative_units = models.IntegerField(default=0)
    o_positive_units = models.IntegerField(default=0)
    o_negative_units = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.hospital_name}"

    class Meta:
        verbose_name = 'Blood Bank'
        verbose_name_plural = 'Blood Banks'
