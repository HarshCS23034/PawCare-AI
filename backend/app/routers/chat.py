from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from slowapi import Limiter
from slowapi.util import get_remote_address

from .. import models, schemas, auth, database
from ..triage_engine import process_message

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.post("/session", response_model=schemas.ChatSession)
def create_chat_session(
    session_data: schemas.ChatSessionCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify pet belongs to user
    pet = db.query(models.Pet).filter(models.Pet.id == session_data.pet_id, models.Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    db_session = models.ChatSession(pet_id=pet.id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/message")
def send_message(
    message_data: dict, # expects {"session_id": int, "content": str}
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    session_id = message_data.get("session_id")
    content = message_data.get("content")
    
    if not session_id or not content:
        raise HTTPException(status_code=400, detail="session_id and content required")
        
    chat_session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not chat_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # In a real app, verify that chat_session.pet.owner_id == current_user.id
    pet = db.query(models.Pet).filter(models.Pet.id == chat_session.pet_id).first()
    if pet.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized for this session")

    # Save user message
    user_msg = models.ChatMessage(session_id=session_id, sender="user", content=content)
    db.add(user_msg)
    
    # Retrieve past messages to build context
    past_msgs = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.timestamp.asc()).all()
    history = [{"sender": m.sender, "content": m.content} for m in past_msgs]
    
    pet_context = {
        "species": pet.species,
        "age": pet.age,
        "conditions": pet.conditions,
        "history": history
    }
    
    # Process through triage engine
    result = process_message(content, pet_context)
    
    # Save AI response
    ai_msg = models.ChatMessage(session_id=session_id, sender="ai", content=result["response"])
    db.add(ai_msg)
    
    # If complete, save assessment
    if result["is_complete"] and result["assessment"]:
        assessment_data = result["assessment"]
        assessment = models.TriageAssessment(
            session_id=session_id,
            urgency_level=assessment_data["urgency_level"],
            reasoning=assessment_data["reasoning"],
            recommended_action=assessment_data["recommended_action"]
        )
        db.add(assessment)
        chat_session.active = False
        
    db.commit()
    
    return {
        "response": result["response"],
        "is_complete": result["is_complete"],
        "assessment": result["assessment"]
    }
