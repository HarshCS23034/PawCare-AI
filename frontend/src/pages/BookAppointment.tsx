import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Calendar as CalendarIcon, Stethoscope, CheckCircle, MapPin } from 'lucide-react';

export default function BookAppointment() {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [clinic, setClinic] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookingData, setBookingData] = useState({
    pet_id: '',
    service_type: '',
    date: '',
    time: ''
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [clinicRes, petsRes] = await Promise.all([
          fetch(`https://pawcare-backend.onrender.com/vets/${clinicId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('https://pawcare-backend.onrender.com/pets/', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (clinicRes.ok && petsRes.ok) {
          const c = await clinicRes.json();
          const p = await petsRes.json();
          setClinic(c);
          setPets(p);
          if (p.length > 0) {
            setBookingData(prev => ({ ...prev, pet_id: p[0].id.toString() }));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [clinicId]);

  useEffect(() => {
    if (bookingData.date) {
      const fetchSlots = async () => {
        setSlotsLoading(true);
        try {
          const res = await fetch(`https://pawcare-backend.onrender.com/appointments/slots?clinic_id=${clinicId}&date=${bookingData.date}`);
          if (res.ok) {
            const data = await res.json();
            setAvailableSlots(data.slots);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchSlots();
    }
  }, [bookingData.date, clinicId]);

  const handleBook = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // combine date and time for backend
      const combinedDateTime = new Date(`${bookingData.date} ${bookingData.time}`).toISOString();
      
      const payload = {
        pet_id: parseInt(bookingData.pet_id),
        clinic_id: parseInt(clinicId!),
        service_type: bookingData.service_type,
        scheduled_at: combinedDateTime
      };

      const res = await fetch('https://pawcare-backend.onrender.com/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to book appointment');
      }
      
      setStep(5); // Success step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Details' },
    { id: 2, label: 'Date' },
    { id: 3, label: 'Time' },
    { id: 4, label: 'Confirm' }
  ];

  if (loading && step === 1) return <div className="text-center py-20 animate-pulse text-slate-500">Preparing booking...</div>;
  if (!clinic) return <div className="text-center py-20 text-slate-500">Clinic not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {step < 5 && (
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
            <p className="text-slate-500 text-sm">{clinic.name}</p>
          </div>
        </div>
      )}

      {step < 5 && (
        <div className="flex justify-between mb-8 px-2 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {steps.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                step > s.id ? 'bg-orange-500 border-orange-500 text-white' : 
                step === s.id ? 'border-orange-500 text-orange-500 bg-white' : 
                'border-slate-300 text-slate-400 bg-white'
              }`}>
                {step > s.id ? <Check size={16} /> : s.id}
              </div>
              <span className={`text-xs font-medium ${step >= s.id ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[300px]">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Which pet needs care?</label>
              {pets.length === 0 ? (
                <div className="text-sm text-slate-500">No pets found. Please add a pet first.</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {pets.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setBookingData({...bookingData, pet_id: p.id.toString()})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${bookingData.pet_id === p.id.toString() ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200'}`}
                    >
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.species}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Service Type</label>
              <div className="space-y-2">
                {clinic.services.split(',').map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setBookingData({...bookingData, service_type: s.trim()})}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${bookingData.service_type === s.trim() ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200'}`}
                  >
                    <span className="font-medium text-slate-800">{s.trim()}</span>
                    {bookingData.service_type === s.trim() && <CheckCircle size={18} className="text-orange-500" />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!bookingData.pet_id || !bookingData.service_type}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold mt-4 disabled:opacity-50 hover:bg-orange-600 transition"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Select a Date</label>
              {/* Native date picker for simplicity */}
              <input 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg text-slate-700"
              />
              <p className="text-xs text-slate-500 mt-2 ml-1">Try selecting Dec 25, 2026 for a mock "fully booked" scenario.</p>
            </div>

            <button 
              onClick={() => setStep(3)}
              disabled={!bookingData.date}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold mt-4 disabled:opacity-50 hover:bg-orange-600 transition"
            >
              Show Available Times
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Available Times for {bookingData.date}</label>
              {slotsLoading ? (
                <div className="text-slate-500 text-sm animate-pulse">Loading slots...</div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-center">
                  Fully booked on this date. Please go back and select another date.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setBookingData({...bookingData, time})}
                      className={`p-3 text-sm font-medium rounded-xl border-2 transition-all ${bookingData.time === time ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-700 hover:border-orange-200'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => setStep(4)}
              disabled={!bookingData.time}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold mt-4 disabled:opacity-50 hover:bg-orange-600 transition"
            >
              Review Booking
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Confirm Appointment</h2>
            
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
              <div className="flex items-start gap-3">
                <Stethoscope className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Service</p>
                  <p className="text-slate-900 font-semibold">{bookingData.service_type} for {pets.find(p => p.id.toString() === bookingData.pet_id)?.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CalendarIcon className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-slate-500 font-medium">When</p>
                  <p className="text-slate-900 font-semibold">{bookingData.date} at {bookingData.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Where</p>
                  <p className="text-slate-900 font-semibold">{clinic.name}</p>
                  <p className="text-sm text-slate-600">{clinic.address}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBook}
              disabled={loading}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold mt-4 disabled:opacity-75 hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h2>
              <p className="text-slate-600">We've booked your visit to {clinic.name}.</p>
            </div>
            
            <div className="pt-4 space-y-3">
              <button onClick={() => alert('Added to calendar // MOCK')} className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition">
                Add to Calendar
              </button>
              <button onClick={() => navigate('/dashboard')} className="w-full py-3 text-orange-600 font-medium hover:text-orange-700 transition">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
