from rest_framework import serializers
from . import models

class AppointmentSerializer(serializers.ModelSerializer):
    # Use StringRelatedField for read operations (GET requests)
    time_display = serializers.StringRelatedField(source='time', read_only=True)
    patient_display = serializers.StringRelatedField(source='patient', read_only=True)
    doctor_display = serializers.StringRelatedField(source='doctor', read_only=True)
    
    class Meta:
        model = models.Appointment
        fields = '__all__'
        
    def to_representation(self, instance):
        # For GET requests, show the string representations
        representation = super().to_representation(instance)
        representation['time'] = str(instance.time)
        representation['patient'] = str(instance.patient)
        representation['doctor'] = str(instance.doctor)
        return representation
