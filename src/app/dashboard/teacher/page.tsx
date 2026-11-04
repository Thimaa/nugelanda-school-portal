'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, CalendarCheck, 
  Clock, CheckCircle2, TrendingUp, Bell
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('Teacher');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setTeacherName(name);
  }, []);

  // Mock data for the teacher dashboard
  const myClasses = [
    { name: 'Grade 10 - A', subject: 'Mathematics', students: 32 },
    { name: 'Grade 11 - B', subject: 'Mathematics', students: 28 },
    { name: 'Grade 12 - A', subject: 'Mathematics', students: 25 },
  ];

  const todaySchedule = [
    { time: '08:00 AM - 09:00 AM', class: 'Grade 10 - A', topic: 'Algebra - Quadratic Equations' },
    { time: '10:15 AM - 11:15 AM', class: 'Grade 11 - B', topic: 'Geometry - Circles' },
    { time: '01:00 PM - 02:00 PM', class: 'Grade 12 - A', topic: 'Calculus - Integration' },
  ];

  return (
    <div className="space-y-6">
      
      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-r from-purple-700 to-indigo-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {teacherName}! 👋</h1>
            <p className="text-purple-100 max-w-md">You have 3 classes scheduled for today. Ready to inspire your students?</p>
          </div>
          <Link href="/dashboard/teacher/attendance" className="bg-white text-purple-800 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-purple-50 transition-colors flex items-center gap-2">
            <CalendarCheck size={20} /> Mark Attendance
          </Link>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">My Classes</p>
            <h3 className="text-3xl font-bold text-slate-800">3</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Total Students</p>
            <h3 className="text-3xl font-bold text-slate-800">85</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Pending Grading</p>
            <h3 className="text-3xl font-bold text-slate-800">12</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium">Class Average</p>
            <h3 className="text-3xl font-bold text-slate-800">78%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-purple-600" /> Today's Schedule
            </h2>
          </div>
          
          <div className="space-y-4">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-32 shrink-0 text-sm font-semibold text-purple-700">
                  {item.time}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{item.class}</p>
                  <p className="text-sm text-slate-500 mt-1">{item.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Classes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">My Classes</h2>
          <div className="space-y-4">
            {myClasses.map((cls, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{cls.name}</p>
                  <p className="text-xs text-slate-500">{cls.subject}</p>
                </div>
                <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold">
                  {cls.students} Students
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}