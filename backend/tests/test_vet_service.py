from app.services.vet_service import MockVetProviderService, AvailabilityService

def test_vet_service():
    service = MockVetProviderService()
    
    # Test all clinics
    all_clinics = service.get_nearby_clinics(0, 0)
    assert len(all_clinics) == 8
    
    # Test emergency only
    er_clinics = service.get_nearby_clinics(0, 0, emergency_only=True)
    assert len(er_clinics) == 3
    for c in er_clinics:
        assert c["emergency_available"] is True
        
    # Test service filter
    vaccine_clinics = service.get_nearby_clinics(0, 0, service_type="Vaccination")
    assert len(vaccine_clinics) == 4
    
    # Test get by ID
    clinic = service.get_clinic(1)
    assert clinic["name"] == "Downtown Animal Hospital"

def test_availability_service():
    service = AvailabilityService()
    
    # Normal date
    slots = service.get_available_slots(1, "2026-10-15")
    assert len(slots) > 0
    assert service.validate_slot(1, "2026-10-15", slots[0]) is True
    
    # Christmas
    xmas_slots = service.get_available_slots(1, "2026-12-25")
    assert len(xmas_slots) == 0
    assert service.validate_slot(1, "2026-12-25", "09:00 AM") is False

if __name__ == "__main__":
    test_vet_service()
    test_availability_service()
    print("Vet service tests passed!")
