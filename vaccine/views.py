from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Vaccine, VaccinationRecord, VaccineSchedule
from .serializers import VaccineSerializer, VaccinationRecordSerializer, VaccineScheduleSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class VaccineViewSet(viewsets.ModelViewSet):
    queryset = Vaccine.objects.all()
    serializer_class = VaccineSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['age_group', 'is_available']
    search_fields = ['name', 'disease_prevented', 'manufacturer']

    @action(detail=False, methods=['get'])
    def by_age_group(self, request):
        age_group = request.query_params.get('age_group')
        if not age_group:
            return Response({'error': 'age_group parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        vaccines = Vaccine.objects.filter(age_group=age_group, is_available=True)
        serializer = self.get_serializer(vaccines, many=True)
        return Response(serializer.data)


class VaccinationRecordViewSet(viewsets.ModelViewSet):
    queryset = VaccinationRecord.objects.all()
    serializer_class = VaccinationRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'vaccine']
    ordering_fields = ['scheduled_date', 'administered_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return VaccinationRecord.objects.all()
        elif hasattr(user, 'patient'):
            return VaccinationRecord.objects.filter(patient=user.patient)
        return VaccinationRecord.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'patient'):
            serializer.save(patient=self.request.user.patient)
        else:
            # If user doesn't have a patient profile, create one
            from patient.models import Patient
            patient, created = Patient.objects.get_or_create(
                user=self.request.user,
                defaults={'mobile_no': ''}
            )
            serializer.save(patient=patient)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_completed(self, request, pk=None):
        record = self.get_object()
        administered_date = request.data.get('administered_date')
        administered_by = request.data.get('administered_by', '')
        hospital_name = request.data.get('hospital_name', '')
        batch_number = request.data.get('batch_number', '')
        notes = request.data.get('notes', '')

        record.status = 'Completed'
        record.administered_date = administered_date
        record.administered_by = administered_by
        record.hospital_name = hospital_name
        record.batch_number = batch_number
        record.notes = notes
        record.save()

        return Response({
            'message': 'Vaccination marked as completed',
            'data': VaccinationRecordSerializer(record).data
        })

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        if hasattr(request.user, 'patient'):
            upcoming_records = VaccinationRecord.objects.filter(
                patient=request.user.patient,
                status='Scheduled'
            ).order_by('scheduled_date')
            serializer = self.get_serializer(upcoming_records, many=True)
            return Response(serializer.data)
        return Response([])


class VaccineScheduleViewSet(viewsets.ModelViewSet):
    queryset = VaccineSchedule.objects.all()
    serializer_class = VaccineScheduleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['age_group', 'is_recommended']

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        schedules = VaccineSchedule.objects.filter(is_recommended=True)
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)
