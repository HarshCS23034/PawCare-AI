import json
from typing import List, Dict, Any

EMERGENCY_KEYWORDS = [
    "breathing difficulty", "collapse", "unconsciousness", "severe bleeding", 
    "prolonged seizure", "suspected poisoning", "severe trauma", 
    "inability to urinate", "severe allergic reaction", "blue gums", "pale gums",
    "choking", "hit by car", "unresponsive"
]

def detect_red_flags(text: str) -> bool:
    """Check if the text contains any emergency red-flag symptoms."""
    text_lower = text.lower()
    for keyword in EMERGENCY_KEYWORDS:
        if keyword in text_lower:
            return True
    return False

def extract_symptoms(message: str) -> List[str]:
    """Mock extraction of symptoms from free text."""
    symptoms = []
    message_lower = message.lower()
    common_symptoms = ["vomiting", "diarrhea", "limping", "not eating", "lethargic", "fever", "coughing", "sneezing", "bleeding"]
    for sym in common_symptoms:
        if sym in message_lower:
            symptoms.append(sym.capitalize())
    return symptoms

def determine_urgency(symptoms: List[str], pet_context: Dict[str, Any], has_red_flag: bool) -> Dict[str, Any]:
    """Determine the urgency level based on symptoms and context."""
    if has_red_flag:
        return {
            "urgency_level": "emergency",
            "reasoning": json.dumps(["Detected emergency red-flag symptom", "Immediate veterinary care required"]),
            "recommended_action": "Go to the nearest emergency veterinary clinic immediately.",
            "recommend_vet": True
        }
    
    if "Vomiting" in symptoms and "Diarrhea" in symptoms:
        return {
            "urgency_level": "high",
            "reasoning": json.dumps(["Multiple gastrointestinal symptoms present", "Risk of dehydration"]),
            "recommended_action": "Contact your veterinarian as soon as possible.",
            "recommend_vet": True
        }
    
    if len(symptoms) > 0:
        return {
            "urgency_level": "moderate",
            "reasoning": json.dumps(["Symptom(s) present requiring monitoring", "Not immediately life-threatening"]),
            "recommended_action": "Monitor your pet closely. If symptoms worsen, contact a vet.",
            "recommend_vet": True
        }
        
    return {
        "urgency_level": "low",
        "reasoning": json.dumps(["No severe symptoms detected"]),
        "recommended_action": "Continue normal care. Keep an eye out for any changes.",
        "recommend_vet": False
    }

def generate_next_question(context: Dict[str, Any]) -> str:
    """Determine the next question to ask based on context."""
    history = context.get("history", [])
    if len(history) == 0:
        return "What seems to be the problem with your pet today?"
    elif len(history) < 4:
        return "Can you provide a bit more detail? For example, how long has this been going on or are there any other unusual behaviors?"
    else:
        return "I think I have enough information now. Let me summarize and evaluate the situation."

def process_message(message: str, pet_context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main pipeline to process a new message.
    Returns a dict with either the next question or the final assessment if red-flag/done.
    """
    is_emergency = detect_red_flags(message)
    extracted = extract_symptoms(message)
    
    # In a real app, we'd append extracted symptoms to session context
    all_symptoms = pet_context.get("symptoms", []) + extracted
    
    if is_emergency:
        assessment = determine_urgency(all_symptoms, pet_context, True)
        return {
            "is_complete": True,
            "response": "I detected a potential emergency symptom. Please seek veterinary care immediately.",
            "assessment": assessment,
            "extracted_symptoms": extracted
        }
        
    history = pet_context.get("history", [])
    if len(history) >= 4:
        assessment = determine_urgency(all_symptoms, pet_context, False)
        return {
            "is_complete": True,
            "response": "Based on what you've told me, here is my assessment.",
            "assessment": assessment,
            "extracted_symptoms": extracted
        }
    
    return {
        "is_complete": False,
        "response": generate_next_question(pet_context),
        "assessment": None,
        "extracted_symptoms": extracted
    }
