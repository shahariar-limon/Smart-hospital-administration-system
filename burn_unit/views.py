from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from .models import BurnDoctor, BurnPatient, BurnTreatment, BurnUnit
from .serializers import BurnDoctorSerializer, BurnPatientSerializer, BurnTreatmentSerializer, BurnUnitSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


def burn_unit_page(request):
    """Render the burn unit services page"""
    return render(request, 'burn_unit.html')


class BurnDoctorViewSet(viewsets.ModelViewSet):
    queryset = BurnDoctor.objects.all()
    serializer_class = BurnDoctorSerializer
    authentication_classes = [TokenAuthentication]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_available']
    search_fields = ['doctor__user__first_name', 'doctor__user__last_name', 'specialization']

    @action(detail=False, methods=['get'])
    def available(self, request):
        available_doctors = BurnDoctor.objects.filter(is_available=True)
        serializer = self.get_serializer(available_doctors, many=True)
        return Response(serializer.data)


class BurnPatientViewSet(viewsets.ModelViewSet):
    queryset = BurnPatient.objects.all()
    serializer_class = BurnPatientSerializer
    authentication_classes = [TokenAuthentication]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['burn_severity', 'status']
    ordering_fields = ['admission_date', 'discharge_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BurnPatient.objects.all()
        elif hasattr(user, 'patient'):
            return BurnPatient.objects.filter(patient=user.patient)
        return BurnPatient.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign_doctor(self, request, pk=None):
        burn_patient = self.get_object()
        doctor_id = request.data.get('doctor_id')

        try:
            doctor = BurnDoctor.objects.get(id=doctor_id, is_available=True)
            burn_patient.assigned_doctor = doctor
            burn_patient.save()

            return Response({
                'message': 'Doctor assigned successfully',
                'data': BurnPatientSerializer(burn_patient).data
            })
        except BurnDoctor.DoesNotExist:
            return Response(
                {'error': 'Doctor not found or not available'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def discharge(self, request, pk=None):
        burn_patient = self.get_object()
        discharge_date = request.data.get('discharge_date')

        burn_patient.status = 'Discharged'
        burn_patient.discharge_date = discharge_date
        burn_patient.save()

        return Response({'message': 'Patient discharged successfully'})


class BurnTreatmentViewSet(viewsets.ModelViewSet):
    queryset = BurnTreatment.objects.all()
    serializer_class = BurnTreatmentSerializer
    authentication_classes = [TokenAuthentication]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['burn_patient', 'performed_by']
    ordering_fields = ['treatment_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BurnTreatment.objects.all()
        elif hasattr(user, 'patient'):
            return BurnTreatment.objects.filter(burn_patient__patient=user.patient)
        return BurnTreatment.objects.all()


class BurnUnitViewSet(viewsets.ModelViewSet):
    queryset = BurnUnit.objects.all()
    serializer_class = BurnUnitSerializer
    authentication_classes = [TokenAuthentication]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['city', 'is_24x7', 'has_icu']
    search_fields = ['name', 'hospital_name', 'city']

    @action(detail=False, methods=['get'])
    def available_beds(self, request):
        units_with_beds = BurnUnit.objects.filter(available_beds__gt=0)
        serializer = self.get_serializer(units_with_beds, many=True)
        return Response(serializer.data)
