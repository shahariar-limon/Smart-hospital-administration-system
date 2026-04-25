from django.urls import path, include
from smart_care.routers import RelativeURLRouter
from . import views

router = RelativeURLRouter()
router.register('doctors', views.BurnDoctorViewSet, basename='burn-doctor')
router.register('patients', views.BurnPatientViewSet, basename='burn-patient')
router.register('treatments', views.BurnTreatmentViewSet, basename='burn-treatment')
router.register('units', views.BurnUnitViewSet, basename='burn-unit')

urlpatterns = [
    path('', views.burn_unit_page, name='burn_unit_page'),
    path('api/', include(router.urls)),
]
