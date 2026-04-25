from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from .models import EmergencyRequest, Ambulance, EmergencyContact
from .serializers import (
    EmergencyRequestSerializer,
    EmergencyRequestCreateSerializer,
    EmergencyRequestUpdateSerializer,
    AmbulanceSerializer,
    EmergencyContactSerializer
)
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def emergency_page(request):
    """Render the emergency services page"""
    return render(request, 'emergency.html')


class EmergencyRequestViewSet(viewsets.ModelViewSet):
    queryset = EmergencyRequest.objects.all()
    serializer_class = EmergencyRequestSerializer
    authentication_classes = [TokenAuthentication]  # Use only Token auth, no session auth (no CSRF needed)

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return EmergencyRequestCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return EmergencyRequestUpdateSerializer
        return EmergencyRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return EmergencyRequest.objects.all()
        elif hasattr(user, 'patient'):
            return EmergencyRequest.objects.filter(patient=user.patient)
        return EmergencyRequest.objects.none()

    def perform_create(self, serializer):
        # Check if user has a patient profile, create one if it doesn't exist
        if not hasattr(self.request.user, 'patient'):
            from patient.models import Patient
            patient = Patient.objects.create(user=self.request.user)
        else:
            patient = self.request.user.patient

        emergency_request = serializer.save(patient=patient)

        # Send notification email to admin
        try:
            email_subject = "New Emergency Request"
            email_body = f"""
            New Emergency Request:
            Patient: {patient.user.get_full_name()}
            Type: {emergency_request.emergency_type}
            Location: {emergency_request.location}
            Contact: {emergency_request.contact_number}
            Description: {emergency_request.description}
            """

            email = EmailMultiAlternatives(
                email_subject,
                email_body,
                to=['admin@smartcare.com']  # Change to actual admin email
            )
            email.send()
        except Exception as e:
            print(f"Failed to send email: {e}")

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign_ambulance(self, request, pk=None):
        emergency_request = self.get_object()
        ambulance_id = request.data.get('ambulance_id')

        try:
            ambulance = Ambulance.objects.get(id=ambulance_id, is_available=True)
            emergency_request.assigned_ambulance = ambulance
            emergency_request.status = 'Accepted'
            emergency_request.save()

            ambulance.is_available = False
            ambulance.save()

            return Response({
                'message': 'Ambulance assigned successfully',
                'data': EmergencyRequestSerializer(emergency_request).data
            })
        except Ambulance.DoesNotExist:
            return Response(
                {'error': 'Ambulance not found or not available'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        emergency_request = self.get_object()
        if emergency_request.status in ['Completed', 'Cancelled']:
            return Response(
                {'error': 'Cannot cancel this request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        emergency_request.status = 'Cancelled'
        emergency_request.save()

        if emergency_request.assigned_ambulance:
            emergency_request.assigned_ambulance.is_available = True
            emergency_request.assigned_ambulance.save()

        return Response({'message': 'Emergency request cancelled'})


class AmbulanceViewSet(viewsets.ModelViewSet):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])
    def available(self, request):
        available_ambulances = Ambulance.objects.filter(is_available=True)
        serializer = self.get_serializer(available_ambulances, many=True)
        return Response(serializer.data)


class EmergencyContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        # This can be enhanced with actual location-based filtering
        contacts = EmergencyContact.objects.filter(is_24x7=True)
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)
