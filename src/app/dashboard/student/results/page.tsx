'use client';

import { FileText, Download } from 'lucide-react';

export default function StudentResults() {
  const results = [
    { subject: 'Mathematics', marks: 85, total: 100, grade: 'A', status: 'Pass' },
    { subject: 'English', marks: 78, total: 100, grade: 'B+', status: 'Pass' },
    { subject: 'Science', marks: 73, total: 100, grade: 'B', status: 'Pass' },
    { subject: 'History', marks: 68, total: 100, grade: 'B-', status: 'Pass' },
    { subject: 'ICT', marks: 90, total: 100, grade: 'A+', status: 'Pass' },
    { subject: 'Sinhala', marks: 76, total: 100, grade: 'A-', status: 'Pass' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" /> Exam Results
        </h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Download size={16} /> Download Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Mid Term Examination - 2025</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Marks</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((res, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{res.subject}</td>
                <td className="px-6 py-4 text-slate-600">{res.marks} / {res.total}</td>
                <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-bold">{res.grade}</span></td>
                <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-xs font-bold">{res.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span className="font-semibold text-slate-600">Overall Percentage:</span>
          <span className="text-xl font-bold text-amber-500">78%</span>
        </div>
      </div>
    </div>
  );
}