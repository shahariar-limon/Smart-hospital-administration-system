from django.contrib import admin
from .models import EmergencyRequest, Ambulance, EmergencyContact


@admin.register(EmergencyRequest)
class EmergencyRequestAdmin(admin.ModelAdmin):
    list_display = ['patient', 'emergency_type', 'location', 'status', 'created_at']
    list_filter = ['status', 'emergency_type', 'created_at']
    search_fields = ['patient__user__username', 'location', 'contact_number']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Ambulance)
class AmbulanceAdmin(admin.ModelAdmin):
    list_display = ['vehicle_number', 'driver_name', 'hospital_name', 'is_available']
    list_filter = ['is_available']
    search_fields = ['vehicle_number', 'driver_name', 'hospital_name']


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'designation', 'hospital_name', 'phone', 'is_24x7']
    list_filter = ['is_24x7']
    search_fields = ['name', 'hospital_name', 'phone']
