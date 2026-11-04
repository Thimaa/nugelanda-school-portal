'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, DollarSign, Award, FileText, Bell } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({
    name: 'Student',
    class: 'N/A',
    admissionNo: 'N/A',
  });
  
  // NEW: State for the real fee balance
  const [feeBalance, setFeeBalance] = useState<string>('...');
  const [feeStatus, setFeeStatus] = useState<string>('Pending');

  useEffect(() => {
    // 1. Load basic info from localStorage
    const savedName = localStorage.getItem('userName');
    const savedClass = localStorage.getItem('userClass');
    const savedAdmission = localStorage.getItem('userAdmission');
    const email = localStorage.getItem('userEmail');

    setStudentInfo({
      name: savedName || 'Student',
      class: savedClass || '10-A',
      admissionNo: savedAdmission || 'N/A',
    });

    // 2. Fetch real-time fee balance from the API
    async function fetchFees() {
      if (!email) return;
      try {
        const res = await fetch(`/api/student/fees?email=${email}&t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setFeeBalance(`Rs. ${data.balance.toLocaleString()}`);
          setFeeStatus(data.status);
        }
      } catch (err) {
        console.error("Failed to fetch fees", err);
      }
    }
    fetchFees();
  }, []);

  return (
    <div className="space-y-5">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">Good Morning,</h1>
          <h2 className="text-2xl font-bold mb-3">{studentInfo.name}! 👋</h2>
          <p className="text-blue-100 text-sm">Keep going! Your hard work makes a difference.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
          <BookOpen size={120} />
        </div>
      </div>

      {/* 4 Summary Cards (Grid) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
            <Award size={20} />
          </div>
          <p className="text-xs text-slate-500 font-medium">Attendance</p>
          <p className="text-xl font-bold text-slate-800">92%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
            <BookOpen size={20} />
          </div>
          <p className="text-xs text-slate-500 font-medium">Exam Average</p>
          <p className="text-xl font-bold text-slate-800">78%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <Calendar size={20} />
          </div>
          <p className="text-xs text-slate-500 font-medium">Subjects</p>
          <p className="text-xl font-bold text-slate-800">6</p>
        </div>

        {/* DYNAMIC FEE BALANCE CARD */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            <DollarSign size={20} />
          </div>
          <p className="text-xs text-slate-500 font-medium">Fee Balance</p>
          <p className={`text-xl font-bold ${feeStatus === 'Paid' ? 'text-emerald-600' : 'text-slate-800'}`}>
            {feeBalance}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          <Link href="/dashboard/student/results" className="flex flex-col items-center gap-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={16} /></div>
            <span className="text-[10px] font-medium text-slate-700">Results</span>
          </Link>
          <Link href="/dashboard/student/fees" className="flex flex-col items-center gap-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><DollarSign size={16} /></div>
            <span className="text-[10px] font-medium text-slate-700">Fees</span>
          </Link>
          <Link href="/dashboard/student/timetable" className="flex flex-col items-center gap-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={16} /></div>
            <span className="text-[10px] font-medium text-slate-700">Time Table</span>
          </Link>
          <Link href="/dashboard/student/notices" className="flex flex-col items-center gap-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Bell size={16} /></div>
            <span className="text-[10px] font-medium text-slate-700">Notices</span>
          </Link>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-800">Notices</h3>
          <Link href="/dashboard/student/notices" className="text-xs text-blue-600 font-medium">View All</Link>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Mid Term Exam Schedule</p>
              <p className="text-[10px] text-slate-400 mt-0.5">26 Jun 2025</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-slate-800">School Uniform Notice</p>
              <p className="text-[10px] text-slate-400 mt-0.5">22 Jun 2025</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}