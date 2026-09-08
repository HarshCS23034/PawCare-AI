import json
import sys
from app.triage_engine import process_message

def test_emergency_short_circuit():
    pet_context = {"species": "Dog", "name": "Buddy", "history": []}
    result = process_message("He has been vomiting.", pet_context)
    assert result["is_complete"] == False
    pet_context["symptoms"] = result["extracted_symptoms"]
    pet_context["history"].append({"sender": "user", "content": "He has been vomiting."})
    result2 = process_message("Now he has breathing difficulty.", pet_context)
    assert result2["is_complete"] == True
    assert result2["assessment"]["urgency_level"] == "emergency"

def test_normal_flow_escalation():
    pet_context = {"species": "Cat", "name": "Whiskers", "history": []}
    result = process_message("She is limping.", pet_context)
    assert result["is_complete"] == False
    pet_context["symptoms"] = result["extracted_symptoms"]
    for i in range(4):
        pet_context["history"].append({"sender": "user", "content": "Still limping."})
    result_final = process_message("That's it.", pet_context)
    assert result_final["is_complete"] == True
    assert result_final["assessment"]["urgency_level"] in ["moderate", "low"]

def test_multiple_symptoms_high_urgency():
    pet_context = {"species": "Dog", "name": "Rex", "history": [{"sender": "user", "content": "x"} for _ in range(4)]}
    result = process_message("He is vomiting and has diarrhea.", pet_context)
    assert result["is_complete"] == True
    assert result["assessment"]["urgency_level"] == "high"

if __name__ == "__main__":
    test_emergency_short_circuit()
    test_normal_flow_escalation()
    test_multiple_symptoms_high_urgency()
    print("All tests passed!")
