import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Search, Star, Clock, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function VetFinder() {
  const [searchParams] = useSearchParams();
  const emergencyOnly = searchParams.get('emergency') === 'true';
  const navigate = useNavigate();

  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEmergency, setFilterEmergency] = useState(emergencyOnly);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://pawcare-backend.onrender.com/vets/nearby?emergency_only=${filterEmergency}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClinics(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, [filterEmergency]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar: Filters & List */}
      <div className={`w-full md:w-1/2 flex flex-col h-full ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
        <div className="mb-6 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Find a Vet</h1>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Enter your city or area..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilterEmergency(!filterEmergency)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterEmergency ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {filterEmergency && <AlertTriangle size={14} className="inline mr-1" />}
              24/7 Emergency Only
            </button>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setViewMode('map')}
              className="w-full py-2 bg-slate-100 text-slate-600 font-medium rounded-lg"
            >
              Switch to Map View
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-8">
          {loading ? (
            <div className="text-center py-10 text-slate-500 animate-pulse">Loading clinics...</div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-10 text-slate-500">We couldn't find nearby veterinary clinics. Try expanding your search area.</div>
          ) : (
            clinics.map(clinic => (
              <div key={clinic.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{clinic.name}</h3>
                  {clinic.emergency_available && (
                    <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded flex items-center gap-1">
                      <AlertTriangle size={12} /> 24/7
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {clinic.address}</div>
                  <div className="flex items-center gap-2"><Star size={14} className="text-orange-400" /> {clinic.rating} / 5.0</div>
                  <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /> {clinic.hours}</div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/vets/${clinic.id}`)}
                    className="flex-1 py-2 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition text-sm"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate(`/book/${clinic.id}`)}
                    className="flex-1 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-sm"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map View */}
      <div className={`w-full md:w-1/2 h-full bg-slate-200 rounded-3xl overflow-hidden relative border border-slate-200 ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
        <MapContainer center={[19.0760, 72.8777]} zoom={11} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clinics.map(clinic => (
            <Marker key={clinic.id} position={[parseFloat(clinic.lat), parseFloat(clinic.lng)]}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-slate-900 mb-1">{clinic.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{clinic.address}</p>
                  <button 
                    onClick={() => navigate(`/vets/${clinic.id}`)}
                    className="w-full py-1.5 bg-orange-500 text-white rounded text-xs font-bold"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="absolute top-4 left-4 z-[400] md:hidden">
            <button 
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg shadow-sm border border-slate-200"
            >
              Switch to List View
            </button>
          </div>
      </div>
    </div>
  );
}
