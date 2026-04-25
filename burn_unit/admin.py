from django.contrib import admin
from .models import BurnDoctor, BurnPatient, BurnTreatment, BurnUnit


@admin.register(BurnDoctor)
class BurnDoctorAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'specialization', 'years_of_experience', 'is_available']
    list_filter = ['is_available']
    search_fields = ['doctor__user__first_name', 'doctor__user__last_name', 'specialization']


@admin.register(BurnPatient)
class BurnPatientAdmin(admin.ModelAdmin):
    list_display = ['patient', 'burn_severity', 'status', 'admission_date', 'assigned_doctor']
    list_filter = ['burn_severity', 'status']
    search_fields = ['patient__user__username', 'room_number']


@admin.register(BurnTreatment)
class BurnTreatmentAdmin(admin.ModelAdmin):
    list_display = ['burn_patient', 'treatment_type', 'treatment_date', 'performed_by']
    list_filter = ['treatment_date']
    search_fields = ['burn_patient__patient__user__username', 'treatment_type']


@admin.register(BurnUnit)
class BurnUnitAdmin(admin.ModelAdmin):
    list_display = ['name', 'hospital_name', 'city', 'total_beds', 'available_beds', 'is_24x7']
    list_filter = ['city', 'is_24x7', 'has_icu']
    search_fields = ['name', 'hospital_name', 'city']
