import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_care.settings')
django.setup()

from django.contrib.auth.models import User
from doctor.models import Doctor, Specialization, Designation, AvailableTime

# Create Specializations
specializations_data = [
    {'name': 'Cardiology', 'slug': 'cardiology'},
    {'name': 'Neurology', 'slug': 'neurology'},
    {'name': 'Pediatrics', 'slug': 'pediatrics'},
    {'name': 'Orthopedics', 'slug': 'orthopedics'},
    {'name': 'Dermatology', 'slug': 'dermatology'},
    {'name': 'ENT', 'slug': 'ent'},
    {'name': 'General Medicine', 'slug': 'general-medicine'},
    {'name': 'Gynecology', 'slug': 'gynecology'},
]

print("Creating Specializations...")
specializations = {}
for spec_data in specializations_data:
    spec, created = Specialization.objects.get_or_create(**spec_data)
    specializations[spec_data['name']] = spec
    if created:
        print(f"  [+] Created: {spec.name}")

# Create Designations
designations_data = [
    {'name': 'MBBS', 'slug': 'mbbs'},
    {'name': 'MD', 'slug': 'md'},
    {'name': 'MS', 'slug': 'ms'},
    {'name': 'FCPS', 'slug': 'fcps'},
    {'name': 'PhD', 'slug': 'phd'},
]

print("\nCreating Designations...")
designations = {}
for desig_data in designations_data:
    desig, created = Designation.objects.get_or_create(**desig_data)
    designations[desig_data['name']] = desig
    if created:
        print(f"  [+] Created: {desig.name}")

# Create Available Times
times_data = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
]

print("\nCreating Available Times...")
available_times = []
for time_slot in times_data:
    time, created = AvailableTime.objects.get_or_create(name=time_slot)
    available_times.append(time)
    if created:
        print(f"  [+] Created: {time.name}")

# Create Sample Doctors
doctors_data = [
    {
        'username': 'dr.ahmed',
        'first_name': 'Ahmed',
        'last_name': 'Rahman',
        'email': 'ahmed.rahman@smartcare.com',
        'password': 'doctor123',
        'specialization': ['Cardiology'],
        'designation': ['MBBS', 'MD'],
        'fee': 1500,
        'meet_link': 'https://meet.google.com/cardio-ahmed',
        'time_slots': [0, 1, 2],  # indices of available_times
    },
    {
        'username': 'dr.fatima',
        'first_name': 'Fatima',
        'last_name': 'Khan',
        'email': 'fatima.khan@smartcare.com',
        'password': 'doctor123',
        'specialization': ['Neurology'],
        'designation': ['MBBS', 'FCPS'],
        'fee': 1800,
        'meet_link': 'https://meet.google.com/neuro-fatima',
        'time_slots': [1, 2, 3],
    },
    {
        'username': 'dr.karim',
        'first_name': 'Karim',
        'last_name': 'Hassan',
        'email': 'karim.hassan@smartcare.com',
        'password': 'doctor123',
        'specialization': ['Pediatrics'],
        'designation': ['MBBS', 'MD'],
        'fee': 1200,
        'meet_link': 'https://meet.google.com/pedia-karim',
        'time_slots': [2, 3, 4, 5],
    },
    {
        'username': 'dr.nasrin',
        'first_name': 'Nasrin',
        'last_name': 'Akter',
        'email': 'nasrin.akter@smartcare.com',
        'password': 'doctor123',
        'specialization': ['Gynecology'],
        'designation': ['MBBS', 'FCPS'],
        'fee': 1600,
        'meet_link': 'https://meet.google.com/gyno-nasrin',
        'time_slots': [3, 4, 5, 6],
    },
    {
        'username': 'dr.islam',
        'first_name': 'Mohammad',
        'last_name': 'Islam',
        'email': 'mohammad.islam@smartcare.com',
        'password': 'doctor123',
        'specialization': ['Orthopedics'],
        'designation': ['MBBS', 'MS'],
        'fee': 2000,
        'meet_link': 'https://meet.google.com/ortho-islam',
        'time_slots': [0, 1, 4, 5],
    },
    {
        'username': 'dr.sultana',
        'first_name': 'Sultana',
        'last_name': 'Begum',
        'email': 'sultana.begum@smartcare.com',
        'password': 'doctor123',
        'specialization': ['Dermatology'],
        'designation': ['MBBS', 'MD'],
        'fee': 1400,
        'meet_link': 'https://meet.google.com/derm-sultana',
        'time_slots': [1, 2, 5, 6],
    },
    {
        'username': 'dr.hasan',
        'first_name': 'Hasan',
        'last_name': 'Ali',
        'email': 'hasan.ali@smartcare.com',
        'password': 'doctor123',
        'specialization': ['ENT'],
        'designation': ['MBBS', 'FCPS'],
        'fee': 1300,
        'meet_link': 'https://meet.google.com/ent-hasan',
        'time_slots': [2, 3, 6, 7],
    },
    {
        'username': 'dr.parvin',
        'first_name': 'Parvin',
        'last_name': 'Chowdhury',
        'email': 'parvin.chowdhury@smartcare.com',
        'password': 'doctor123',
        'specialization': ['General Medicine'],
        'designation': ['MBBS'],
        'fee': 1000,
        'meet_link': 'https://meet.google.com/general-parvin',
        'time_slots': [0, 1, 2, 3, 4],
    },
]

print("\nCreating Doctors...")
for doctor_data in doctors_data:
    # Create or get user
    user, user_created = User.objects.get_or_create(
        username=doctor_data['username'],
        defaults={
            'first_name': doctor_data['first_name'],
            'last_name': doctor_data['last_name'],
            'email': doctor_data['email'],
        }
    )

    if user_created:
        user.set_password(doctor_data['password'])
        user.save()

    # Create doctor if doesn't exist
    doctor, doctor_created = Doctor.objects.get_or_create(
        user=user,
        defaults={
            'fee': doctor_data['fee'],
            'meet_link': doctor_data['meet_link'],
            'image': 'doctor/images/default_doctor.jpg',  # You can add actual images later
        }
    )

    if doctor_created or True:  # Always update relationships
        # Add specializations
        for spec_name in doctor_data['specialization']:
            doctor.specialization.add(specializations[spec_name])

        # Add designations
        for desig_name in doctor_data['designation']:
            doctor.designation.add(designations[desig_name])

        # Add available times
        for time_idx in doctor_data['time_slots']:
            doctor.available_time.add(available_times[time_idx])

        doctor.save()
        print(f"  [+] Created: Dr. {doctor_data['first_name']} {doctor_data['last_name']} ({', '.join(doctor_data['specialization'])})")

print("\n" + "="*60)
print("Database populated successfully!")
print("="*60)
print(f"Total Specializations: {Specialization.objects.count()}")
print(f"Total Designations: {Designation.objects.count()}")
print(f"Total Available Times: {AvailableTime.objects.count()}")
print(f"Total Doctors: {Doctor.objects.count()}")
print("\nYou can now access the book appointment page and see the doctors in the dropdown!")
