from rest_framework import serializers
from .models import Vaccine, VaccinationRecord, VaccineSchedule


class VaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccine
        fields = '__all__'


class VaccinationRecordSerializer(serializers.ModelSerializer):
    vaccine_name = serializers.CharField(source='vaccine.name', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model = VaccinationRecord
        fields = '__all__'
        read_only_fields = ['patient']


class VaccineScheduleSerializer(serializers.ModelSerializer):
    vaccines = VaccineSerializer(many=True, read_only=True)

    class Meta:
        model = VaccineSchedule
        fields = '__all__'
