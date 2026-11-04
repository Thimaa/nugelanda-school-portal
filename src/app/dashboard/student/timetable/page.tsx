'use client';

import { Clock } from 'lucide-react';

export default function StudentTimetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['1st Period', '2nd Period', '3rd Period', '4th Period', '5th Period'];
  
  const schedule: Record<string, string[]> = {
    'Monday': ['Math', 'English', 'Science', 'History', 'ICT'],
    'Tuesday': ['Science', 'Math', 'ICT', 'Sinhala', 'English'],
    'Wednesday': ['History', 'ICT', 'Math', 'English', 'Science'],
    'Thursday': ['English', 'Science', 'Sinhala', 'Math', 'History'],
    'Friday': ['ICT', 'History', 'English', 'Science', 'Math'],
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Clock className="text-blue-600" /> Time Table
      </h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-slate-100 bg-slate-50 text-sm font-bold text-slate-600">Day / Period</th>
              {periods.map(p => (
                <th key={p} className="p-4 border-b border-slate-100 bg-slate-50 text-sm font-bold text-slate-600">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="p-4 border-r border-b border-slate-100 font-bold text-slate-700 bg-slate-50">{day}</td>
                {schedule[day].map((subject, i) => (
                  <td key={i} className="p-4 border-b border-slate-100 text-sm text-slate-600 hover:bg-blue-50 transition-colors">
                    {subject}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}