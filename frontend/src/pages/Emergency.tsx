import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, Navigation } from 'lucide-react';

export default function Emergency() {
  const location = useLocation();
  const navigate = useNavigate();
  const assessment = location.state?.assessment;
  const pet = location.state?.pet;

  let reasons = [];
  if (assessment) {
    try {
      reasons = JSON.parse(assessment.reasoning);
    } catch {
      reasons = [assessment.reasoning];
    }
  }

  const handleCallEmergency = () => {
    // Just pop up or use a tel link for top emergency clinic
    window.location.href = "tel:555-0911";
  };

  const handleFindClinic = () => {
    navigate('/vets?emergency=true');
  };

  const handleDirections = () => {
    alert("Opening directions in Maps... // MOCK");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-red-600 p-8 rounded-3xl shadow-lg text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">🚨 Possible Emergency</h1>
        <p className="text-red-100">
          This situation requires immediate professional attention for {pet?.name || 'your pet'}.
        </p>
      </div>

      {reasons.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100">
          <h3 className="font-semibold text-red-900 mb-2">Detected Red Flags:</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {reasons.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <button 
          onClick={handleCallEmergency}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-sm hover:bg-slate-800 transition flex items-center justify-center gap-3"
        >
          <Phone size={20} /> Contact Emergency Vet
        </button>
        <button 
          onClick={handleFindClinic}
          className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-3"
        >
          <MapPin size={20} /> Find Emergency Clinic
        </button>
        <button 
          onClick={handleDirections}
          className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-3"
        >
          <Navigation size={20} /> Get Directions
        </button>
      </div>
      
      <button 
        onClick={() => navigate('/dashboard')}
        className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
