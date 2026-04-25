# smart_care/views.py

from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from . import serializers

# API-এর জন্য আপনার পুরনো কোডটি এখানে রাখা হলো
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer

# --- ওয়েবসাইট দেখানোর জন্য নতুন ফাংশনগুলো নিচে যোগ করা হলো ---

def index(request):
    # এই ফাংশনটি index.html ফাইলটি ব্রাউজারে দেখাবে
    return render(request, 'index.html')

def login(request):
    # এই ফাংশনটি login.html ফাইলটি দেখাবে
    return render(request, 'login.html')

def logout(request):
    # লগআউটের কোড এখানে লিখতে হবে, আপাতত হোমপেজে পাঠিয়ে দেওয়া হলো
    from django.shortcuts import redirect
    return redirect('home')

def registration(request):
    # এই ফাংশনটি registration.html ফাইলটি দেখাবে
    return render(request, 'registration.html')

def all_appointments(request):
    # সকল অ্যাপয়েন্টমেন্ট দেখানোর জন্য
    return render(request, 'allAppointments.html')

def doc_details(request):
    # ডাক্তারের বিস্তারিত তথ্য দেখানোর জন্য (static version)
    return render(request, 'docDetails.html')

def doc_details_dynamic(request, doctor_id):
    # ডাক্তারের বিস্তারিত তথ্য ডায়নামিক্যালি দেখানোর জন্য
    from doctor.models import Doctor, Review
    from django.shortcuts import get_object_or_404

    # ডাক্তার খুঁজে বের করা
    doctor = get_object_or_404(Doctor, id=doctor_id)

    # ডাক্তারের রিভিউ গুলো খুঁজে বের করা
    reviews = Review.objects.filter(doctor=doctor).order_by('-created')

    # Context data তৈরি করা
    context = {
        'doctor': doctor,
        'reviews': reviews,
    }

    return render(request, 'docDetails.html', context)

def pdf_view(request):
    # পিডিএফ ভিউ দেখানোর জন্য
    return render(request, 'pdf.html')

def user_details(request):
    # ব্যবহারকারীর বিস্তারিত তথ্য দেখানোর জন্য
    return render(request, 'userDetails.html')

def blood_bank_page(request):
    # Blood Bank পেজ দেখানোর জন্য
    return render(request, 'blood_bank.html')

def vaccine_page(request):
    # Vaccine পেজ দেখানোর জন্য
    return render(request, 'vaccine.html')

def contact_us_page(request):
    # Contact Us পেজ দেখানোর জন্য
    if request.method == 'POST':
        from contact_us.models import ContactUs
        from django.contrib import messages
        
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        problem = request.POST.get('problem')
        
        # ডাটাবেসে সেভ করা
        ContactUs.objects.create(
            name=name,
            phone=phone,
            problem=problem
        )
        
        messages.success(request, 'Your message has been sent successfully! We will contact you soon.')
        return render(request, 'contact_us.html')
    
    return render(request, 'contact_us.html')

def doctors_page(request):
    # Doctors পেজ দেখানোর জন্য
    return render(request, 'doctors.html')

@ensure_csrf_cookie
def book_appointment_page(request):
    # Book Appointment পেজ দেখানোর জন্য
    return render(request, 'book_appointment.html')

def about_page(request):
    # About পেজ দেখানোর জন্য
    return render(request, 'about.html')

def careers_page(request):
    # Careers পেজ দেখানোর জন্য
    return render(request, 'careers.html')

def blog_page(request):
    # Blog পেজ দেখানোর জন্য
    return render(request, 'blog.html')

def health_tips_page(request):
    # Health Tips পেজ দেখানোর জন্য
    return render(request, 'health_tips.html')

def faq_page(request):
    # FAQ পেজ দেখানোর জন্য
    return render(request, 'faq.html')

def blog_detail_page(request, blog_id):
    # Blog Detail পেজ দেখানোর জন্য
    return render(request, 'blog_detail.html', {'blog_id': blog_id})

def careers_apply_page(request):
    # Careers Apply পেজ দেখানোর জন্য
    if request.method == 'POST':
        from django.contrib import messages
        # Future: Save application to database
        messages.success(request, 'Your application has been submitted successfully! We will contact you soon.')
        return render(request, 'careers_apply.html')
    return render(request, 'careers_apply.html')

def terms_page(request):
    # Terms and Conditions পেজ দেখানোর জন্য
    return render(request, 'terms.html')

def privacy_page(request):
    # Privacy Policy পেজ দেখানোর জন্য
    return render(request, 'privacy.html')

def forgot_password_page(request):
    # Forgot Password পেজ দেখানোর জন্য
    if request.method == 'POST':
        from django.contrib import messages
        # Future: Implement password reset logic
        messages.success(request, 'Password reset link has been sent to your email!')
        return render(request, 'forgot_password.html')
    return render(request, 'forgot_password.html')

def services_page(request):
    # Services পেজ দেখানোর জন্য
    from service.models import Service
    services = Service.objects.all()
    return render(request, 'services.html', {'services': services})