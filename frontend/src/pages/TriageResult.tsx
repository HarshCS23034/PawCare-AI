import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Stethoscope } from 'lucide-react';

export default function TriageResult() {
  const location = useLocation();
  const navigate = useNavigate();
  // In a real app we'd fetch if no state: const { id } = useParams();
  
  const assessment = location.state?.assessment;
  const pet = location.state?.pet;

  if (!assessment) {
    return <div className="text-center mt-20">Loading assessment...</div>;
  }

  const getUrgencyConfig = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: '🟢 Low Urgency' };
      case 'moderate': return { icon: Info, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '🟡 Moderate Urgency' };
      case 'high': return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', label: '🟠 High Urgency' };
      default: return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: '🔴 Unknown' };
    }
  };

  const config = getUrgencyConfig(assessment.urgency_level);
  const Icon = config.icon;
  
  let reasons = [];
  try {
    reasons = JSON.parse(assessment.reasoning);
  } catch {
    reasons = [assessment.reasoning];
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Triage Result</h1>
        <p className="text-slate-500">For {pet?.name}</p>
      </div>

      <div className={`p-6 rounded-3xl border border-slate-100 shadow-sm ${config.bg} flex flex-col items-center text-center`}>
        <Icon size={48} className={`mb-4 ${config.color}`} />
        <h2 className={`text-xl font-bold ${config.color}`}>{config.label}</h2>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Why?</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {reasons.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-2">Recommended Next Step</h3>
          <p className="text-slate-700">{assessment.recommended_action}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => navigate('/vets')}
          className="w-full py-4 bg-orange-500 text-white rounded-2xl font-semibold shadow-sm hover:bg-orange-600 transition flex items-center justify-center gap-2"
        >
          <Stethoscope size={20} /> Find a Vet
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-medium hover:bg-slate-50 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
