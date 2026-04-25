from smart_care.routers import RelativeURLRouter
from django.urls import path, include
from . import views
router = RelativeURLRouter() # amader router

router.register('list', views.PatientViewset) # router er antena
urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.UserRegistrationApiView.as_view(), name='register'),
    path('login/', views.login_page, name='patient_login'),  # HTML login page
    path('api/login/', views.UserLoginApiView.as_view(), name='api_login'),  # API endpoint
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    path('active/<uid64>/<token>/', views.activate, name = 'activate'),
    path('by-user/<int:user_id>/', views.get_patient_by_user, name='patient_by_user'),
    path('edit-profile/', views.edit_profile_page, name='edit_profile'),
    path('update-profile/<int:user_id>/', views.update_patient_profile, name='update_profile'),
]