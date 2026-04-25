from smart_care.routers import RelativeURLRouter
from django.urls import path, include
from . import views
router = RelativeURLRouter() # amader router

router.register('', views.ServiceViewset) # router er antena
urlpatterns = [
    path('', include(router.urls)),
]