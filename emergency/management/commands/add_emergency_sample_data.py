from django.core.management.base import BaseCommand
from emergency.models import Ambulance, EmergencyContact


class Command(BaseCommand):
    help = 'Add sample ambulances and emergency contacts'

    def handle(self, *args, **kwargs):
        # Create sample ambulances
        ambulances = [
            {
                'vehicle_number': 'DH-1234',
                'driver_name': 'Karim Ahmed',
                'driver_phone': '01712345678',
                'hospital_name': 'Dhaka Medical College Hospital',
                'hospital_address': 'Secretariat Rd, Dhaka 1000',
                'hospital_phone': '02-8626812',
                'is_available': True
            },
            {
                'vehicle_number': 'DH-5678',
                'driver_name': 'Rahim Miah',
                'driver_phone': '01812345678',
                'hospital_name': 'Square Hospital',
                'hospital_address': '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205',
                'hospital_phone': '09666-771111',
                'is_available': True
            },
            {
                'vehicle_number': 'DH-9012',
                'driver_name': 'Hasan Ali',
                'driver_phone': '01912345678',
                'hospital_name': 'Apollo Hospitals Dhaka',
                'hospital_address': 'Plot-81, Block-E, Bashundhara R/A, Dhaka-1229',
                'hospital_phone': '10678',
                'is_available': False
            },
        ]

        for amb_data in ambulances:
            ambulance, created = Ambulance.objects.get_or_create(
                vehicle_number=amb_data['vehicle_number'],
                defaults=amb_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created ambulance: {ambulance.vehicle_number}'))
            else:
                self.stdout.write(self.style.WARNING(f'Ambulance already exists: {ambulance.vehicle_number}'))

        # Create sample emergency contacts
        contacts = [
            {
                'name': 'National Emergency Service',
                'designation': 'Emergency Coordinator',
                'phone': '999',
                'email': 'emergency@gov.bd',
                'hospital_name': 'Government Emergency Service',
                'address': 'Dhaka, Bangladesh',
                'is_24x7': True
            },
            {
                'name': 'Fire Service and Civil Defence',
                'designation': 'Fire Officer',
                'phone': '102',
                'email': 'info@fireservice.gov.bd',
                'hospital_name': 'Fire Service Headquarters',
                'address': 'Fire Service Complex, Mirpur Road, Dhaka',
                'is_24x7': True
            },
            {
                'name': 'Dr. Shahidul Islam',
                'designation': 'Emergency Physician',
                'phone': '01711223344',
                'email': 'dr.shahidul@dmch.bd',
                'hospital_name': 'Dhaka Medical College Hospital',
                'address': 'Secretariat Rd, Dhaka 1000',
                'is_24x7': True
            },
            {
                'name': 'Square Hospital Emergency',
                'designation': 'Emergency Department',
                'phone': '09666-771111',
                'email': 'emergency@squarehospital.com',
                'hospital_name': 'Square Hospital',
                'address': '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205',
                'is_24x7': True
            },
        ]

        for contact_data in contacts:
            contact, created = EmergencyContact.objects.get_or_create(
                phone=contact_data['phone'],
                defaults=contact_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created contact: {contact.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Contact already exists: {contact.name}'))

        self.stdout.write(self.style.SUCCESS('\nSample data added successfully!'))
