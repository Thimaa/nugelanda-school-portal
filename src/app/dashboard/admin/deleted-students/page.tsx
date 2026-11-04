'use client';

import { useEffect, useState } from 'react';
import { User, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeletedStudentsPage() {
  const [deletedStudents, setDeletedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeleted() {
      try {
        const res = await fetch('/api/admin/deleted-students');
        if (res.ok) {
          const data = await res.json();
          setDeletedStudents(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeleted();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trash2 className="text-red-600" /> Deleted Students
          </h1>
          <p className="text-slate-500 text-sm mt-1">History of students removed from the system</p>
        </div>
        <Link href="/dashboard/admin/students" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Back to Students
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Admission No</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Reason for Deletion</th>
                <th className="px-6 py-4 font-medium">Date Deleted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading history...</td></tr>
              ) : deletedStudents.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No students have been deleted yet.</td></tr>
              ) : (
                deletedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.admissionNumber}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-semibold">{student.class}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded text-xs font-bold">
                        {student.deleteReason}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(student.deletedAt).toLocaleDateString()}
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