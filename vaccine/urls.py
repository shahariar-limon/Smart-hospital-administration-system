from django.urls import path, include
from smart_care.routers import RelativeURLRouter
from . import views

router = RelativeURLRouter()
router.register('vaccines', views.VaccineViewSet, basename='vaccine')
router.register('records', views.VaccinationRecordViewSet, basename='vaccination-record')
router.register('schedules', views.VaccineScheduleViewSet, basename='vaccine-schedule')

urlpatterns = [
    path('', include(router.urls)),
]
