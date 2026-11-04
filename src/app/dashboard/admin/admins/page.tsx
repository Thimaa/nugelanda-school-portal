'use client';

import { useEffect, useState } from 'react';
import { Shield, Trash2, Calendar, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisteredAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/all?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Get the current logged-in admin's email
    const email = localStorage.getItem('userEmail');
    console.log("Current Logged In Email:", email); // Check your F12 console
    setCurrentUserEmail(email);
    fetchAdmins();
  }, []);

  async function handleRemoveAccess(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove access for ${name}?`)) return;

    try {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: id, requestEmail: currentUserEmail })
      });
      
      if (res.ok) {
        toast.success('Admin access removed successfully');
        fetchAdmins(); 
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to remove access');
      }
    } catch (err) {
      toast.error('Error removing access');
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  // The Super Admin is the FIRST admin in the list (oldest account)
  const superAdminEmail = admins.length > 0 ? admins[0].email : null;
  const isUserSuperAdmin = currentUserEmail === superAdminEmail;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Shield className="text-blue-600" /> Registered Admins
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage all active administrators in the system</p>
        {/* Debug Text */}
        <p className="text-xs text-blue-600 mt-2 font-bold">
          You are logged in as {currentUserEmail || 'Unknown'}. {isUserSuperAdmin ? '(Super Admin)' : '(Normal Admin)'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No active admins found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Registered On</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin, index) => {
                  // The first item in the sorted list is the Super Admin
                  const isTargetSuperAdmin = index === 0;
                  const isMe = admin.email === currentUserEmail;
                  
                  return (
                    <tr 
                      key={admin.id} 
                      className={`transition-colors ${isTargetSuperAdmin ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase ${isTargetSuperAdmin ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{admin.name}</p>
                            {isTargetSuperAdmin && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mt-0.5">
                                <Crown size={10} /> Super Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {admin.email} {isMe && <span className="text-xs text-blue-500 font-bold">(You)</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(admin.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Only show Remove button if I am Super Admin AND the target is NOT the Super Admin */}
                        {isUserSuperAdmin && !isTargetSuperAdmin ? (
                          <button 
                            onClick={() => handleRemoveAccess(admin.id, admin.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Remove Access
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic px-4 py-2">
                            {isTargetSuperAdmin ? 'Protected' : 'View Only'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}