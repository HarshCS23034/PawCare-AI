from typing import List, Dict, Any
from datetime import datetime, timedelta
import math

# MOCK — replace with real Places/Booking API later

MOCK_CLINICS = [
    {
        "id": 1,
        "name": "Crown Vet",
        "address": "Mahalaxmi, Mumbai",
        "lat": "18.9827",
        "lng": "72.8197",
        "rating": "4.8",
        "hours": "Open 24/7",
        "phone": "022-55550101",
        "services": "General Consultation,Vaccination,Surgery,ICU",
        "emergency_available": True
    },
    {
        "id": 2,
        "name": "Happy Tails Veterinary Clinic",
        "address": "Khar West, Mumbai",
        "lat": "19.0700",
        "lng": "72.8400",
        "rating": "4.6",
        "hours": "Mon-Sat: 10am-8pm",
        "phone": "022-55550911",
        "services": "General Consultation,Vaccination",
        "emergency_available": False
    },
    {
        "id": 3,
        "name": "Dr. Lele's Pet Clinic",
        "address": "Andheri West, Mumbai",
        "lat": "19.1363",
        "lng": "72.8277",
        "rating": "4.9",
        "hours": "Mon-Sat: 9am-9pm",
        "phone": "022-55550202",
        "services": "General Consultation,Dental,Surgery",
        "emergency_available": False
    },
    {
        "id": 4,
        "name": "PetCare 24x7 Emergency",
        "address": "Bandra East, Mumbai",
        "lat": "19.0600",
        "lng": "72.8500",
        "rating": "4.5",
        "hours": "Open 24/7",
        "phone": "022-55550999",
        "services": "Emergency Consultation,Trauma,Surgery",
        "emergency_available": True
    },
    {
        "id": 5,
        "name": "Advanced Pet Hospital",
        "address": "Powai, Mumbai",
        "lat": "19.1200",
        "lng": "72.9060",
        "rating": "4.7",
        "hours": "Mon-Sun: 8am-10pm",
        "phone": "022-55550303",
        "services": "General Consultation,Vaccination,Diagnostic Imaging",
        "emergency_available": False
    },
    {
        "id": 6,
        "name": "Acme Vet Clinic",
        "address": "Goregaon East, Mumbai",
        "lat": "19.1650",
        "lng": "72.8550",
        "rating": "4.2",
        "hours": "Mon-Fri: 9am-7pm",
        "phone": "022-55550404",
        "services": "General Consultation,Grooming",
        "emergency_available": False
    },
    {
        "id": 7,
        "name": "Colaba Animal Hospital",
        "address": "Colaba, Mumbai",
        "lat": "18.9150",
        "lng": "72.8100",
        "rating": "4.4",
        "hours": "Open 24/7",
        "phone": "022-55550505",
        "services": "General Consultation,Vaccination,Emergency Consultation",
        "emergency_available": True
    },
    {
        "id": 8,
        "name": "Exotic Pet Care",
        "address": "Juhu, Mumbai",
        "lat": "19.1000",
        "lng": "72.8250",
        "rating": "4.8",
        "hours": "Tue-Sun: 10am-6pm",
        "phone": "022-55550606",
        "services": "General Consultation,Exotics",
        "emergency_available": False
    }
]

class VetProviderService:
    def get_nearby_clinics(self, lat: float, lng: float, emergency_only: bool = False, service_type: str = None) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def get_clinic(self, clinic_id: int) -> Dict[str, Any]:
        raise NotImplementedError

class MockVetProviderService(VetProviderService):
    def get_nearby_clinics(self, lat: float, lng: float, emergency_only: bool = False, service_type: str = None) -> List[Dict[str, Any]]:
        results = MOCK_CLINICS
        if emergency_only:
            results = [c for c in results if c["emergency_available"]]
        if service_type:
            results = [c for c in results if service_type.lower() in c["services"].lower()]
            
        # Mock distance sorting (just return as is for mock, or sort by arbitrary math)
        return results

    def get_clinic(self, clinic_id: int) -> Dict[str, Any]:
        for c in MOCK_CLINICS:
            if c["id"] == clinic_id:
                return c
        return None

class AvailabilityService:
    def get_available_slots(self, clinic_id: int, date_str: str) -> List[str]:
        # Mock: return some slots, but make "2026-12-25" (Christmas) fully booked as a test case
        if "12-25" in date_str:
            return []
        
        return ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"]
    
    def validate_slot(self, clinic_id: int, date_str: str, time_str: str) -> bool:
        slots = self.get_available_slots(clinic_id, date_str)
        return time_str in slots
