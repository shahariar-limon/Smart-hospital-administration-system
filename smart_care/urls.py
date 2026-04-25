# smart_care/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from smart_care.routers import RelativeURLRouter
from . import views  # smart_care ফোল্ডারের views.py ফাইলকে ইম্পোর্ট করা হলো

# API রাউটার সেটআপ
router = RelativeURLRouter()
router.register('users', views.UserViewSet) # এটি User সম্পর্কিত API তৈরি করবে

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # 1. হোমপেজ, লগইন, রেজিস্ট্রেশন ইত্যাদি দেখানোর জন্য URL
    path('', views.index, name='home'),  # মূল URL (হোমপেজ)
    path('index.html', views.index, name='home_html'),  # index.html দিয়ে এক্সেস
    path('login/', views.login, name='login'), # লগইন পেজের URL
    path('login.html', views.login, name='login_html'), # login.html দিয়ে এক্সেস
    path('logout/', views.logout, name='logout'), # লগআউট করার URL
    path('logout.html', views.logout, name='logout_html'), # logout.html দিয়ে এক্সেস
    path('registration/', views.registration, name='registration'), # রেজিস্ট্রেশন পেজের URL
    path('registration.html', views.registration, name='registration_html'), # registration.html দিয়ে এক্সেস
    path('allAppointments.html', views.all_appointments, name='all_appointments'), # সকল অ্যাপয়েন্টমেন্ট
    path('docDetails.html', views.doc_details, name='doc_details'), # ডাক্তারের বিস্তারিত (old static version)
    path('doctor/<int:doctor_id>/', views.doc_details_dynamic, name='doc_details_dynamic'), # ডাক্তারের বিস্তারিত (dynamic)
    path('pdf.html', views.pdf_view, name='pdf'), # পিডিএফ ভিউ
    path('userDetails.html', views.user_details, name='user_details'), # ব্যবহারকারীর বিস্তারিত
    path('bloodbank.html', views.blood_bank_page, name='blood_bank_page'), # ব্লাড ব্যাংক পেজ

    # 2. অন্যান্য অ্যাপের URL গুলোকে যুক্ত করা
    path('contact_us/', include('contact_us.urls')),
    path('services/', include('service.urls')),
    path('patient/', include('patient.urls')),
    path('doctor/', include('doctor.urls')),
    path('appointment/', include('appointment.urls')),

    # Blood Bank HTML page
    path('blood_bank/', views.blood_bank_page, name='blood_bank'),

    # Vaccine HTML page
    path('vaccination/', views.vaccine_page, name='vaccination'),
    
    # Contact Us HTML page
    path('contact/', views.contact_us_page, name='contact_us_page'),

    # Doctors page
    path('doctors/', views.doctors_page, name='doctors_page'),
    
    # Services page
    path('services-page/', views.services_page, name='services_page'),

    # Book Appointment page
    path('book-appointment/', views.book_appointment_page, name='book_appointment'),

    # Footer pages
    path('about/', views.about_page, name='about_page'),
    path('careers/', views.careers_page, name='careers_page'),
    path('careers/apply/', views.careers_apply_page, name='careers_apply_page'),
    path('blog/', views.blog_page, name='blog_page'),
    path('blog/<int:blog_id>/', views.blog_detail_page, name='blog_detail_page'),
    path('health-tips/', views.health_tips_page, name='health_tips_page'),
    path('faq/', views.faq_page, name='faq_page'),
    path('terms/', views.terms_page, name='terms_page'),
    path('privacy/', views.privacy_page, name='privacy_page'),
    path('forgot-password/', views.forgot_password_page, name='forgot_password_page'),

    # New app URLs
    path('emergency/', include('emergency.urls')),
    path('blood_bank/api/', include('blood_bank.urls')),
    path('vaccine/', include('vaccine.urls')),
    path('burn_unit/', include('burn_unit.urls')),

    # 3. API গুলোকে '/api/' লিঙ্কের অধীনে রাখা হয়েছে
    path('api/', include(router.urls)),
]

# মিডিয়া ফাইল (যেমন ছবি) দেখানোর জন্য এই লাইনটি জরুরি
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)