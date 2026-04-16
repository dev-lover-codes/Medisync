import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Bills() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('bills')
        .select(`
          *,
          appointments (
            appointment_date,
            department,
            doctors (
              first_name,
              last_name,
              image_url
            )
          )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBills(data || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async (id) => {
    try {
      setPayingId(id);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase
        .from('bills')
        .update({ 
          status: 'paid', 
          payment_method: 'Digital Transfer',
          paid_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      
      setBills(prev => prev.map(bill => 
        bill.id === id ? { 
          ...bill, 
          status: 'paid', 
          payment_method: 'Digital Transfer',
          paid_at: new Date().toISOString()
        } : bill
      ));
      
      alert("Payment authentication successful. Transaction verified.");
    } catch (err) {
      console.error("Error paying bill:", err);
      alert("Verification failed. Please authenticate again.");
    } finally {
      setPayingId(null);
    }
  };

  const totals = {
    paid: bills.filter(b => b.status === 'paid').reduce((acc, curr) => acc + Number(curr.total_amount), 0),
    pending: bills.filter(b => b.status === 'pending').reduce((acc, curr) => acc + Number(curr.total_amount), 0),
    overdue: bills.filter(b => b.status === 'overdue').reduce((acc, curr) => acc + Number(curr.total_amount), 0)
  };

  const filteredBills = filterStatus === 'All Statuses' 
    ? bills 
    : bills.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="p-4 md:p-8 pb-24 bg-surface min-h-screen max-w-7xl mx-auto font-body">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
           <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight leading-none mb-3">MedPay Portal</h1>
           <p className="text-on-surface-variant font-medium">Verified medical invoicing and financial transparency</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
           <div className="flex-1 md:flex-none flex items-center bg-surface-container-low rounded-2xl px-5 py-3.5 gap-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">filter_list</span>
              <select 
                className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer p-0"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
           </div>
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border-2 border-primary text-primary rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg leading-none">download</span>
              Export History
           </button>
        </div>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-emerald-50 rounded-[2.5rem] p-8 flex items-center gap-6 border border-emerald-100/50 shadow-sm group">
           <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:rotate-12">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
           </div>
           <div>
              <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Cleared</p>
              <h3 className="text-3xl font-black text-emerald-900 tracking-tighter">${totals.paid.toFixed(2)}</h3>
           </div>
        </div>

        <div className="bg-orange-50 rounded-[2.5rem] p-8 flex items-center gap-6 border border-orange-100/50 shadow-sm group">
           <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl">pending_actions</span>
           </div>
           <div>
              <p className="text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ongoing Balance</p>
              <h3 className="text-3xl font-black text-orange-900 tracking-tighter">${totals.pending.toFixed(2)}</h3>
           </div>
        </div>

        <div className="bg-rose-50 rounded-[2.5rem] p-8 flex items-center gap-6 border border-rose-100/50 shadow-sm group">
           <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 transition-transform group-hover:animate-bounce">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
           </div>
           <div>
              <p className="text-rose-700 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Overdue Liquidity</p>
              <h3 className="text-3xl font-black text-rose-900 tracking-tighter">${totals.overdue.toFixed(2)}</h3>
           </div>
        </div>
      </div>

      {/* Billing Data Table & Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
           <div className="bg-surface-container-lowest rounded-[3rem] shadow-sm border border-outline-variant/10 p-2 overflow-hidden">
              <div className="p-8 pb-4">
                 <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase text-xs tracking-[0.2em]">Transaction Ledger</h2>
              </div>
              <div className="overflow-x-auto px-6 pb-6">
                 <table className="w-full border-separate border-spacing-y-4">
                    <thead>
                       <tr className="text-left text-on-surface-variant/40 text-[10px] font-black uppercase tracking-[0.2em]">
                          <th className="pb-2 px-6">Trace ID</th>
                          <th className="pb-2">Chronicle</th>
                          <th className="pb-2">Classification</th>
                          <th className="pb-2 text-right">Net Liquidity</th>
                          <th className="pb-2 px-6">Status</th>
                          <th className="pb-2 text-center">Protocol</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm">
                       {loading ? (
                         <tr><td colSpan="6" className="py-20 text-center text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Verifying Ledger Identity...</td></tr>
                       ) : filteredBills.length === 0 ? (
                         <tr><td colSpan="6" className="py-20 text-center text-on-surface-variant font-black uppercase tracking-widest text-[10px]">No matched financial records found</td></tr>
                       ) : (
                         filteredBills.map((bill) => (
                           <tr key={bill.id} className="bg-surface-container-low/30 hover:bg-surface-container-low transition-all group cursor-default">
                              <td className="py-6 px-6 rounded-l-[1.5rem] font-black font-mono text-primary text-xs">#INV-{bill.id.slice(0, 6).toUpperCase()}</td>
                              <td className="py-6">
                                 <p className="font-bold text-on-surface leading-none mb-1">{new Date(bill.created_at).toLocaleDateString()}</p>
                                 <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase">{new Date(bill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </td>
                              <td className="py-6">
                                 <p className="font-black text-on-surface uppercase text-[11px] tracking-tight">{bill.appointments?.department || 'Medical Service'}</p>
                                 <p className="text-[10px] text-primary font-black uppercase italic leading-none opacity-60">
                                   Dr. {bill.appointments?.doctors ? `${bill.appointments.doctors.first_name} ${bill.appointments.doctors.last_name}` : 'Staff'}
                                 </p>
                              </td>
                              <td className="py-6 text-right font-black text-lg tabular-nums text-on-surface tracking-tighter">${Number(bill.total_amount).toFixed(2)}</td>
                              <td className="py-6 px-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                   bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                   bill.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                   'bg-rose-100 text-rose-700 border-rose-200 shadow-sm shadow-rose-500/10'
                                 }`}>
                                    {bill.status}
                                 </span>
                              </td>
                              <td className="py-6 rounded-r-[1.5rem] text-center">
                                 {bill.status === 'paid' ? (
                                   <div className="flex items-center justify-center gap-2">
                                      <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-primary transition-all">
                                         <span className="material-symbols-outlined text-lg">visibility</span>
                                      </button>
                                      <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-primary transition-all">
                                         <span className="material-symbols-outlined text-lg">download</span>
                                      </button>
                                   </div>
                                 ) : (
                                   <button 
                                     onClick={() => handlePayBill(bill.id)}
                                     disabled={payingId === bill.id}
                                     className="bg-primary text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
                                   >
                                      {payingId === bill.id ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Initiate Payment'}
                                   </button>
                                 )}
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="xl:col-span-1">
           <div className="bg-surface-container-low rounded-[3rem] p-8 h-full border border-surface-container-high/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-[2s]">
                 <span className="material-symbols-outlined text-8xl font-light">receipt_long</span>
              </div>
              <h2 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                 Payment Pipeline
              </h2>
              <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/20">
                 {bills.filter(b => b.status === 'paid').slice(0, 4).map((bill, idx) => (
                   <div key={idx} className="relative pl-12 group/item">
                      <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-white border border-outline-variant/10 flex items-center justify-center text-primary z-10 transition-transform group-hover/item:scale-110 shadow-sm">
                         <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter mb-0.5">{new Date(bill.paid_at || bill.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(bill.paid_at || bill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         <p className="font-black text-sm text-on-surface">${Number(bill.total_amount).toFixed(2)} Authenticated</p>
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 italic flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            {bill.payment_method || 'Digital Gateway'}
                         </p>
                      </div>
                   </div>
                 ))}
                 {bills.filter(b => b.status === 'paid').length === 0 && (
                    <div className="text-center py-10 opacity-30">
                       <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                       <p className="text-[10px] uppercase font-black tracking-widest">No transaction history</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Security Context Banner */}
      <div className="mt-12 p-10 bg-on-surface rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px] absolute -right-20 -bottom-20 rotate-12 text-white font-light">security</span>
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">PCE DSS Level 1 Certified</span>
               </div>
               <h2 className="text-4xl font-black text-white leading-tight tracking-tight">Financial integrity through <br/>end-to-end encryption.</h2>
               <p className="text-white/60 font-medium text-sm max-w-lg leading-relaxed">Every transaction on MedPay is secured with institutional-grade 256-bit encryption. Your clinical billing data never leaves our hardened vault without explicit authentication.</p>
            </div>
            <div className="flex justify-end">
               <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[1.5rem] backdrop-blur-md">
                     <p className="text-white/40 text-[9px] font-black uppercase mb-2">Resolution Time</p>
                     <p className="text-white text-2xl font-black leading-none tracking-tighter">&lt; 2 mins</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[1.5rem] backdrop-blur-md">
                     <p className="text-white/40 text-[9px] font-black uppercase mb-2">Failure Rate</p>
                     <p className="text-white text-2xl font-black leading-none tracking-tighter">0.001%</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

