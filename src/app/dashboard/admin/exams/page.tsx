'use client';
import { FileText } from 'lucide-react';

export default function AdminExams() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <FileText className="text-blue-600" /> Exams & Results Management
      </h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500 py-20">
        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-lg font-medium text-slate-600">Exam Schedule & Grading</p>
        <p className="text-sm mt-1">Coming soon!</p>
      </div>
    </div>
  );
}