import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        const res = await fetch('https://pawcare-backend-kpao.onrender.com/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Sign up failed');
        }
        setIsSignUp(false); // Switch to sign in after successful sign up
        setPassword('');
        alert('Sign up successful! Please sign in.');
      } else {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const res = await fetch('https://pawcare-backend-kpao.onrender.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Sign in failed');
        }
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard'); // Navigate to a dashboard (we will build this)
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-rose-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-4">
            <HeartPulse size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-sm text-gray-500 mt-1">{isSignUp ? 'Sign up to get started' : 'Sign in to manage your pets'}</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium shadow-sm hover:bg-[var(--color-primary-dark)] transition mt-6"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-[var(--color-primary)] font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
