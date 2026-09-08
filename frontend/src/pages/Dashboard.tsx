import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, Info, Stethoscope, ChevronRight, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        // Mock getting user from token or context, just setting a mock for now
        // Fetch actual user
        const [userRes, petsRes, apptRes] = await Promise.all([
          fetch('https://pawcare-backend.onrender.com/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('https://pawcare-backend.onrender.com/pets/', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('https://pawcare-backend.onrender.com/appointments/', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser({ name: userData.full_name || userData.email.split('@')[0] });
        }
        if (petsRes.ok) setPets(await petsRes.json());
        if (apptRes.ok) setAppointments(await apptRes.json());
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);



  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hi, {user?.name} 👋</h1>
          <p className="text-slate-500">Here is what's happening with your pets today.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => navigate('/chat')} className="p-4 bg-orange-500 text-white rounded-3xl shadow-sm hover:shadow-md hover:bg-orange-600 transition flex flex-col items-center justify-center gap-2 group">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <span className="font-semibold text-sm">Check Symptoms</span>
        </button>
        <button onClick={() => navigate('/vets')} className="p-4 bg-white border border-slate-200 text-slate-800 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-200 transition flex flex-col items-center justify-center gap-2 group">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope size={24} />
          </div>
          <span className="font-semibold text-sm">Find a Vet</span>
        </button>
        <button onClick={() => navigate('/pets/new')} className="p-4 bg-white border border-slate-200 text-slate-800 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-200 transition flex flex-col items-center justify-center gap-2 group">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="font-semibold text-sm">Add Pet</span>
        </button>
        <button onClick={() => navigate('/how-it-works')} className="p-4 bg-slate-900 text-white rounded-3xl shadow-sm hover:shadow-md hover:bg-slate-800 transition flex flex-col items-center justify-center gap-2 group">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Info size={24} />
          </div>
          <span className="font-semibold text-sm text-center leading-tight">How It Works</span>
        </button>
      </div>

      {/* My Pets */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">My Pets</h2>
        {pets.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 border-dashed rounded-3xl text-center">
            <p className="text-slate-500 mb-4">You haven't added any pets yet.</p>
            <button onClick={() => navigate('/pets/new')} className="px-6 py-2 bg-orange-500 text-white font-medium rounded-full shadow-sm hover:bg-orange-600 transition">
              Add a Pet
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-4">
            {pets.map(pet => (
              <div key={pet.id} className="min-w-[200px] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm shrink-0 snap-start relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -z-0"></div>
                <h3 className="font-bold text-lg text-slate-900 relative z-10">{pet.name}</h3>
                <p className="text-slate-500 text-sm mb-4 relative z-10">{pet.species} • {pet.age} yrs</p>
                <button 
                  onClick={() => navigate('/chat', { state: { pet } })}
                  className="w-full py-2 bg-slate-50 text-slate-700 rounded-xl font-medium text-sm hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Triage
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-sm">
            <Calendar className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500">No upcoming appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-orange-200 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex flex-col items-center justify-center font-bold">
                    <span className="text-xs uppercase">{new Date(appt.scheduled_at).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-lg leading-none">{new Date(appt.scheduled_at).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{appt.service_type}</h4>
                    <p className="text-sm text-slate-500">
                      {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Clinic #{appt.clinic_id}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
