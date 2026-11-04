'use client';
import { UserPlus } from 'lucide-react';

export default function AdminParents() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <UserPlus className="text-blue-600" /> Parent Portal
      </h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500 py-20">
        <UserPlus size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-lg font-medium text-slate-600">Manage Parent Accounts</p>
        <p className="text-sm mt-1">Coming soon!</p>
      </div>
    </div>
  );
}