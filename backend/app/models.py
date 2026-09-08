from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    pets = relationship("Pet", back_populates="owner")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    species = Column(String) # Dog, Cat, etc.
    breed = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    conditions = Column(String, nullable=True)
    current_medications = Column(String, nullable=True)
    vaccination_status = Column(String, nullable=True)
    previous_medical_history = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="pets")
    chat_sessions = relationship("ChatSession", back_populates="pet")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"))
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    pet = relationship("Pet", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")
    assessment = relationship("TriageAssessment", back_populates="session", uselist=False)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    sender = Column(String) # 'user' or 'ai'
    content = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("ChatSession", back_populates="messages")

class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    severity_weight = Column(Integer, default=1)

class TriageAssessment(Base):
    __tablename__ = "triage_assessments"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    urgency_level = Column(String) # low, moderate, high, emergency
    reasoning = Column(String) # JSON or text representing bullet points
    recommended_action = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("ChatSession", back_populates="assessment")

class VeterinaryClinic(Base):
    __tablename__ = "veterinary_clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    lat = Column(String)
    lng = Column(String)
    rating = Column(String) # Float stored as String or keep simple
    hours = Column(String)
    phone = Column(String)
    services = Column(String) # comma-separated list
    emergency_available = Column(Boolean, default=False)

    veterinarians = relationship("Veterinarian", back_populates="clinic")
    appointments = relationship("Appointment", back_populates="clinic")

class Veterinarian(Base):
    __tablename__ = "veterinarians"

    id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(Integer, ForeignKey("veterinary_clinics.id"))
    name = Column(String)
    specialty = Column(String, nullable=True)

    clinic = relationship("VeterinaryClinic", back_populates="veterinarians")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pet_id = Column(Integer, ForeignKey("pets.id"))
    clinic_id = Column(Integer, ForeignKey("veterinary_clinics.id"))
    service_type = Column(String)
    scheduled_at = Column(DateTime)
    status = Column(String, default="pending") # pending, confirmed, cancelled, completed
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User")
    pet = relationship("Pet")
    clinic = relationship("VeterinaryClinic", back_populates="appointments")
