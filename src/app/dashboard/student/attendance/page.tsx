'use client';

import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react';

export default function StudentAttendance() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="text-blue-600" size={20} /> Attendance
        </h1>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700">
          June 2025 <ChevronDown size={14} className="ml-1" />
        </div>
      </div>

      {/* Circular Progress Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center" 
             style={{ background: 'conic-gradient(#10b981 92%, #ef4444 92% 95%, #f59e0b 95% 100%)' }}>
          <div className="absolute inset-1.5 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-2xl font-bold text-slate-800">92%</span>
            <span className="text-[10px] font-medium text-slate-500">Present</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between w-32">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present</span>
            <span className="font-bold text-slate-800">18</span>
          </div>
          <div className="flex items-center justify-between w-32">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</span>
            <span className="font-bold text-slate-800">1</span>
          </div>
          <div className="flex items-center justify-between w-32">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Late</span>
            <span className="font-bold text-slate-800">0</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-bold text-slate-400 uppercase">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(30)].map((_, i) => {
            const day = i + 1;
            const isAbsent = day === 12;
            const isToday = day === 15;
            
            return (
              <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative text-xs font-medium 
                ${isAbsent ? 'bg-red-50 text-red-600' : 
                  isToday ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                  'text-slate-700 hover:bg-slate-50'}`}>
                {day}
                {!isAbsent && !isToday && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400"></div>}
                {isAbsent && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500"></div>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}