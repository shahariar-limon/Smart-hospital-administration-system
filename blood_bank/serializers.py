from rest_framework import serializers
from .models import BloodDonor, BloodRequest, BloodDonation, BloodBank
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class BloodDonorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = BloodDonor
        fields = '__all__'


class BloodDonorRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = BloodDonor
        fields = ['username', 'password', 'email', 'first_name', 'last_name',
                  'blood_group', 'date_of_birth', 'phone', 'address', 'city', 'medical_history']

    def create(self, validated_data):
        # Extract user data
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
        }

        # Create user
        user = User.objects.create_user(**user_data)

        # Create donor
        donor = BloodDonor.objects.create(user=user, **validated_data)
        return donor


class BloodRequestSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    donor_name = serializers.CharField(source='assigned_donor.user.get_full_name', read_only=True)

    class Meta:
        model = BloodRequest
        fields = '__all__'


class BloodDonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.user.get_full_name', read_only=True)

    class Meta:
        model = BloodDonation
        fields = '__all__'


class BloodBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodBank
        fields = '__all__'
