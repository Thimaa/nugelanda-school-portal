'use client';

import { useEffect, useState } from 'react';
import { 
  Users, GraduationCap, DollarSign, CalendarCheck, 
  ArrowUpRight, TrendingUp, CheckCircle2, UserCheck, Clock
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Administrator');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalFeesCollected: 0,
    recentStudents: [] as any[],
    attendanceData: [0, 0, 0, 0, 0, 0, 0],
    classDistribution: { 'Grade 10': 0, 'Grade 11': 0, 'Grade 12': 0 }
  });
  const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const res = await fetch(`/api/admin/stats?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPendingAdmins() {
    try {
      const res = await fetch(`/api/admin/pending?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setPendingAdmins(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setAdminName(name);

    fetchStats();
    fetchPendingAdmins();
  }, []);

  async function handleApprove(id: string) {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: id })
      });
      
      if (res.ok) {
        toast.success('Admin approved successfully!');
        fetchPendingAdmins(); // Refresh the list
      } else {
        toast.error('Failed to approve admin');
      }
    } catch (err) {
      toast.error('Error approving admin');
    }
  }

  return (
    <div className="space-y-6">
      
      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-32 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Good Morning, {adminName}! 👋</h1>
            <p className="text-blue-100 max-w-md">Here is what's happening at Bright Future College today. You have {stats.totalStudents} active students.</p>
          </div>
          <Link href="/signup" className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Users size={20} /> Register New Student
          </Link>
        </div>
      </div>

      {/* PENDING ADMIN APPROVALS SECTION */}
      {pendingAdmins.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="text-amber-600" size={24} />
            <h2 className="text-lg font-bold text-amber-900">Pending Admin Approvals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAdmins.map((admin) => (
              <div key={admin.id} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-bold text-slate-800">{admin.name}</p>
                  <p className="text-sm text-slate-500 mb-3">{admin.email}</p>
                </div>
                <button 
                  onClick={() => handleApprove(admin.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 size={16} /> Approve Admin
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} className="mr-1" /> Live
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Total Students</p>
            <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Total Teachers</p>
            <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.totalTeachers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Fees Collected</p>
            <h3 className="text-3xl font-bold text-slate-800">
              Rs. {loading ? '...' : (stats.totalFeesCollected || 0).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Avg Attendance</p>
            <h3 className="text-3xl font-bold text-slate-800">95.9%</h3>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" /> Attendance Trends
            </h2>
            <span className="text-sm font-medium text-slate-500">Last 7 Days</span>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2">
            {stats.attendanceData.map((val, i) => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end justify-center h-full">
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600"
                      style={{ height: `${val}%` }}
                    ></div>
                    <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}%
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Enrollment Breakdown</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Grade 10</span>
                <span className="text-slate-500">{stats.classDistribution['Grade 10']} Students</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((stats.classDistribution['Grade 10'] / (stats.totalStudents || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Grade 11</span>
                <span className="text-slate-500">{stats.classDistribution['Grade 11']} Students</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((stats.classDistribution['Grade 11'] / (stats.totalStudents || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Grade 12</span>
                <span className="text-slate-500">{stats.classDistribution['Grade 12']} Students</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((stats.classDistribution['Grade 12'] / (stats.totalStudents || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
              <CheckCircle2 size={16} /> System Status
            </div>
            <p className="text-xs text-blue-600">All systems operational. Database synced.</p>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Recent Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Recently Registered Students</h2>
          <Link href="/dashboard/admin/students" className="text-sm text-blue-600 font-medium hover:underline">View All Students</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">Admission No</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-4 text-center text-slate-500">Loading...</td></tr>
              ) : stats.recentStudents.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center text-slate-500">No students registered yet.</td></tr>
              ) : (
                stats.recentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                         {(student.photourl || student.photoUrl) ? (
                           <img src={student.photourl || student.photoUrl} className="w-full h-full object-cover" />
                         ) : (
                           student.name.charAt(0)
                         )}
                      </div>
                      {student.name}
                    </td>
                    <td className="py-4 text-sm text-slate-500">{student.class}</td>
                    <td className="py-4 text-sm text-slate-500">{student.admissionnumber || student.admissionNumber}</td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}