'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, Camera, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', classGrade: '1',
    classSection: 'A', motherName: '', fatherName: '', school: '',
    admissionNumber: '', role: 'student', hasSibling: false, birthday: '',
    gender: '', fatherMobile: '', motherMobile: '', photoUrl: '',
    subject: '', mobile: '',
  });

  const [siblings, setSiblings] = useState([{ 
    name: '', admissionNumber: '', birthday: '', class: '', gender: '', age: ''
  }]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    let calculatedAge = '';
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      calculatedAge = age.toString();
    }
    setFormData({ ...formData, birthday: dob, age: calculatedAge });
  };

  const handleSiblingBirthdayChange = (index: number, dob: string) => {
    let calculatedAge = '';
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      calculatedAge = age.toString();
    }
    const newSiblings = [...siblings];
    newSiblings[index].birthday = dob;
    newSiblings[index].age = calculatedAge;
    setSiblings(newSiblings);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const data = await res.json();
      if (res.ok) setFormData({ ...formData, photoUrl: data.url });
    } catch (err) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSiblingChange = (index: number, field: string, value: string) => {
    const newSiblings = [...siblings];
    newSiblings[index][field as keyof typeof newSiblings[0]] = value;
    setSiblings(newSiblings);
  };

  const addSibling = () => {
    setSiblings([...siblings, { name: '', admissionNumber: '', birthday: '', class: '', gender: '', age: '' }]);
  };

  const removeSibling = (index: number) => {
    setSiblings(siblings.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const isStudent = formData.role === 'student';
      const finalClass = isStudent ? `${formData.classGrade}-${formData.classSection}` : 'N/A';
      const finalAdmission = isStudent ? formData.admissionNumber : `EMP-${Date.now()}`;
      const finalAge = isStudent ? parseInt(formData.age) : 30;
      
      const dataToSubmit = {
        ...formData,
        age: finalAge,
        class: finalClass,
        admissionNumber: finalAdmission,
        fatherMobile: formData.role === 'teacher' ? formData.mobile : formData.fatherMobile,
        school: formData.role === 'teacher' ? formData.subject : formData.school, 
        siblings: (isStudent && formData.hasSibling) ? siblings : [],
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Registration failed');
      }
      
      toast.success("Registration successful!");
      setIsRegistered(true); 
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  // SUCCESS SCREEN
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Registration Complete!</h1>
          <p className="text-slate-500 mb-8">Your account has been successfully created. Please log in to access your dashboard.</p>
          <button 
            onClick={() => router.push('/')} // Redirects to Home Page
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 text-center shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">Create an Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join AM/ Nugelanda M V Portal</p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <label className="block text-sm font-bold text-blue-900 mb-2">I am registering as a:</label>
              <div className="flex flex-wrap gap-4">
                {['student', 'teacher', 'parent', 'admin'].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer capitalize text-sm font-medium text-slate-700">
                    <input type="radio" name="role" value={r} checked={formData.role === r} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center mb-6">
              <label className="relative cursor-pointer group">
                <div className={`w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center overflow-hidden bg-slate-50 ${uploading ? 'opacity-50' : ''}`}>
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={28} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full text-white border-2 border-white">
                  <Plus size={14} />
                </div>
              </label>
              <p className="text-xs text-slate-500 mt-2">{uploading ? 'Uploading...' : 'Upload Photo'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {formData.role === 'teacher' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                  <input type="text" name="subject" placeholder="e.g. Mathematics" value={formData.subject} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
                  <input type="tel" name="mobile" placeholder="077 123 4567" value={formData.mobile} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            )}

            {formData.role === 'student' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleBirthdayChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
                    <input type="number" name="age" placeholder="Auto-calculated" value={formData.age} onChange={handleChange} required readOnly className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                    <select name="classGrade" value={formData.classGrade} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {[...Array(13)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Section *</label>
                    <select name="classSection" value={formData.classSection} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="A">A</option><option value="B">B</option><option value="C">C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Admission No. *</label>
                    <input type="text" name="admissionNumber" placeholder="ADM-1234" value={formData.admissionNumber} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">School Name *</label>
                  <input type="text" name="school" placeholder="AM/ Nugelanda M V" value={formData.school} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Father's Name *</label>
                    <input type="text" name="fatherName" placeholder="Robert Doe" value={formData.fatherName} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Father's Mobile</label>
                    <input type="tel" name="fatherMobile" placeholder="077 123 4567" value={formData.fatherMobile} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mother's Name *</label>
                    <input type="text" name="motherName" placeholder="Jane Doe" value={formData.motherName} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mother's Mobile</label>
                    <input type="tel" name="motherMobile" placeholder="071 987 6543" value={formData.motherMobile} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mt-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="hasSibling" id="hasSibling" checked={formData.hasSibling} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                    <label htmlFor="hasSibling" className="text-sm font-medium text-slate-700 cursor-pointer">Do you have brother(s) or sister(s) studying here?</label>
                  </div>

                  {formData.hasSibling && (
                    <div className="mt-4 space-y-4">
                      {siblings.map((sibling, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm space-y-3 relative">
                          {siblings.length > 1 && (
                            <button type="button" onClick={() => removeSibling(index)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Sibling Name</label>
                              <input type="text" placeholder="Sarah Doe" value={sibling.name} onChange={(e) => handleSiblingChange(index, 'name', e.target.value)} required={formData.hasSibling} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Admission No.</label>
                              <input type="text" placeholder="ADM-5678" value={sibling.admissionNumber} onChange={(e) => handleSiblingChange(index, 'admissionNumber', e.target.value)} required={formData.hasSibling} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Birthday</label>
                              <input type="date" value={sibling.birthday} onChange={(e) => handleSiblingBirthdayChange(index, e.target.value)} className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Class</label>
                              <input type="text" placeholder="10-A" value={sibling.class} onChange={(e) => handleSiblingChange(index, 'class', e.target.value)} className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                              <select value={sibling.gender} onChange={(e) => handleSiblingChange(index, 'gender', e.target.value)} className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Age</label>
                              <input type="number" placeholder="Auto" value={sibling.age} readOnly className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-not-allowed" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addSibling} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 mt-2">
                        <Plus size={16} /> Add Another Sibling
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mt-4">{error}</div>}

            <div className="pt-4">
              <button type="submit" disabled={loading || uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-lg transition-all disabled:opacity-70">
                {loading ? 'Registering...' : `Register as ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
              </button>
            </div>
          </form>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-sm text-slate-500 shrink-0">
          Already have an account? <Link href="/" className="text-blue-600 font-semibold hover:underline">Back to Login</Link>
        </div>

      </div>
    </div>
  );
}