import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, AlertTriangle, ChevronLeft, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function ClinicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/vets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClinic(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClinic();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 animate-pulse">Loading clinic details...</div>;
  }

  if (!clinic) {
    return <div className="text-center py-20 text-slate-500">Clinic not found.</div>;
  }

  const services = clinic.services.split(',');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition"
      >
        <ChevronLeft size={20} /> Back to Search
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Map Header */}
        <div className="h-48 w-full relative z-0">
          <MapContainer center={[parseFloat(clinic.lat), parseFloat(clinic.lng)]} zoom={15} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[parseFloat(clinic.lat), parseFloat(clinic.lng)]}>
              <Popup>{clinic.name}</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{clinic.name}</h1>
              {clinic.emergency_available && (
                <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-center gap-1">
                  <AlertTriangle size={14} /> 24/7 ER
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1"><Star size={16} className="text-orange-400" /> {clinic.rating} / 5.0</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={16} /> {clinic.hours}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            <a href={`tel:${clinic.phone}`} className="flex items-center gap-3 text-slate-700 hover:text-orange-600 transition">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><Phone size={18} /></div>
              <span className="font-medium text-lg">{clinic.phone}</span>
            </a>
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><MapPin size={18} /></div>
              <span className="font-medium">{clinic.address}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-3">Available Services</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-sm">
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => navigate(`/book/${clinic.id}`)}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-sm hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <Calendar size={20} /> Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
