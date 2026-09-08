import { Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse, Clock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] flex items-center gap-2">
          <HeartPulse /> PawCare AI
        </h1>
        <nav>
          <Link to="/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Sign In
          </Link>
          <Link to="/signin" className="ml-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-dark)] transition">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 max-w-2xl leading-tight">
          Calm, expert guidance for your pet's health
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Describe symptoms, understand the urgency, and safely decide next steps without the panic of a Google search.
        </p>
        <div className="mt-8">
          <Link to="/signin" className="px-8 py-3 text-lg font-medium text-white bg-[var(--color-primary)] rounded-full shadow-md hover:shadow-lg transition">
            Start Triage Now
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-600 rounded-full mb-4">
              <ShieldCheck />
            </div>
            <h3 className="text-lg font-bold">Safe & Accurate</h3>
            <p className="text-gray-500 mt-2 text-sm">Clear urgency classification to help you decide if it's an emergency.</p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-4">
              <Clock />
            </div>
            <h3 className="text-lg font-bold">Fast Vet Booking</h3>
            <p className="text-gray-500 mt-2 text-sm">Seamlessly find and book a nearby vet clinic directly from the app.</p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mb-4">
              <HeartPulse />
            </div>
            <h3 className="text-lg font-bold">Health History</h3>
            <p className="text-gray-500 mt-2 text-sm">Keep a complete timeline of your pet's conditions and triage sessions.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t p-4 text-center">
        <p className="text-xs text-gray-400">
          PawCare AI provides general veterinary triage information and does not replace professional veterinary diagnosis or treatment.
        </p>
      </footer>
    </div>
  );
}
