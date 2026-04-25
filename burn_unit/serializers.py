from rest_framework import serializers
from .models import BurnDoctor, BurnPatient, BurnTreatment, BurnUnit
from doctor.serializers import DoctorSerializer


class BurnDoctorSerializer(serializers.ModelSerializer):
    doctor_details = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = BurnDoctor
        fields = '__all__'


class BurnPatientSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='assigned_doctor.doctor.user.get_full_name', read_only=True)

    class Meta:
        model = BurnPatient
        fields = '__all__'


class BurnTreatmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='burn_patient.patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='performed_by.doctor.user.get_full_name', read_only=True)

    class Meta:
        model = BurnTreatment
        fields = '__all__'


class BurnUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BurnUnit
        fields = '__all__'
