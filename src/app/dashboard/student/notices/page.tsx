'use client';

import { Bell, ChevronRight } from 'lucide-react';

export default function StudentNotices() {
  const notices = [
    { title: 'Mid Term Exam Schedule', date: '26 Jun 2025', desc: 'The mid-term examination schedule for all grades is now available. Please check with your class teacher.', color: 'bg-blue-500' },
    { title: 'School Uniform Notice', date: '22 Jun 2025', desc: 'All students are required to wear the new school uniform starting from next Monday.', color: 'bg-emerald-500' },
    { title: 'Field Trip to Polonnaruwa', date: '18 Jun 2025', desc: 'Grade 10 students will be going on an educational field trip. Consent forms are due by Friday.', color: 'bg-purple-500' },
    { title: 'Fee Payment Reminder', date: '15 Jun 2025', desc: 'Please settle all pending school fees before the end of this month to avoid any penalties.', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Bell className="text-blue-600" /> Notices
      </h1>

      <div className="space-y-3">
        {notices.map((notice, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-2 rounded-full ${notice.color} shrink-0`}></div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-800">{notice.title}</h3>
                <span className="text-xs text-slate-400">{notice.date}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{notice.desc}</p>
            </div>
            <div className="flex items-center text-slate-300">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
