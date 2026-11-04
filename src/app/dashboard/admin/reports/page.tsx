'use client';
import { BarChart } from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <BarChart className="text-blue-600" /> System Reports
      </h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500 py-20">
        <BarChart size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-lg font-medium text-slate-600">Analytics & Performance</p>
        <p className="text-sm mt-1">Coming soon!</p>
      </div>
    </div>
  );
}