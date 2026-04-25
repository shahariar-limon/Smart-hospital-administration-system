from rest_framework import serializers
from .models import EmergencyRequest, Ambulance, EmergencyContact
from patient.serializers import PatientSerializer


class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = '__all__'


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'


class EmergencyRequestSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    ambulance_details = AmbulanceSerializer(source='assigned_ambulance', read_only=True)

    class Meta:
        model = EmergencyRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # Automatically set patient from request user if not provided
        request = self.context.get('request')
        if request and hasattr(request.user, 'patient'):
            validated_data['patient'] = request.user.patient
        return super().create(validated_data)


class EmergencyRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyRequest
        fields = ['emergency_type', 'location', 'latitude', 'longitude', 'description', 'contact_number']


class EmergencyRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyRequest
        fields = ['status', 'assigned_ambulance', 'estimated_arrival_time']
