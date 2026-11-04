'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  
  // --- LOADING STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ANIMATION TIMER ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowLogin(true); // Show login card after loading
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('accessToken', 'fake-token');
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      if (data.user.class) localStorage.setItem('userClass', data.user.class);
      if (data.user.admissionNumber) localStorage.setItem('userAdmission', data.user.admissionNumber);

      toast.success("Login successful!");

      if (data.role === 'admin') router.push('/dashboard/admin');
      else if (data.role === 'teacher') router.push('/dashboard/teacher');
      else if (data.role === 'parent') router.push('/dashboard/parent');
      else router.push('/dashboard/student');
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  // --- LOADING SCREEN ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#0f172a] to-[#0f172a] z-0" />
        
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1200">
          <div className="w-40 h-40 bg-white rounded-full p-4 shadow-[0_0_40px_rgba(59,130,246,0.5)] mb-8 animate-pulse">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-widest">AM/ NUGELANDA M V</h1>
          <p className="text-blue-300 font-medium mb-8">Student Portal</p>
          
          {/* Loading Spinner */}
          <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // --- MAIN LOGIN PAGE ---
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0f172a]">
      
      {/* Deep Blue Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#0f172a] to-[#0f172a] z-0" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"></div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        
        {/* The White Login Card */}
        {showLogin && (
          <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-700">
            
            <div className="relative p-10">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* Logo & Header */}
              <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-slate-100 p-2 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                  </div>
                </div>
                <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                <p className="text-[15px] text-slate-500 mt-1 font-medium">Sign in to AM/ Nugelanda M V Portal</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="student@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-bold text-slate-700">Password</label>
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3b28cc] hover:bg-[#2d1da8] text-white rounded-xl py-3.5 font-bold text-lg shadow-lg shadow-[#3b28cc]/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                <p>Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline ml-1">Sign up here</Link></p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}