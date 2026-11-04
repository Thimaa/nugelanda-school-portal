'use client';

import { useEffect, useState } from 'react';
import { UserCheck, XCircle, CheckCircle2, ShieldAlert, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminApprovalsPage() {
  const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State to hold the current user's email and the Super Admin's email
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [superAdminEmail, setSuperAdminEmail] = useState<string | null>(null);

  async function fetchPendingAdmins() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pending?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setPendingAdmins(data);
      }

      // Also fetch the list of all admins to find out who the first (Super) admin is
      const allRes = await fetch(`/api/admin/all?t=${Date.now()}`);
      if (allRes.ok) {
        const allAdmins = await allRes.json();
        if (allAdmins.length > 0) {
          setSuperAdminEmail(allAdmins[0].email); // The first one in the sorted list is the Super Admin
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setCurrentUserEmail(email);
    fetchPendingAdmins();
  }, []);

  async function handleApprove(id: string) {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: id, requestEmail: currentUserEmail })
      });
      
      if (res.ok) {
        toast.success('Admin approved successfully!');
        fetchPendingAdmins(); 
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to approve admin');
      }
    } catch (err) {
      toast.error('Error approving admin');
    }
  }

  async function handleReject(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove access and delete ${name}?`)) return;

    try {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: id, requestEmail: currentUserEmail })
      });
      
      if (res.ok) {
        toast.success('Access removed successfully');
        fetchPendingAdmins(); 
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to remove access');
      }
    } catch (err) {
      toast.error('Error removing access');
    }
  }

  // Check if the current user is the Super Admin
  const isUserSuperAdmin = currentUserEmail === superAdminEmail;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UserCheck className="text-blue-600" /> Pending Admin Approvals
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage new administrator requests</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading requests...</div>
        ) : pendingAdmins.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <ShieldAlert size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No pending approvals</h3>
            <p className="text-sm text-slate-500 mt-1">All admin accounts are currently active.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingAdmins.map((admin) => (
              <div key={admin.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg uppercase">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">{admin.name}</p>
                    <p className="text-sm text-slate-500">{admin.email}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  {/* ONLY show buttons if the logged-in user is the Super Admin */}
                  {isUserSuperAdmin ? (
                    <>
                      <button 
                        onClick={() => handleReject(admin.id, admin.name)}
                        className="flex-1 sm:flex-none bg-white border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle size={16} /> Remove Access
                      </button>
                      <button 
                        onClick={() => handleApprove(admin.id)}
                        className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Eye size={16} /> View Only
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}