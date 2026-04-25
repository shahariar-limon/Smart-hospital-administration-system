from django.shortcuts import render, redirect
from rest_framework import viewsets
from . import models
from . import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework import status
# for sending email
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


class PatientViewset(viewsets.ModelViewSet):
    queryset = models.Patient.objects.all()
    serializer_class = serializers.PatientSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializers.PatientDetailSerializer
        return serializers.PatientSerializer

class UserRegistrationApiView(APIView):
    serializer_class = serializers.RegistrationSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            token = default_token_generator.make_token(user)
            print("token ", token)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            print("uid ", uid)
            confirm_link = f"https://smart-care.onrender.com/patient/active/{uid}/{token}"
            email_subject = "Confirm Your Email"
            email_body = render_to_string('confirm_email.html', {'confirm_link' : confirm_link})
            
            email = EmailMultiAlternatives(email_subject , '', to=[user.email])
            email.attach_alternative(email_body, "text/html")
            email.send()
            return Response("Check your mail for confirmation")
        return Response(serializer.errors)


def activate(request, uid64, token):
    try:
        uid = urlsafe_base64_decode(uid64).decode()
        user = User._default_manager.get(pk=uid)
    except(User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('login')
    else:
        return redirect('register')


def login_page(request):
    # This renders the login.html template for browser access
    return render(request, 'login.html')


class UserLoginApiView(APIView):
    def post(self, request):
        serializer = serializers.UserLoginSerializer(data = self.request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username= username, password=password)

            if user:
                token, _ = Token.objects.get_or_create(user=user)
                print(token)
                print(_)
                login(request, user)
                return Response({'token' : token.key, 'user_id' : user.id})
            else:
                return Response({'error' : "Invalid Credential"})
        return Response(serializer.errors)

class UserLogoutView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            request.user.auth_token.delete()
        logout(request)
        return redirect('login')

@api_view(['GET'])
def get_patient_by_user(request, user_id):
    try:
        patient = models.Patient.objects.get(user__id=user_id)
        serializer = serializers.PatientDetailSerializer(patient)
        return Response(serializer.data)
    except models.Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

def edit_profile_page(request):
    return render(request, 'editProfile.html')

@api_view(['PUT', 'PATCH'])
def update_patient_profile(request, user_id):
    try:
        patient = models.Patient.objects.get(user__id=user_id)
        user = patient.user

        # Update User model fields
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'email' in request.data:
            user.email = request.data['email']
        user.save()

        # Update Patient model fields
        patient_fields = [
            'mobile_no', 'date_of_birth', 'gender', 'blood_group', 'address',
            'emergency_contact_name', 'emergency_contact_phone', 'allergies',
            'chronic_diseases', 'current_medications', 'past_surgeries',
            'family_medical_history', 'height', 'weight'
        ]

        for field in patient_fields:
            if field in request.data:
                value = request.data[field]
                # Handle empty strings for optional fields
                if value == '' and field in ['height', 'weight', 'date_of_birth']:
                    value = None
                elif value == '' and field in ['gender', 'blood_group']:
                    if field == 'blood_group':
                        value = 'Unknown'
                    else:
                        value = None
                setattr(patient, field, value)

        patient.save()

        # Return updated patient data
        serializer = serializers.PatientDetailSerializer(patient)
        return Response({
            'message': 'Profile updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    except models.Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error updating patient profile: {str(e)}")  # Add logging
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
