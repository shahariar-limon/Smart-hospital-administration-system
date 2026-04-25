from django.urls import path, include
from smart_care.routers import RelativeURLRouter
from . import views

router = RelativeURLRouter()
router.register('donors', views.BloodDonorViewSet, basename='blood-donor')
router.register('requests', views.BloodRequestViewSet, basename='blood-request')
router.register('donations', views.BloodDonationViewSet, basename='blood-donation')
router.register('banks', views.BloodBankViewSet, basename='blood-bank')

urlpatterns = [
    path('', include(router.urls)),
]
