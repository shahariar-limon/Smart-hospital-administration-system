from django.contrib import admin
from .models import BloodDonor, BloodRequest, BloodDonation, BloodBank


@admin.register(BloodDonor)
class BloodDonorAdmin(admin.ModelAdmin):
    list_display = ['user', 'blood_group', 'city', 'is_available', 'last_donation_date']
    list_filter = ['blood_group', 'is_available', 'city']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'city']


@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ['patient', 'blood_group', 'urgency', 'status', 'required_by_date']
    list_filter = ['blood_group', 'urgency', 'status']
    search_fields = ['patient__user__username', 'hospital_name']


@admin.register(BloodDonation)
class BloodDonationAdmin(admin.ModelAdmin):
    list_display = ['donor', 'donation_date', 'units_donated', 'hospital_name']
    list_filter = ['donation_date']
    search_fields = ['donor__user__username', 'hospital_name']


@admin.register(BloodBank)
class BloodBankAdmin(admin.ModelAdmin):
    list_display = ['name', 'hospital_name', 'city', 'phone', 'is_active']
    list_filter = ['is_active', 'city']
    search_fields = ['name', 'hospital_name', 'city']
