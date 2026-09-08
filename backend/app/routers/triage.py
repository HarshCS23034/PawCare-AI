from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, auth, database

router = APIRouter(
    prefix="/triage",
    tags=["triage"],
)

@router.get("/history", response_model=List[schemas.TriageAssessment])
def get_triage_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get all assessments for pets owned by current user
    assessments = (
        db.query(models.TriageAssessment)
        .join(models.ChatSession)
        .join(models.Pet)
        .filter(models.Pet.owner_id == current_user.id)
        .all()
    )
    return assessments

@router.get("/{id}", response_model=schemas.TriageAssessment)
def get_triage_assessment(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    assessment = db.query(models.TriageAssessment).filter(models.TriageAssessment.id == id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    # Verify ownership
    chat_session = db.query(models.ChatSession).filter(models.ChatSession.id == assessment.session_id).first()
    pet = db.query(models.Pet).filter(models.Pet.id == chat_session.pet_id).first()
    if pet.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return assessment
