from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional

from .. import schemas
from ..services.vet_service import MockVetProviderService

router = APIRouter(
    prefix="/vets",
    tags=["vets"],
)

vet_service = MockVetProviderService()

@router.get("/nearby", response_model=List[schemas.VeterinaryClinic])
def get_nearby_vets(
    lat: float = Query(40.7128),
    lng: float = Query(-74.0060),
    emergency_only: bool = Query(False),
    service_type: Optional[str] = Query(None)
):
    clinics = vet_service.get_nearby_clinics(lat, lng, emergency_only, service_type)
    return clinics

@router.get("/{id}", response_model=schemas.VeterinaryClinic)
def get_clinic(id: int):
    clinic = vet_service.get_clinic(id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic
