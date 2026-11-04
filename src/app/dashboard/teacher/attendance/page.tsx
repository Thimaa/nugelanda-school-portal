'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle2, XCircle, Save, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  
  // FIX: Set an empty string initially to avoid Server/Browser mismatch
  const [date, setDate] = useState(''); 
  
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // FIX: Set the date AFTER the page loads in the browser
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Fetch students when class or date changes
  useEffect(() => {
    async function fetchStudents() {
      if (!selectedClass || !date) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/teacher/attendance?class=${selectedClass}&date=${date}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [selectedClass, date]);

  // Toggle status
  const toggleStatus = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } 
        : s
    ));
  };

  // Save Attendance
  async function saveAttendance() {
    setSaving(true);
    try {
      const attendanceData = students.map(s => ({
        studentId: s.id,
        status: s.status
      }));

      const res = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceData, date })
      });

      if (res.ok) {
        toast.success('Attendance saved successfully!');
      } else {
        toast.error('Failed to save attendance');
      }
    } catch (err) {
      toast.error('Error saving attendance');
    } finally {
      setSaving(false);
    }
  }

  // Get unique classes
  const classes = ['10-A', '10-B', '11-A', '11-B', '12-A'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarCheck className="text-purple-600" /> Mark Attendance
        </h1>
        <p className="text-slate-500 text-sm mt-1">Select a class and date to mark student attendance</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Class</label>
          <div className="relative">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-end">
          <button 
            onClick={saveAttendance}
            disabled={saving || students.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No students found in this class.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((student, idx) => (
              <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-6 text-center text-slate-400 font-bold">{idx + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase overflow-hidden">
                    {(student.photourl || student.photoUrl) ? (
                      <img src={student.photourl || student.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      student.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.admissionnumber || student.admissionNumber}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(student.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors border ${
                      student.status === 'Present' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <CheckCircle2 size={16} /> Present
                  </button>
                  <button 
                    onClick={() => toggleStatus(student.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors border ${
                      student.status === 'Absent' 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <XCircle size={16} /> Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}