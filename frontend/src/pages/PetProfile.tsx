import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

export default function PetProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state || { species: '', name: '' };
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialState.name || '',
    species: initialState.species || 'Dog',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    allergies: '',
    conditions: '',
    current_medications: '',
    vaccination_status: '',
    previous_medical_history: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null
      };

      const res = await fetch('http://localhost:8000/pets/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        throw new Error('Failed to save pet profile');
      }
      
      const newPet = await res.json();
      navigate('/chat', { state: { pet: newPet } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate('/pets')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 1 ? 'Pet Basics' : 'Health Details'}
          </h1>
          <p className="text-slate-500 text-sm">Step {step} of 2</p>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Species *</label>
                <select name="species" value={formData.species} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Breed (Optional)</label>
                <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age (Years)</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} min="0" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (lbs/kg)</label>
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 15 lbs" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>
            
            <button 
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.species}
              className="w-full py-3 mt-6 bg-orange-500 text-white rounded-xl font-medium shadow-sm hover:bg-orange-600 transition disabled:opacity-50"
            >
              Continue to Health Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-slate-500 mb-4">Adding these optional details helps PawCare AI provide better triage guidance.</p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Known Allergies</label>
              <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g. Chicken, Penicillin" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Existing Conditions</label>
              <input type="text" name="conditions" value={formData.conditions} onChange={handleChange} placeholder="e.g. Diabetes, Arthritis" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
              <input type="text" name="current_medications" value={formData.current_medications} onChange={handleChange} placeholder="e.g. Insulin, Rimadyl" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vaccination Status</label>
              <input type="text" name="vaccination_status" value={formData.vaccination_status} onChange={handleChange} placeholder="e.g. Up to date, Due next month" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Previous Medical History</label>
              <textarea name="previous_medical_history" value={formData.previous_medical_history} onChange={handleChange} placeholder="Any major past surgeries or illnesses..." rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" />
            </div>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 mt-6 bg-orange-500 text-white rounded-xl font-medium shadow-sm hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {loading ? 'Saving...' : <><Save size={18} /> Save & Start Triage</>}
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 mt-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition"
            >
              Skip & Start Triage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
