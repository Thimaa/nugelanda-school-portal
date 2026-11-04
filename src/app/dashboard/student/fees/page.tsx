'use client';

import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, Clock, DollarSign, Users, AlertTriangle, X } from 'lucide-react';

export default function StudentFees() {
  const [feeData, setFeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State to control the family modal
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  useEffect(() => {
    async function fetchFees() {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        setErrorMsg("No email found. Please log out and log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/student/fees?email=${email}&t=${Date.now()}`);
        
        if (res.ok) {
          const data = await res.json();
          setFeeData(data);
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMsg(errData.message || `API Error: ${res.status}`);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    }
    fetchFees();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading fees...</div>;
  
  if (errorMsg) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Could not load fee data</h2>
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{errorMsg}</p>
      </div>
    );
  }

  if (!feeData) return <div className="p-10 text-center">No data available.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="text-blue-600" /> Fees & Payments
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your family's billing details</p>
      </div>

      {/* CLICKABLE FAMILY BANNER */}
      {feeData.familyMembersCount > 1 && (
        <button 
          onClick={() => setShowFamilyModal(true)}
          className="w-full bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 rounded-xl p-4 flex items-center gap-3 text-left"
        >
          <Users className="text-blue-600 shrink-0" size={24} />
          <p className="text-sm text-blue-900 font-medium">
            This account is linked to a family with <strong>{feeData.familyMembersCount} students</strong>. 
            Click here to view family members.
          </p>
        </button>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Family Fee</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {feeData.totalFee.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Amount Paid</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {feeData.paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feeData.balance > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Balance Due</p>
              <p className={`text-2xl font-bold ${feeData.balance > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                Rs. {feeData.balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-6 rounded-2xl border ${feeData.status === 'Paid' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} flex flex-col items-center justify-center text-center`}>
        {feeData.status === 'Paid' ? (
          <>
            <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
            <h2 className="text-xl font-bold text-emerald-900">All Fees Paid</h2>
            <p className="text-emerald-700 text-sm mt-1">Your family account is fully settled. Thank you!</p>
          </>
        ) : (
          <>
            <Clock size={48} className="text-amber-500 mb-3" />
            <h2 className="text-xl font-bold text-amber-900">Payment Pending</h2>
            <p className="text-amber-700 text-sm mt-1">Please contact the admin to settle the remaining balance.</p>
          </>
        )}
      </div>

      {/* FAMILY MEMBERS MODAL */}
      {showFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-blue-600" /> Family Members
              </h2>
              <button 
                onClick={() => setShowFamilyModal(false)} 
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {feeData.familyMembers && feeData.familyMembers.length > 0 ? (
                feeData.familyMembers.map((member: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">Adm No: {member.admissionNumber}</p>
                      </div>
                    </div>
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                      {member.class}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">No family members found.</p>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button 
                onClick={() => setShowFamilyModal(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}