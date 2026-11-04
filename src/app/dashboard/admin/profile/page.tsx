'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Shield, Camera } from 'lucide-react';

export default function AdminProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const email = localStorage.getItem('userEmail');
      if (!email) return window.location.href = '/login';

      try {
        const res = await fetch(`/api/profile?email=${email}`);
        if (res.ok) setProfile(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Admin Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-600 text-5xl font-bold mb-6 overflow-hidden">
           {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{profile.name}</h2>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
          {profile.role}
        </span>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><Mail size={14}/> Email</p>
            <p className="text-sm font-medium text-slate-800">{profile.email}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><Calendar size={14}/> Birthday</p>
            <p className="text-sm font-medium text-slate-800">{profile.birthday || 'Not provided'}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><User size={14}/> Gender</p>
            <p className="text-sm font-medium text-slate-800">{profile.gender || 'Not provided'}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><Shield size={14}/> System Role</p>
            <p className="text-sm font-medium text-slate-800 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}