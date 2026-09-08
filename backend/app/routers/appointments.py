from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, auth, database
from ..services.vet_service import AvailabilityService

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
)

availability_service = AvailabilityService()

@router.get("/", response_model=List[schemas.Appointment])
def get_appointments(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    appointments = db.query(models.Appointment).filter(models.Appointment.user_id == current_user.id).order_by(models.Appointment.scheduled_at.desc()).all()
    return appointments

@router.post("/", response_model=schemas.Appointment)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify pet belongs to user
    pet = db.query(models.Pet).filter(models.Pet.id == appointment.pet_id, models.Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    # Validate slot availability (Mocking time extraction from datetime for the mock service)
    date_str = appointment.scheduled_at.strftime("%Y-%m-%d")
    time_str = appointment.scheduled_at.strftime("%I:%M %p")
    
    if not availability_service.validate_slot(appointment.clinic_id, date_str, time_str):
        raise HTTPException(status_code=400, detail="Time slot is not available")
        
    db_appointment = models.Appointment(
        **appointment.model_dump(),
        user_id=current_user.id,
        status="confirmed" # Auto-confirm for this MVP
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/slots")
def get_available_slots(clinic_id: int, date: str):
    slots = availability_service.get_available_slots(clinic_id, date)
    return {"slots": slots}
