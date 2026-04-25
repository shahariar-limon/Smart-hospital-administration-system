import os
import django
from datetime import date, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_care.settings')
django.setup()

from django.contrib.auth.models import User
from doctor.models import Doctor
from patient.models import Patient
from burn_unit.models import BurnDoctor, BurnPatient, BurnTreatment, BurnUnit

print("=" * 70)
print("POPULATING BURN UNIT DATABASE")
print("=" * 70)

# Create Burn Units
burn_units_data = [
    {
        'name': 'Central Burn Care Unit',
        'hospital_name': 'Dhaka Medical College Hospital',
        'address': 'Bakshibazar, Dhaka',
        'city': 'Dhaka',
        'phone': '+880-2-86546789',
        'emergency_contact': '999',
        'email': 'burns@dmch.gov.bd',
        'total_beds': 30,
        'available_beds': 12,
        'has_icu': True,
        'has_operation_theater': True,
        'is_24x7': True,
        'facilities': 'Advanced wound care, Skin grafting, ICU, Burn reconstruction surgery, Rehabilitation',
    },
    {
        'name': 'Specialized Burn Treatment Center',
        'hospital_name': 'Square Hospital',
        'address': '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath',
        'city': 'Dhaka',
        'phone': '+880-2-8159457',
        'emergency_contact': '999',
        'email': 'burns@squarehospital.com',
        'total_beds': 20,
        'available_beds': 8,
        'has_icu': True,
        'has_operation_theater': True,
        'is_24x7': True,
        'facilities': 'State-of-the-art burn unit, Hyperbaric oxygen therapy, Plastic surgery, Pain management',
    },
    {
        'name': 'Emergency Burn Unit',
        'hospital_name': 'Chittagong Medical College Hospital',
        'address': 'K.B. Fazlul Kader Road, Chittagong',
        'city': 'Chittagong',
        'phone': '+880-31-614444',
        'emergency_contact': '999',
        'email': 'burns@cmch.gov.bd',
        'total_beds': 25,
        'available_beds': 10,
        'has_icu': True,
        'has_operation_theater': True,
        'is_24x7': True,
        'facilities': 'Emergency burn care, Intensive care, Skin grafting, Physiotherapy',
    },
    {
        'name': 'Apollo Burn Care',
        'hospital_name': 'Apollo Hospitals Dhaka',
        'address': 'Plot 81, Block E, Basundhara R/A',
        'city': 'Dhaka',
        'phone': '+880-2-8401661',
        'emergency_contact': '999',
        'email': 'burns@apollodhaka.com',
        'total_beds': 15,
        'available_beds': 5,
        'has_icu': True,
        'has_operation_theater': True,
        'is_24x7': True,
        'facilities': 'Comprehensive burn care, Advanced dressing techniques, Laser therapy, Scar management',
    },
]

print("\nCreating Burn Units...")
burn_units = []
for unit_data in burn_units_data:
    unit, created = BurnUnit.objects.get_or_create(
        name=unit_data['name'],
        defaults=unit_data
    )
    burn_units.append(unit)
    if created:
        print(f"  [+] Created: {unit.name} - {unit.hospital_name}")
    else:
        print(f"  [=] Already exists: {unit.name}")

# Create Burn Doctors
print("\nCreating Burn Specialist Doctors...")

burn_doctors_data = [
    {
        'username': 'dr.burn.ahmed',
        'first_name': 'Ahmed',
        'last_name': 'Karim',
        'email': 'ahmed.karim@burncare.com',
        'password': 'doctor123',
        'specialization': 'Burn and Plastic Surgery',
        'years_of_experience': 15,
        'certifications': 'MBBS, FCPS (Surgery), Fellowship in Burn Care (UK)',
        'is_available': True,
    },
    {
        'username': 'dr.burn.sarah',
        'first_name': 'Sarah',
        'last_name': 'Rahman',
        'email': 'sarah.rahman@burncare.com',
        'password': 'doctor123',
        'specialization': 'Burn Critical Care',
        'years_of_experience': 12,
        'certifications': 'MBBS, MD (Critical Care), Advanced Burn Life Support (ABLS)',
        'is_available': True,
    },
    {
        'username': 'dr.burn.hassan',
        'first_name': 'Hassan',
        'last_name': 'Ali',
        'email': 'hassan.ali@burncare.com',
        'password': 'doctor123',
        'specialization': 'Plastic and Reconstructive Surgery',
        'years_of_experience': 18,
        'certifications': 'MBBS, MS (Plastic Surgery), FRCS',
        'is_available': True,
    },
    {
        'username': 'dr.burn.nadia',
        'first_name': 'Nadia',
        'last_name': 'Sultana',
        'email': 'nadia.sultana@burncare.com',
        'password': 'doctor123',
        'specialization': 'Burn Wound Management',
        'years_of_experience': 10,
        'certifications': 'MBBS, FCPS (Surgery), Certificate in Burn Wound Care',
        'is_available': False,
    },
    {
        'username': 'dr.burn.ibrahim',
        'first_name': 'Ibrahim',
        'last_name': 'Khan',
        'email': 'ibrahim.khan@burncare.com',
        'password': 'doctor123',
        'specialization': 'Burn Rehabilitation',
        'years_of_experience': 8,
        'certifications': 'MBBS, MD (Physical Medicine), Burn Rehabilitation Specialist',
        'is_available': True,
    },
]

