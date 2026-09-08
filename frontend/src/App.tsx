import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import AppLayout from './layouts/AppLayout';
import PetSelector from './pages/PetSelector';
import PetProfile from './pages/PetProfile';
import Chat from './pages/Chat';
import TriageResult from './pages/TriageResult';
import Emergency from './pages/Emergency';

const VetFinder = lazy(() => import('./pages/VetFinder'));
const ClinicDetail = lazy(() => import('./pages/ClinicDetail'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Authenticated Routes wrapped in AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets" element={<PetSelector />} />
        <Route path="/pets/new" element={<PetProfile />} />
        <Route path="/pets/:id/edit" element={<PetProfile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/triage-result/:id" element={<TriageResult />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route 
          path="/vets" 
          element={
            <Suspense fallback={<div className="p-10 text-center text-slate-500 animate-pulse">Loading Map...</div>}>
              <VetFinder />
            </Suspense>
          } 
        />
        <Route 
          path="/vets/:id" 
          element={
            <Suspense fallback={<div className="p-10 text-center text-slate-500 animate-pulse">Loading Clinic...</div>}>
              <ClinicDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/book/:clinicId" 
          element={
            <Suspense fallback={<div className="p-10 text-center text-slate-500 animate-pulse">Loading Booking...</div>}>
              <BookAppointment />
            </Suspense>
          } 
        />
        <Route 
          path="/how-it-works" 
          element={
            <Suspense fallback={<div className="p-10 text-center text-slate-500 animate-pulse">Loading...</div>}>
              <HowItWorks />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
