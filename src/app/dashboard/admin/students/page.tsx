'use client';

import { useEffect, useState } from 'react';
import { 
  Search, Plus, Eye, Edit, Trash2, User, Users, 
  X, Save, CheckCircle2, AlertTriangle, Download, Send, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null); 
  const [deletingStudent, setDeletingStudent] = useState<any>(null); 
  
  const [deleteReason, setDeleteReason] = useState('Left School');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Tab State for the Details Panel
  const [activeTab, setActiveTab] = useState('Overview');

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleDelete() {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deleteReason })
      });
      if (res.ok) {
        setDeletingStudent(null); 
        setSelectedStudent(null);
        fetchStudents(); 
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.push('/dashboard/admin/deleted-students');
        }, 1500);
      } else {
        toast.error('Failed to delete student');
      }
    } catch (err) {
      toast.error('Error deleting student');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent),
      });
      if (res.ok) {
        setEditingStudent(null); 
        fetchStudents(); 
        if (selectedStudent?.id === editingStudent.id) {
          setSelectedStudent({...editingStudent});
        }
        toast.success('Student updated successfully');
      } else {
        toast.error('Failed to update student');
      }
    } catch (err) {
      toast.error('Error updating student');
    } finally {
      setIsUpdating(false);
    }
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.admissionnumber || s.admissionNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] relative overflow-hidden">
      
      {/* LEFT SIDE: Main Table Area */}
      <div className={`flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ${selectedStudent ? 'w-full lg:w-2/3' : 'w-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Students</h1>
              <p className="text-xs text-slate-500">Manage and view all student information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/deleted-students" className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Trash2 size={16} /> Deleted Students
            </Link>
            <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add New
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex gap-4 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, admission number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Students</p>
              <p className="text-sm font-bold text-slate-800 leading-tight">{students.length}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Admission No</th>
                <th className="px-4 py-3 font-medium">Class</th>
                {!selectedStudent && <th className="px-4 py-3 font-medium">Email</th>}
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className={`cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm uppercase overflow-hidden">
                          {(student.photourl || student.photoUrl) ? (
                            <img src={student.photourl || student.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            student.name.charAt(0)
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-800">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{student.admissionnumber || student.admissionNumber}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-semibold">{student.class}</span>
                    </td>
                    {!selectedStudent && <td className="px-4 py-3 text-sm text-slate-500">{student.email}</td>}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2 text-slate-400">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }} className="p-1 hover:text-blue-600"><Eye size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingStudent(student); }} className="p-1 hover:text-amber-600"><Edit size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setDeletingStudent(student); }} className="p-1 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE: Slide-in Details Panel (Matching the design) */}
      {selectedStudent && (
        <div className="absolute right-0 top-0 h-full w-full lg:w-[450px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-40">
          
          {/* Panel Header */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <User size={18} className="text-blue-600" /> Student Details
            </h2>
            <div className="flex items-center gap-3">
              <button onClick={() => setEditingStudent(selectedStudent)} className="text-xs font-semibold text-blue-600 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-2 transition-colors">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            
            {/* Profile Card Area */}
            <div className="p-5 flex gap-5 border-b border-slate-100">
              <div className="w-24 h-28 bg-slate-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-4xl font-bold text-slate-400 uppercase">
                {(selectedStudent.photourl || selectedStudent.photoUrl) ? (
                  <img src={selectedStudent.photourl || selectedStudent.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  selectedStudent.name.charAt(0)
                )}
              </div>
              <div className="space-y-1.5 pt-1">
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{selectedStudent.name}</h3>
                <span className="inline-block bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">
                  Active
                </span>
                <div className="text-xs text-slate-600 grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 mt-2">
                  <span className="text-slate-400">Admission No</span> <span>: {selectedStudent.admissionnumber || selectedStudent.admissionNumber}</span>
                  <span className="text-slate-400">Class</span> <span>: {selectedStudent.class}</span>
                  <span className="text-slate-400">Gender</span> <span>: {selectedStudent.gender || 'N/A'}</span>
                  <span className="text-slate-400">Date of Birth</span> <span>: {selectedStudent.birthday || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar shrink-0">
              {['Overview', 'Academic', 'Attendance', 'Fees'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab ? 'text-blue-600 border-blue-600 bg-blue-50/30' : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 space-y-6">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'Overview' && (
                <>
                  {/* Personal Info */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <User size={16} className="text-slate-500" /> Personal Information
                    </h4>
                    <div className="text-xs text-slate-600 grid grid-cols-[90px_1fr] gap-x-2 gap-y-2">
                      <span className="text-slate-400">Full Name</span> <span className="font-medium text-slate-800">{selectedStudent.name}</span>
                      <span className="text-slate-400">NIC</span> <span>201005123456</span> {/* Mocked as per design */}
                      <span className="text-slate-400">Address</span> <span>No. 123, Main Road, Polonnaruwa</span>
                      <span className="text-slate-400">Phone</span> <span>{selectedStudent.fathermobile || selectedStudent.fatherMobile || 'N/A'}</span>
                      <span className="text-slate-400">Email</span> <span className="text-blue-600">{selectedStudent.email}</span>
                    </div>
                  </div>

                  {/* Parent Info */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Users size={16} className="text-slate-500" /> Parent / Guardian
                    </h4>
                    <div className="text-xs text-slate-600 grid grid-cols-[90px_1fr] gap-x-2 gap-y-2">
                      <span className="text-slate-400">Father</span> <span className="font-medium">{selectedStudent.fathername || selectedStudent.fatherName || 'N/A'} ({selectedStudent.fathermobile || 'N/A'})</span>
                      <span className="text-slate-400">Mother</span> <span className="font-medium">{selectedStudent.mothername || selectedStudent.motherName || 'N/A'} ({selectedStudent.mothermobile || 'N/A'})</span>
                    </div>
                  </div>

                  {/* Class Info */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-slate-500" /> Class Information
                    </h4>
                    <div className="text-xs text-slate-600 grid grid-cols-[90px_1fr] gap-x-2 gap-y-2">
                      <span className="text-slate-400">Class</span> <span className="font-medium">{selectedStudent.class}</span>
                      <span className="text-slate-400">Class Teacher</span> <span>Mr. Kasun Perera</span> {/* Mocked */}
                      <span className="text-slate-400">Academic Year</span> <span>2025</span>
                    </div>
                  </div>

                  {/* Sibling Info */}
                  {selectedStudent.siblings && selectedStudent.siblings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Users size={16} className="text-slate-500" /> Siblings
                      </h4>
                      <div className="space-y-2">
                        {selectedStudent.siblings.map((sib: any, i: number) => (
                          <div key={i} className="flex bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                            <span className="font-medium text-slate-800 mr-2">{sib.name}</span> 
                            <span className="text-slate-500">({sib.admissionnumber || sib.admissionNumber})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <User size={16} className="text-slate-500" /> Quick Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-white border border-slate-200 text-blue-600 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-100 transition">
                        <Eye size={14} /> View Full Profile
                      </button>
                      <button className="bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-100 transition">
                        <Download size={14} /> Download Report
                      </button>
                      <button className="bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 col-span-2 hover:bg-slate-100 transition">
                        <Send size={14} /> Send Message
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* OTHER TABS (Placeholders for now) */}
              {activeTab === 'Academic' && <div className="text-center text-slate-500 text-sm py-10">Academic records go here.</div>}
              {activeTab === 'Attendance' && <div className="text-center text-slate-500 text-sm py-10">Attendance records go here.</div>}
              {activeTab === 'Fees' && <div className="text-center text-slate-500 text-sm py-10">Fee history goes here.</div>}

            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-red-50">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Delete Student</h2>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete <span className="font-bold text-slate-800">{deletingStudent.name}</span>?
              </p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for deletion *</label>
                <select 
                  value={deleteReason} 
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                >
                  <option value="Left School">Left School / Transferred</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Expelled">Expelled</option>
                  <option value="Duplicate Account">Duplicate Account</option>
                  <option value="Data Entry Error">Data Entry Error</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button onClick={() => setDeletingStudent(null)} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition">Cancel</button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-800">Edit Student</h2>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" value={editingStudent.name || ''} onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={editingStudent.email || ''} onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Class</label>
                  <input type="text" value={editingStudent.class || ''} onChange={(e) => setEditingStudent({...editingStudent, class: e.target.value})} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Admission No</label>
                  <input type="text" value={editingStudent.admissionnumber || editingStudent.admissionNumber || ''} onChange={(e) => setEditingStudent({...editingStudent, admissionNumber: e.target.value})} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                  <select value={editingStudent.gender || ''} onChange={(e) => setEditingStudent({...editingStudent, gender: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input type="date" value={editingStudent.birthday || ''} onChange={(e) => setEditingStudent({...editingStudent, birthday: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Father's Name</label>
                  <input type="text" value={editingStudent.fathername || editingStudent.fatherName || ''} onChange={(e) => setEditingStudent({...editingStudent, fatherName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mother's Name</label>
                  <input type="text" value={editingStudent.mothername || editingStudent.motherName || ''} onChange={(e) => setEditingStudent({...editingStudent, motherName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70">
                  {isUpdating ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Success!</p>
              <p className="text-xs text-slate-300">Action completed</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}