burn_doctors = []
for doc_data in burn_doctors_data:
    # Create or get user
    user, user_created = User.objects.get_or_create(
        username=doc_data['username'],
        defaults={
            'first_name': doc_data['first_name'],
            'last_name': doc_data['last_name'],
            'email': doc_data['email'],
        }
    )

    if user_created:
        user.set_password(doc_data['password'])
        user.save()

    # Create base Doctor profile (required by BurnDoctor)
    doctor, doctor_created = Doctor.objects.get_or_create(
        user=user,
        defaults={
            'fee': 2000,
            'meet_link': f'https://meet.google.com/burn-{doc_data["username"]}',
            'image': 'doctor/images/default_doctor.jpg',
        }
    )

    # Create BurnDoctor
    burn_doctor, burn_doc_created = BurnDoctor.objects.get_or_create(
        doctor=doctor,
        defaults={
            'specialization': doc_data['specialization'],
            'years_of_experience': doc_data['years_of_experience'],
            'certifications': doc_data['certifications'],
            'is_available': doc_data['is_available'],
        }
    )

    burn_doctors.append(burn_doctor)
    if burn_doc_created:
        print(f"  [+] Created: Dr. {doc_data['first_name']} {doc_data['last_name']} - {doc_data['specialization']}")
    else:
        print(f"  [=] Already exists: Dr. {doc_data['first_name']} {doc_data['last_name']}")

# Create Sample Patients and Burn Cases
print("\nCreating Sample Burn Patients...")

# First, let's create some sample patients if they don't exist
sample_patients_data = [
    {
        'username': 'patient.john',
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'mobile_no': '+8801712345678',
        'image': 'patient/images/default_patient.jpg',
    },
    {
        'username': 'patient.jane',
        'first_name': 'Jane',
        'last_name': 'Smith',
        'email': 'jane.smith@example.com',
        'mobile_no': '+8801787654321',
        'image': 'patient/images/default_patient.jpg',
    },
    {
        'username': 'patient.kamal',
        'first_name': 'Kamal',
        'last_name': 'Hossain',
        'email': 'kamal.hossain@example.com',
        'mobile_no': '+8801698765432',
        'image': 'patient/images/default_patient.jpg',
    },
]

patients = []
for patient_data in sample_patients_data:
    user, user_created = User.objects.get_or_create(
        username=patient_data['username'],
        defaults={
            'first_name': patient_data['first_name'],
            'last_name': patient_data['last_name'],
            'email': patient_data['email'],
        }
    )

    if user_created:
        user.set_password('patient123')
        user.save()

    patient, patient_created = Patient.objects.get_or_create(
        user=user,
        defaults={
            'mobile_no': patient_data['mobile_no'],
            'image': patient_data['image'],
        }
    )
    patients.append(patient)

# Create Burn Patient Cases
burn_patient_cases = [
    {
        'patient': patients[0],
        'burn_severity': 'Second Degree',
        'affected_area_percentage': 15.5,
        'burn_location': 'Right hand and forearm',
        'cause_of_burn': 'Hot water spill while cooking',
        'admission_date': date.today() - timedelta(days=10),
        'status': 'Under Treatment',
        'assigned_doctor': burn_doctors[0],
        'room_number': 'B-101',
    },
    {
        'patient': patients[1],
        'burn_severity': 'Third Degree',
        'affected_area_percentage': 25.0,
        'burn_location': 'Chest, abdomen, and both arms',
        'cause_of_burn': 'House fire accident',
        'admission_date': date.today() - timedelta(days=20),
        'status': 'Recovering',
        'assigned_doctor': burn_doctors[1],
        'room_number': 'B-205',
    },
    {
        'patient': patients[2],
        'burn_severity': 'First Degree',
        'affected_area_percentage': 8.0,
        'burn_location': 'Left leg below knee',
        'cause_of_burn': 'Motorcycle exhaust burn',
        'admission_date': date.today() - timedelta(days=30),
        'discharge_date': date.today() - timedelta(days=5),
        'status': 'Discharged',
        'assigned_doctor': burn_doctors[2],
        'room_number': 'B-102',
    },
]

burn_patients = []
for bp_data in burn_patient_cases:
    burn_patient, bp_created = BurnPatient.objects.get_or_create(
        patient=bp_data['patient'],
        admission_date=bp_data['admission_date'],
        defaults=bp_data
    )
    burn_patients.append(burn_patient)
    if bp_created:
        print(f"  [+] Created burn case: {burn_patient.patient.user.get_full_name()} - {burn_patient.burn_severity}")

# Create Treatment Records
print("\nCreating Treatment Records...")

treatments_data = [
    {
        'burn_patient': burn_patients[0],
        'treatment_date': date.today() - timedelta(days=10),
        'treatment_type': 'Initial Wound Dressing',
        'medications': 'Silver sulfadiazine cream, Ibuprofen 400mg, Ciprofloxacin 500mg',
        'notes': 'Patient admitted with second-degree burns. Initial cleaning and dressing performed. Pain management initiated.',
        'performed_by': burn_doctors[0],
    },
    {
        'burn_patient': burn_patients[0],
        'treatment_date': date.today() - timedelta(days=7),
        'treatment_type': 'Wound Dressing Change',
        'medications': 'Silver sulfadiazine cream, Acetaminophen 500mg',
        'notes': 'Wound showing signs of healing. No infection detected. Continue current treatment.',
        'performed_by': burn_doctors[0],
    },
    {
        'burn_patient': burn_patients[1],
        'treatment_date': date.today() - timedelta(days=20),
        'treatment_type': 'Emergency Debridement',
        'medications': 'Morphine 10mg IV, Ceftriaxone 1g IV, Tetanus prophylaxis',
        'notes': 'Extensive third-degree burns. Emergency debridement performed. Patient in ICU.',
        'performed_by': burn_doctors[1],
    },
    {
        'burn_patient': burn_patients[1],
        'treatment_date': date.today() - timedelta(days=15),
        'treatment_type': 'Skin Grafting - Phase 1',
        'medications': 'General anesthesia, Cefazolin 2g IV',
        'notes': 'First phase of skin grafting completed on chest area. Procedure successful.',
        'performed_by': burn_doctors[2],
    },
    {
        'burn_patient': burn_patients[1],
        'treatment_date': date.today() - timedelta(days=10),
        'treatment_type': 'Post-operative Care',
        'medications': 'Tramadol 50mg, Cephalexin 500mg',
        'notes': 'Graft showing good vascularization. Patient recovering well.',
        'performed_by': burn_doctors[1],
    },
    {
        'burn_patient': burn_patients[2],
        'treatment_date': date.today() - timedelta(days=30),
        'treatment_type': 'Minor Burn Treatment',
        'medications': 'Aloe vera gel, Ibuprofen 200mg',
        'notes': 'First-degree burn. Applied cooling treatment and prescribed topical medication.',
        'performed_by': burn_doctors[2],
    },
    {
        'burn_patient': burn_patients[2],
        'treatment_date': date.today() - timedelta(days=20),
        'treatment_type': 'Follow-up Examination',
        'medications': 'Moisturizing cream',
        'notes': 'Burn healing well. Patient can be discharged with home care instructions.',
        'performed_by': burn_doctors[2],
    },
]

for treatment_data in treatments_data:
    treatment, treatment_created = BurnTreatment.objects.get_or_create(
        burn_patient=treatment_data['burn_patient'],
        treatment_date=treatment_data['treatment_date'],
        treatment_type=treatment_data['treatment_type'],
        defaults=treatment_data
    )
    if treatment_created:
        print(f"  [+] Created treatment: {treatment.treatment_type} for {treatment.burn_patient.patient.user.get_full_name()}")

print("\n" + "=" * 70)
print("BURN UNIT DATABASE POPULATED SUCCESSFULLY!")
print("=" * 70)
print(f"Total Burn Units:           {BurnUnit.objects.count()}")
print(f"Total Burn Specialists:     {BurnDoctor.objects.count()}")
print(f"Total Burn Patients:        {BurnPatient.objects.count()}")
print(f"Total Treatment Records:    {BurnTreatment.objects.count()}")
print("\n" + "=" * 70)
print("Available Burn Specialists: {}/{}".format(
    BurnDoctor.objects.filter(is_available=True).count(),
    BurnDoctor.objects.count()
))
print(f"Active Patients:            {BurnPatient.objects.exclude(status='Discharged').count()}")
print(f"Available Beds:             {sum(unit.available_beds for unit in BurnUnit.objects.all())}")
print("=" * 70)
print("\nYou can now access the burn unit page at: http://127.0.0.1:8000/burn_unit/")
print("=" * 70)
