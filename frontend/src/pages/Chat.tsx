import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { Send, PawPrint } from 'lucide-react';

const COMMON_SYMPTOMS = ["Vomiting", "Diarrhea", "Low energy", "Coughing", "Bleeding", "Not eating", "Limping", "Fever", "Breathing problem"];

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, pet, messages, isTyping, setSessionId, setPet, addMessage, setIsTyping, resetChat } = useChatStore();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    const passedPet = location.state?.pet;
    if (passedPet) {
      if (pet?.id !== passedPet.id) {
        resetChat();
        setPet(passedPet);
        createSession(passedPet.id);
      }
    } else if (!pet) {
      navigate('/pets');
    }
  }, [location.state, pet, navigate]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const createSession = async (petId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://pawcare-backend.onrender.com/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pet_id: petId })
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.id);
        addMessage({ id: Date.now().toString(), sender: 'ai', content: `Hi, I'm here to help with ${location.state?.pet?.name || 'your pet'}. What symptoms are you noticing today?` });
      }
    } catch (e) {
      console.error('Failed to create session', e);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId) return;
    
    // Add user message to UI
    addMessage({ id: Date.now().toString(), sender: 'user', content });
    setInputValue('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://pawcare-backend.onrender.com/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ session_id: sessionId, content })
      });
      
      if (!res.ok) throw new Error('Failed to send message');
      
      const data = await res.json();
      setIsTyping(false);
      
      // Add AI response
      addMessage({ id: (Date.now() + 1).toString(), sender: 'ai', content: data.response });

      // Handle completion
      if (data.is_complete && data.assessment) {
        setTimeout(() => {
          if (data.assessment.urgency_level === 'emergency') {
            navigate('/emergency', { state: { assessment: data.assessment, pet } });
          } else {
            // Create assessment object that looks like the DB response
            const triageData = {
              ...data.assessment,
              id: sessionId // Using session ID as proxy if real ID not returned
            };
            navigate(`/triage-result/${sessionId}`, { state: { assessment: triageData, pet } });
          }
        }, 2000);
      }

    } catch (e) {
      console.error(e);
      setIsTyping(false);
      addMessage({ id: Date.now().toString(), sender: 'ai', content: "We lost connection for a moment. Please try again." });
    }
  };

  const handleChipClick = (symptom: string) => {
    sendMessage(symptom);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            Triage for {pet?.name}
          </h2>
          <p className="text-xs text-slate-500">AI guidance is not a diagnosis</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              msg.sender === 'user' 
                ? 'bg-orange-500 text-white rounded-br-sm' 
                : 'bg-slate-100 text-slate-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Initial chips (only show if just one AI message) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in">
            {COMMON_SYMPTOMS.map(sym => (
              <button 
                key={sym} 
                onClick={() => handleChipClick(sym)}
                className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-100 hover:bg-orange-100 hover:border-orange-200 transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
              <PawPrint size={16} className="text-slate-400 animate-bounce" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Type your message..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 transition"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
