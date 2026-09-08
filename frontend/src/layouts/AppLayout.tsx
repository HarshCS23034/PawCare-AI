import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Stethoscope, MapPin, Calendar, User, Info, MessageSquare } from 'lucide-react';

export default function AppLayout() {
  const desktopNavItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'My Pets', path: '/pets', icon: User },
    { name: 'Check Symptoms', path: '/chat', icon: MessageSquare },
    { name: 'Find a Vet', path: '/vets', icon: MapPin },
    { name: 'How It Works', path: '/how-it-works', icon: Info },
  ];

  const mobileNavItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Vets', path: '/vets', icon: MapPin },
    { name: 'Pets', path: '/pets', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-16 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-20">
        <div className="p-6">
          <NavLink to="/dashboard" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <span>🐾</span> PawCare AI
          </NavLink>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Persistent Disclaimer (Sidebar) */}
        <div className="p-4 mt-auto">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-xs text-amber-800 leading-relaxed font-medium">
            PawCare AI provides general veterinary triage information and does not replace professional veterinary diagnosis or treatment.
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 h-16 flex items-center justify-between">
          <NavLink to="/dashboard" className="text-xl font-bold text-orange-500 flex items-center gap-2">
            <span>🐾</span> PawCare AI
          </NavLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      {/* Persistent Disclaimer (Mobile Bottom) */}
      <div className="md:hidden bg-amber-100 border-t border-amber-200 p-3 text-center text-xs text-amber-800 font-medium pb-20">
        PawCare AI provides general veterinary triage information and does not replace professional diagnosis.
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-20 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'fill-orange-100' : ''} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
