from rest_framework import serializers
from . import models
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Specialization
        fields = '__all__'
        
class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Designation
        fields = '__all__'
        
class AvailableTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AvailableTime
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    designation = DesignationSerializer(many=True, read_only=True)
    specialization = SpecializationSerializer(many=True, read_only=True)
    available_time = AvailableTimeSerializer(many=True, read_only=True)
    class Meta:
        model = models.Doctor
        fields = '__all__'
        
        
class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.StringRelatedField(many=False)
    doctor = serializers.StringRelatedField(many=False)
    
    class Meta:
        model = models.Review
        fields = '__all__'
