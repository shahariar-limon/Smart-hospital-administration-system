from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import BloodDonor, BloodRequest, BloodDonation, BloodBank
from .serializers import (
    BloodDonorSerializer,
    BloodDonorRegistrationSerializer,
    BloodRequestSerializer,
    BloodDonationSerializer,
    BloodBankSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class BloodDonorViewSet(viewsets.ModelViewSet):
    queryset = BloodDonor.objects.all()
    serializer_class = BloodDonorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['blood_group', 'city', 'is_available']
    search_fields = ['user__first_name', 'user__last_name', 'city']

    def get_serializer_class(self):
        if self.action == 'create':
            return BloodDonorRegistrationSerializer
        return BloodDonorSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def by_blood_group(self, request):
        blood_group = request.query_params.get('blood_group')
        if not blood_group:
            return Response({'error': 'blood_group parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        donors = BloodDonor.objects.filter(blood_group=blood_group, is_available=True)
        serializer = self.get_serializer(donors, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available(self, request):
        available_donors = BloodDonor.objects.filter(is_available=True)
        serializer = self.get_serializer(available_donors, many=True)
        return Response(serializer.data)


class BloodRequestViewSet(viewsets.ModelViewSet):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['blood_group', 'urgency', 'status']
    ordering_fields = ['created_at', 'required_by_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BloodRequest.objects.all()
        elif hasattr(user, 'patient'):
            return BloodRequest.objects.filter(patient=user.patient)
        return BloodRequest.objects.none()

    def perform_create(self, serializer):
        patient = self.request.user.patient
        serializer.save(patient=patient)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign_donor(self, request, pk=None):
        blood_request = self.get_object()
        donor_id = request.data.get('donor_id')

        try:
            donor = BloodDonor.objects.get(id=donor_id, is_available=True)
            blood_request.assigned_donor = donor
            blood_request.status = 'Accepted'
            blood_request.save()

            return Response({
                'message': 'Donor assigned successfully',
                'data': BloodRequestSerializer(blood_request).data
            })
        except BloodDonor.DoesNotExist:
            return Response(
                {'error': 'Donor not found or not available'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        blood_request = self.get_object()
        if blood_request.status in ['Fulfilled', 'Cancelled']:
            return Response(
                {'error': 'Cannot cancel this request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        blood_request.status = 'Cancelled'
        blood_request.save()
        return Response({'message': 'Blood request cancelled'})


class BloodDonationViewSet(viewsets.ModelViewSet):
    queryset = BloodDonation.objects.all()
    serializer_class = BloodDonationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['donation_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BloodDonation.objects.all()
        elif hasattr(user, 'blooddonor'):
            return BloodDonation.objects.filter(donor=user.blooddonor)
        return BloodDonation.objects.all()


class BloodBankViewSet(viewsets.ModelViewSet):
    queryset = BloodBank.objects.filter(is_active=True)
    serializer_class = BloodBankSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['city']
    search_fields = ['name', 'hospital_name', 'city']

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        blood_bank = self.get_object()
        availability = {
            'A+': blood_bank.a_positive_units,
            'A-': blood_bank.a_negative_units,
            'B+': blood_bank.b_positive_units,
            'B-': blood_bank.b_negative_units,
            'AB+': blood_bank.ab_positive_units,
            'AB-': blood_bank.ab_negative_units,
            'O+': blood_bank.o_positive_units,
            'O-': blood_bank.o_negative_units,
        }
        return Response({
            'blood_bank': blood_bank.name,
            'availability': availability
        })
