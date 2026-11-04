'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, DollarSign, Search, Download, 
  CheckCircle2, Clock, X, AlertCircle, Printer, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFees() {
  const [data, setData] = useState<any>({
    students: [],
    stats: { totalCollected: 0, totalPending: 0, totalStudents: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number | string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Receipt States
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  async function fetchFees() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/fees?t=${Date.now()}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFees();
  }, []);

  // Open Payment Modal
  const openPaymentModal = (student: any, balance: number) => {
    setSelectedStudent(student);
    setPayAmount(balance);
    setShowReceipt(false);
  };

  // Open Receipt Modal (from the table icon)
  const openReceiptModal = (student: any) => {
    setSelectedStudent(student);
    const total = student.totalFee || 15000;
    const paid = student.paidAmount || 0;
    
    setReceiptData({
      receiptNo: `REC-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toLocaleString(),
      studentName: student.name,
      admissionNo: student.admissionnumber || student.admissionNumber,
      class: student.class,
      amountPaid: paid,
      remainingBalance: total - paid
    });
    setShowReceipt(true);
  };

  async function processPayment() {
    if (!payAmount || Number(payAmount) <= 0) return toast.error("Enter a valid amount");
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent.id, amountPaid: Number(payAmount) })
      });

      if (res.ok) {
        const total = selectedStudent.totalFee || 15000;
        const currentPaid = selectedStudent.paidAmount || 0;
        
        setReceiptData({
          receiptNo: `REC-${Math.floor(Math.random() * 1000000)}`,
          date: new Date().toLocaleString(),
          studentName: selectedStudent.name,
          admissionNo: selectedStudent.admissionnumber || selectedStudent.admissionNumber,
          class: selectedStudent.class,
          amountPaid: Number(payAmount),
          remainingBalance: (total - currentPaid) - Number(payAmount)
        });
        
        setShowReceipt(true);
        toast.success("Payment recorded for family!");
        fetchFees(); // Refresh data
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to process payment");
      }
    } catch (err) {
      toast.error("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  }

  // Function to trigger browser Print (Save as PDF)
  const downloadPDF = () => {
    window.print();
  };

  const filteredStudents = data.students.filter((student: any) => {
    const search = searchTerm.toLowerCase();
    const nameMatch = student.name.toLowerCase().includes(search);
    const admissionNo = student.admissionnumber || student.admissionNumber || '';
    const admissionMatch = admissionNo.toLowerCase().includes(search);
    return nameMatch || admissionMatch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" /> Fees & Payments
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage family billing and invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {data.stats.totalCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Fees</p>
              <p className="text-2xl font-bold text-slate-800">Rs. {data.stats.totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Users size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Families</p>
              <p className="text-2xl font-bold text-slate-800">{data.stats.totalStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or admission number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Student (Main Family Member)</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Total Family Fee</th>
                <th className="px-6 py-4 font-medium">Paid</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-500">Loading invoices...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student: any) => {
                  const total = student.totalFee || 15000;
                  const paid = student.paidAmount || 0;
                  const balance = total - paid;
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase overflow-hidden">
                            {(student.photourl || student.photoUrl) ? (
                              <img src={student.photourl || student.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              student.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.admissionnumber || student.admissionNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-semibold">{student.class}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">Rs. {total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">Rs. {paid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-red-500">Rs. {balance.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {balance <= 0 ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-xs font-bold"><CheckCircle2 size={14} /> Paid</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded text-xs font-bold"><Clock size={14} /> Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => openReceiptModal(student)}
                            title="View Receipt"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Printer size={18} />
                          </button>

                          {balance > 0 ? (
                            <button 
                              onClick={() => openPaymentModal(student, balance)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button disabled className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed">Paid</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: PAYMENT & RECEIPT */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 print:shadow-none print:w-full print:max-w-none">
            
            {showReceipt && receiptData ? (
              // PDF RECEIPT VIEW
              <div className="p-6" id="printable-receipt">
                <div className="text-center mb-6 print:hidden">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Payment Receipt</h2>
                  <p className="text-sm text-slate-500">Generated on {receiptData.date}</p>
                </div>

                {/* Printable Area */}
                <div className="border-2 border-slate-200 rounded-xl p-6 print:border-none print:p-0">
                  
                  {/* RECEIPT HEADER WITH LOGO */}
                  <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4 flex flex-col items-center">
                    <img src="/logo.png" alt="School Logo" className="w-16 h-16 object-contain mb-2" />
                    <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider">AM/ Nugelanda M V</h3>
                    <p className="text-sm text-slate-500 font-medium">Official Fee Receipt</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Receipt No:</span> <span className="font-bold text-slate-800">{receiptData.receiptNo}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Date:</span> <span className="font-medium text-slate-800">{receiptData.date}</span></div>
                    
                    <div className="border-t border-slate-200 my-2 pt-2"></div>
                    
                    <div className="flex justify-between"><span className="text-slate-500">Student Name:</span> <span className="font-bold text-slate-800">{receiptData.studentName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Index/Adm No:</span> <span className="font-medium text-slate-800">{receiptData.admissionNo}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Class:</span> <span className="font-medium text-slate-800">{receiptData.class}</span></div>
                    
                    <div className="border-t border-slate-200 my-2 pt-2"></div>
                    
                    <div className="flex justify-between text-lg">
                      <span className="text-slate-600 font-semibold">Total Paid:</span> 
                      <span className="font-bold text-emerald-600">Rs. {receiptData.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Remaining Balance:</span> 
                      <span className="font-bold text-red-500">Rs. {receiptData.remainingBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-8 text-center text-xs text-slate-400">
                    <p>Thank you for your payment.</p>
                    <p>This is a computer-generated receipt.</p>
                  </div>
                </div>

                {/* Buttons (Hidden when printing) */}
                <div className="flex gap-2 mt-6 print:hidden">
                  <button 
                    onClick={() => setSelectedStudent(null)} 
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                  <button 
                    onClick={downloadPDF}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Printer size={18} /> Print / Save PDF
                  </button>
                </div>
              </div>
            ) : (
              // PAYMENT FORM VIEW
              <>
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                  <h2 className="font-bold text-slate-800">Record Family Payment</h2>
                  <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl uppercase overflow-hidden">
                       {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selectedStudent.name}</p>
                      <p className="text-xs text-slate-500">{selectedStudent.admissionnumber || selectedStudent.admissionNumber}</p>
                      <p className="text-xs text-slate-500 mt-1 font-semibold text-blue-600">Balance: Rs. {(selectedStudent.totalFee - selectedStudent.paidAmount).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Pay (Rs.)</label>
                    <input 
                      type="number" 
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full text-xl font-bold border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-xs flex gap-2 items-start border border-amber-100">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>This payment will automatically be applied to all siblings in this family.</p>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                  <button onClick={() => setSelectedStudent(null)} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition">Cancel</button>
                  <button 
                    onClick={processPayment} 
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}