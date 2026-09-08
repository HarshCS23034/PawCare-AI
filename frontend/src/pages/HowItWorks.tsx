import { ShieldAlert, Stethoscope, Search, MessageCircle, AlertTriangle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Describe Symptoms",
      description: "Start a chat and tell us what's wrong with your pet in your own words.",
      icon: MessageCircle,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      id: 2,
      title: "AI Asks Questions",
      description: "Our triage engine asks targeted follow-up questions to understand the situation better.",
      icon: Search,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      id: 3,
      title: "Identifies Urgency",
      description: "The AI flags if the symptoms point to an immediate emergency, high, moderate, or low urgency.",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      id: 4,
      title: "General Guidance",
      description: "You receive a summary of possible causes and next steps to keep your pet comfortable.",
      icon: ShieldAlert,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      id: 5,
      title: "Connect with a Vet",
      description: "If needed, seamlessly find local clinics and book an appointment directly through the app.",
      icon: Stethoscope,
      color: "text-rose-500",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">How PawCare AI Works</h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          We combine smart AI triage with local clinic booking to get your pet the right care at the right time.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-amber-900 mb-2 flex items-center justify-center gap-2">
          <AlertTriangle size={24} /> Important Disclaimer
        </h2>
        <p className="text-amber-800 text-lg font-medium">
          AI guidance is not a veterinary diagnosis.
        </p>
        <p className="text-amber-700 mt-2">
          PawCare AI provides general triage information to help you make informed decisions. 
          It does not replace professional veterinary advice, diagnosis, or treatment. 
          If you suspect a life-threatening emergency, please contact an emergency clinic immediately.
        </p>
      </div>

      <div className="space-y-6 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute left-[39px] top-[40px] bottom-[40px] w-0.5 bg-slate-200 -z-10"></div>
        
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col md:flex-row gap-4 md:gap-6 items-start bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${step.bg} ${step.color} shadow-sm mx-auto md:mx-0`}>
              <step.icon size={32} />
            </div>
            <div className="text-center md:text-left pt-1">
              <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Step {step.id}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
