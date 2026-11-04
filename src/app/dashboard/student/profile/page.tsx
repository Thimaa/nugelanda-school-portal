'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Edit, Shield, Users, BookOpen, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation'; // <-- Import useRouter

export default function StudentProfile() {
  const router = useRouter(); // <-- Initialize router
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Personal Details');

  useEffect(() => {
    async function fetchProfile() {
      const email = localStorage.getItem('userEmail'); 
      if (!email) {
        window.location.href = '/login';
        return;
      }

      try {
        const res = await fetch(`/api/profile?email=${email}&t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Function to log in as the sibling
  const loginAsSibling = (sib: any) => {
    const sibEmail = `${sib.admissionnumber || sib.admissionNumber}@school.com`;
    
    // Save their details to localStorage just like a normal login
    localStorage.setItem('accessToken', 'fake-token');
    localStorage.setItem('role', 'student');
    localStorage.setItem('userName', sib.name);
    localStorage.setItem('userEmail', sibEmail);
    localStorage.setItem('userClass', profile.class); // Use the same class
    localStorage.setItem('userAdmission', sib.admissionnumber || sib.admissionNumber);

    // Force a page reload to the student dashboard
    window.location.href = '/dashboard/student';
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading profile...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found. Please try logging in again.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 overflow-hidden">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
          <p className="text-sm text-slate-500 mb-2">{profile.class}</p>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            Admission No: {profile.admissionNumber || profile.admissionnumber}
          </span>

          {/* Quote Box */}
          <div className="w-full mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-slate-400">
              <Shield size={20} />
            </div>
            <p className="text-sm font-medium text-slate-600 italic mt-2">
              "Small steps every day lead to big results."
            </p>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
            {['Personal Details', 'Parent/Guardian', 'Academic Info'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Info List */}
          <div className="p-6">
            
            {/* PERSONAL DETAILS TAB */}
            {activeTab === 'Personal Details' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Full Name
                  </p>
                  <p className="text-sm font-medium text-slate-800">{profile.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Date of Birth
                  </p>
                  <p className="text-sm font-medium text-slate-800">{profile.birthday || 'Not provided'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Gender
                  </p>
                  <p className="text-sm font-medium text-slate-800">{profile.gender || 'Not provided'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} /> Email
                  </p>
                  <p className="text-sm font-medium text-slate-800">{profile.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={14} /> School
                  </p>
                  <p className="text-sm font-medium text-slate-800">{profile.school}</p>
                </div>
              </div>
            )}

            {/* PARENT / GUARDIAN TAB (INCLUDES SIBLINGS) */}
            {activeTab === 'Parent/Guardian' && (
              <div className="space-y-6">
                {/* Parents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Father's Details</p>
                    <p className="text-sm font-medium text-slate-800">Name: {profile.fatherName || profile.fathername}</p>
                    <p className="text-sm font-medium text-slate-800 flex items-center gap-2 mt-1">
                      <Phone size={14} className="text-slate-400"/> {profile.fatherMobile || profile.fathermobile || 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mother's Details</p>
                    <p className="text-sm font-medium text-slate-800">Name: {profile.motherName || profile.mothername}</p>
                    <p className="text-sm font-medium text-slate-800 flex items-center gap-2 mt-1">
                      <Phone size={14} className="text-slate-400"/> {profile.motherMobile || profile.mothermobile || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* SIBLINGS SECTION WITH LOGIN BUTTON */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users size={14} /> Siblings
                  </p>
                  {profile.siblings && profile.siblings.length > 0 ? (
                    <div className="space-y-3">
                      {profile.siblings.map((sib: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-slate-200 gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                              {sib.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700 block">{sib.name}</span>
                              <span className="text-xs text-slate-500">
                                Adm No: {sib.admissionnumber || sib.admissionNumber}
                              </span>
                            </div>
                          </div>
                          
                          {/* LOGIN BUTTON */}
                          <button 
                            onClick={() => loginAsSibling(sib)}
                            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                          >
                            <LogIn size={14} /> Login to Portal
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No siblings found.</p>
                  )}
                </div>
              </div>
            )}

            {/* ACADEMIC INFO TAB */}
            {activeTab === 'Academic Info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class</p>
                  <p className="text-sm font-medium text-slate-800">{profile.class}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admission Number</p>
                  <p className="text-sm font-medium text-slate-800">{profile.admissionNumber || profile.admissionnumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</p>
                  <p className="text-sm font-medium text-slate-800 capitalize">{profile.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}