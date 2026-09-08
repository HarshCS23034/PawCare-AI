from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[str] = None
    allergies: Optional[str] = None
    conditions: Optional[str] = None
    current_medications: Optional[str] = None
    vaccination_status: Optional[str] = None
    previous_medical_history: Optional[str] = None

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    pets: List[Pet] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ChatMessageBase(BaseModel):
    sender: str
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatSessionBase(BaseModel):
    pet_id: int

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    active: bool
    created_at: datetime
    messages: List[ChatMessage] = []

    class Config:
        from_attributes = True

class SymptomBase(BaseModel):
    name: str
    description: Optional[str] = None
    severity_weight: int = 1

class Symptom(SymptomBase):
    id: int

    class Config:
        from_attributes = True

class TriageAssessmentBase(BaseModel):
    urgency_level: str
    reasoning: str
    recommended_action: str

class TriageAssessmentCreate(TriageAssessmentBase):
    session_id: int

class TriageAssessment(TriageAssessmentBase):
    id: int
    session_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class VeterinaryClinicBase(BaseModel):
    name: str
    address: str
    lat: str
    lng: str
    rating: str
    hours: str
    phone: str
    services: str
    emergency_available: bool

class VeterinaryClinic(VeterinaryClinicBase):
    id: int

    class Config:
        from_attributes = True

class VeterinarianBase(BaseModel):
    name: str
    specialty: Optional[str] = None

class Veterinarian(VeterinarianBase):
    id: int
    clinic_id: int

    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    pet_id: int
    clinic_id: int
    service_type: str
    scheduled_at: datetime
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    notes: Optional[str] = None

class Appointment(AppointmentBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
