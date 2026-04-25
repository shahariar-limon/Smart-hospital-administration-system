from django.contrib import admin
from .models import Vaccine, VaccinationRecord, VaccineSchedule


@admin.register(Vaccine)
class VaccineAdmin(admin.ModelAdmin):
    list_display = ['name', 'disease_prevented', 'age_group', 'total_doses', 'is_available']
    list_filter = ['age_group', 'is_available']
    search_fields = ['name', 'disease_prevented', 'manufacturer']


@admin.register(VaccinationRecord)
class VaccinationRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'vaccine', 'dose_number', 'scheduled_date', 'status']
    list_filter = ['status', 'scheduled_date']
    search_fields = ['patient__user__username', 'vaccine__name']


@admin.register(VaccineSchedule)
class VaccineScheduleAdmin(admin.ModelAdmin):
    list_display = ['name', 'age_group', 'is_recommended']
    list_filter = ['age_group', 'is_recommended']
    search_fields = ['name', 'description']
