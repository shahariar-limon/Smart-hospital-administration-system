from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from smart_care.routers import RelativeURLRouter
from . import views

router = RelativeURLRouter()
router.register('requests', views.EmergencyRequestViewSet, basename='emergency-request')
router.register('ambulances', views.AmbulanceViewSet, basename='ambulance')
router.register('contacts', views.EmergencyContactViewSet, basename='emergency-contact')

urlpatterns = [
    path('', views.emergency_page, name='emergency_page'),
    path('api/', include(router.urls)),
]
