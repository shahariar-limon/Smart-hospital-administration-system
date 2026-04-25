from django.urls import include, path
from smart_care.routers import RelativeURLRouter
from . import views

router = RelativeURLRouter() # wifi toiri korlam
router.register('', views.AppointmentViewSet) # ekta entena toiri korlam

urlpatterns = [
    path('', include(router.urls)),
]

