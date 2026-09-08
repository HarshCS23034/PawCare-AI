import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog, Cat, Rabbit, Bird, HelpCircle, Plus, ChevronRight } from 'lucide-react';

export default function PetSelector() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [petName, setPetName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }
        const res = await fetch('https://pawcare-backend.onrender.com/pets/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPets(data);
          if (data.length === 0) setShowNewPetForm(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [navigate]);

  const handleCreatePet = () => {
    if (selectedSpecies && petName) {
      navigate('/pets/new', { state: { species: selectedSpecies, name: petName } });
    }
  };

  const speciesOptions = [
    { id: 'Dog', icon: Dog },
    { id: 'Cat', icon: Cat },
    { id: 'Rabbit', icon: Rabbit },
    { id: 'Bird', icon: Bird },
    { id: 'Other', icon: HelpCircle },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-pulse text-orange-500">Loading your furry friends...</div></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Who needs help today?</h1>
        <p className="text-slate-500 mt-2">Select a pet to start a triage session or add a new one.</p>
      </div>

      {!showNewPetForm && pets.length > 0 && (
        <div className="space-y-4">
          {pets.map(pet => (
            <div 
              key={pet.id} 
              onClick={() => navigate('/chat', { state: { pet } })}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-orange-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
                  {pet.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{pet.name}</h3>
                  <p className="text-sm text-slate-500">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
            </div>
          ))}
          
          <button 
            onClick={() => setShowNewPetForm(true)}
            className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium flex items-center justify-center gap-2 hover:border-orange-300 hover:text-orange-500 transition-colors"
          >
            <Plus size={20} /> Add Another Pet
          </button>
        </div>
      )}

      {showNewPetForm && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">What kind of pet is it?</h2>
            {pets.length > 0 && (
              <button onClick={() => setShowNewPetForm(false)} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {speciesOptions.map(option => {
              const Icon = option.icon;
              const isSelected = selectedSpecies === option.id;
              return (
                <div 
                  key={option.id}
                  onClick={() => setSelectedSpecies(option.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-orange-50 border-2 border-orange-500 text-orange-600 shadow-sm' : 'bg-slate-50 border-2 border-transparent text-slate-600 hover:bg-slate-100 hover:scale-105'}`}
                >
                  <Icon size={32} className="mb-2" />
                  <span className="font-medium text-sm">{option.id}</span>
                </div>
              );
            })}
          </div>

          {selectedSpecies && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4 pt-4 border-t border-slate-100">
              <label className="block font-medium text-slate-700">What should we call your furry friend?</label>
              <input 
                type="text" 
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Pet's name"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                onClick={handleCreatePet}
                disabled={!petName.trim()}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium shadow-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
